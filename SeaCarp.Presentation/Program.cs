using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.OpenApi;
using SeaCarp.Application.Jobs;
using SeaCarp.CrossCutting;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Config;
using SeaCarp.Presentation.Middlewares;
using SeaCarp.Presentation.Models.Seed;
using Swashbuckle.AspNetCore.Annotations;
using System.Text.Json;

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

        builder.Services.Configure<CryptographySettings>(builder.Configuration.GetSection("Cryptography"));

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
            options.AddPolicy("AllowCors", builder => builder
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
            .AddNewtonsoftJson()
            .AddMvcOptions(options =>
            {
                var jsonFormatter = options.InputFormatters
                    .OfType<NewtonsoftJsonInputFormatter>()
                    .FirstOrDefault();

                if (jsonFormatter != null)
                {
                    jsonFormatter.SupportedMediaTypes.Clear();
                    jsonFormatter.SupportedMediaTypes.Add("*/*");
                }
            });

        builder.Services.AddHostedService<StockingJob>();
        builder.Services.AddHostedService<SupportHandlerJob>();
        builder.Services.AddHostedService<BugReportReviewJob>();

        builder.Services.AddRazorPages();

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

        {
            using var scope = app.Services.CreateScope();
            scope.ServiceProvider.GetRequiredService<IFileService>().ConfigureRoot(WebRootPath);
        }

        ServiceLocator.Instance = app.Services;

        app.UseForwardedHeaders();

        SetUpDatabase();

        app.UsePwnMiddleware();

        app.UseSwagger();
        app.UseSwaggerUI();

        app.UseStaticFiles();

        app.UseRouting();

        app.UseCors("AllowCors");

        app.UseSession();
        app.UseSystemCallLimiter();
        app.UseAuthenticationLevelRequirement();
        app.UseJwtAuthentication();

        app.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}");

        app.MapRazorPages();

        app.UseExceptionHandler("/Error");

        app.UsePrettyErrorMessages();

        app.Run();
    }

    private static void SetUpDatabase()
    {
        var usersFilePath = MapPath("../users.json");
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

        using var scope = ServiceLocator.Instance.CreateScope();
        var cryptographyService = scope.ServiceProvider.GetRequiredService<ICryptographyService>();

        var initialUsers = seed.Users.Select(user => SeaCarp.Domain.Models.User.Create(
            username: user.Username,
            email: user.Email,
            password: cryptographyService.NewSecureString(user.PasswordStrength),
            credits: user.Credits,
            profilePicture: user.ProfilePicture,
            isAdmin: user.IsAdmin,
            isCaseOfficer: user.IsCaseOfficer));

        SeaCarp.Infrastructure.Database.Initialize(initialUsers, cryptographyService);
    }
}