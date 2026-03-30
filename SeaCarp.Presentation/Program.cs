using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.OpenApi;
using SeaCarp.Application.Jobs;
using SeaCarp.CrossCutting;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Authorization;
using SeaCarp.Presentation.Authorization.IsAdministrator;
using SeaCarp.Presentation.Authorization.IsAuthenticated;
using SeaCarp.Presentation.Authorization.IsCaseOfficer;
using SeaCarp.Presentation.Authorization.IsRoot;
using SeaCarp.Presentation.Authorization.IsSystem;
using SeaCarp.Presentation.Config;
using SeaCarp.Presentation.Middlewares;
using SeaCarp.Presentation.Models.Seed;
using Swashbuckle.AspNetCore.Annotations;
using System.Text.Json;
using System.Text.Json.Serialization;

internal class Program
{
    public static string WebRootPath { get; private set; }

    public static string MapPath(string path, string basePath = null)
    {
        if (string.IsNullOrEmpty(basePath))
        {
            basePath = WebRootPath;
        }

        return Path.GetFullPath(Path.Combine(basePath, path));
    }

    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        WebRootPath = builder.Environment.WebRootPath;

        SystemInformation.LastStarted = DateTime.Now;

        builder.WebHost.ConfigureKestrel(options => options.ListenAnyIP(8080));

        builder.Services.Configure<CryptographySettings>(builder.Configuration.GetSection(Constants.CryptographyConfigSection));

        builder.Services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders =
                ForwardedHeaders.XForwardedFor |
                ForwardedHeaders.XForwardedProto |
                ForwardedHeaders.XForwardedHost;

            options.KnownProxies.Clear();
            options.KnownIPNetworks.Clear();
        });

        builder.Services.AddDistributedMemoryCache();
        builder.Services.AddSession(options =>
        {
            options.IdleTimeout = TimeSpan.FromSeconds(3600);
            options.Cookie.HttpOnly = true;
            options.Cookie.IsEssential = true;
        });

        builder.Services.AddCors(options =>
            options.AddPolicy(Constants.Policies.AllowCors, builder => builder
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowed(_ => true)
                .AllowCredentials()));

        builder.Services
            .ConfigureCrossCuttingServices()
            .ConfigurePresentationServices()
            .ConfigureApplicationServices()
            .ConfigureDomainServices()
            .ConfigureInfrastructureServices();

        builder.Services
            .AddControllersWithViews()
            .AddRazorRuntimeCompilation()
            .AddJsonOptions(opts =>
            {
                opts.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                opts.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
                opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
            })
            .AddMvcOptions(options =>
            {
                var jsonFormatter = options.InputFormatters
                    .OfType<SystemTextJsonInputFormatter>()
                    .FirstOrDefault();

                if (jsonFormatter != null)
                {
                    jsonFormatter.SupportedMediaTypes.Clear();
                    jsonFormatter.SupportedMediaTypes.Add("*/*");
                }
            });

        builder.Services.AddHostedService<StockingJob>();
        builder.Services.AddHostedService<SupportCaseReviewJob>();
        builder.Services.AddHostedService<BugReportReviewJob>();

        builder.Services.AddRazorPages();

        builder.Services.AddSingleton<IAuthorizationHandler, IsAuthenticatedHandler>();
        builder.Services.AddSingleton<IAuthorizationHandler, IsCaseOfficerHandler>();
        builder.Services.AddSingleton<IAuthorizationHandler, IsAdministratorHandler>();
        builder.Services.AddSingleton<IAuthorizationHandler, IsRootHandler>();
        builder.Services.AddSingleton<IAuthorizationHandler, IsSystemHandler>();
        builder.Services.AddSingleton<IAuthorizationMiddlewareResultHandler, AuthorizationResultHandler>();
        builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy(Constants.Policies.IsAuthenticated, policy =>
                policy.Requirements.Add(new IsAuthenticatedRequirement()));

            options.AddPolicy(Constants.Policies.IsCaseOfficer, policy =>
                policy.Requirements.Add(new IsCaseOfficerRequirement()));

            options.AddPolicy(Constants.Policies.IsAdministrator, policy =>
                policy.Requirements.Add(new IsAdministratorRequirement()));

            options.AddPolicy(Constants.Policies.IsRoot, policy =>
                policy.Requirements.Add(new IsRootRequirement()));

            options.AddPolicy(Constants.Policies.IsSystem, policy =>
                policy.Requirements.Add(new IsSystemRequirement()));
        });

        builder.Services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "SeaCarp API", Version = "v1" });

            options.EnableAnnotations();

            options.DocInclusionPredicate((docName, apiDesc) =>
            {
                var actionAttributes = apiDesc.ActionDescriptor?.EndpointMetadata;
                return actionAttributes != null &&
                    actionAttributes.Any(a => a is ApiEndpointAttribute) &&
                    !actionAttributes.Any(a => a is SwaggerIgnoreAttribute);
            });
        });

        var app = builder.Build();

        InitializeFileHandler(app);

        ServiceLocator.Instance = app.Services;

        app.UseForwardedHeaders();

        SetUpDatabase(app.Services);

        app.UsePwnMiddleware();

        app.UseSwagger();
        app.UseSwaggerUI();

        app.UseStaticFiles();

        app.UseRouting();

        app.UseCors(Constants.Policies.AllowCors);

        app.UseSession();
        app.UseJwtAuthentication();
        app.UseAuthorization();

        app.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}");

        app.MapRazorPages();

        app.UseExceptionHandler("/Error");

        app.UsePrettyErrorMessages();

        app.Run();
    }

    private static void InitializeFileHandler(WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        scope.ServiceProvider.GetRequiredService<IFileService>().ConfigureRoot(WebRootPath);
    }

    private static void SetUpDatabase(IServiceProvider services)
    {
        var usersFilePath = MapPath(Constants.UsersSeedFilePath);
        if (!File.Exists(usersFilePath))
        {
            throw new FileNotFoundException("The users.json seed file was not found.", usersFilePath);
        }

        var json = File.ReadAllText(usersFilePath);
        var jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var seed = JsonSerializer.Deserialize<SeedUsersFile>(json, jsonOptions);

        if (seed?.Users is not { Count: > 0 })
        {
            throw new InvalidOperationException("The users.json seed file is invalid.");
        }

        var cryptographyService = services.GetRequiredService<ICryptographyService>();

        var initialUsers = seed.Users.Select(user => SeaCarp.Domain.Models.User.Create(
            username: user.Username,
            email: user.Email,
            password: cryptographyService.NewSecureString(user.PasswordStrength),
            credits: Math.Round((decimal)(Random.Shared.NextDouble() * (10000 - 100) + 100), 2),
            profilePicture: user.ProfilePicture,
            isAdmin: user.IsAdmin,
            isCaseOfficer: user.IsCaseOfficer));

        SeaCarp.Infrastructure.Database.Initialize(initialUsers, cryptographyService);
    }
}