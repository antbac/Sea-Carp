using elFinder.Net.AspNetCore.Extensions;
using elFinder.Net.Drivers.FileSystem.Extensions;
using elFinder.Net.Drivers.FileSystem.Helpers;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using SeaCarp.Application.Jobs;
using SeaCarp.CrossCutting;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation;
using SeaCarp.Presentation.Attributes;
using SeaCarp.Presentation.Config;
using SeaCarp.Presentation.Middlewares;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;

internal class Program
{
    public static string WebRootPath { get; private set; }
    public static string SitePwnedBy { get; set; }

    public static string MapPath(string path, string basePath = null)
    {
        if (string.IsNullOrEmpty(basePath))
        {
            basePath = WebRootPath;
        }

        path = path.Replace("~/", "").TrimStart('/').Replace('/', '\\');
        return PathHelper.GetFullPath(Path.Combine(basePath, path));
    }

    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        WebRootPath = builder.Environment.WebRootPath;

        SystemInformation.LastStarted = DateTime.Now;
        SystemInformation.PasswordSalt = builder.Configuration["Cryptography:PasswordSalt"];

        builder.WebHost.ConfigureKestrel(options =>
        {
            if (SystemInformation.IsRunningInsideDocker)
            {
                var certPath = builder.Configuration["Kestrel:Certificates:Default:Path"];
                var certPassword = builder.Configuration["Kestrel:Certificates:Default:Password"];

                options.ListenAnyIP(5000);
                options.ListenLocalhost(6001, opt => opt.UseHttps(certPath, certPassword));
            }
            else
            {
                options.ListenAnyIP(5000, opt => opt.UseHttps());
                options.ListenLocalhost(6001, opt => opt.UseHttps());
            }
        });

        builder.Services.Configure<CryptographySettings>(builder.Configuration.GetSection("Cryptography"));

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

        builder.Services
            .AddElFinderAspNetCore()
            .AddFileSystemDriver();

        builder.Services.AddRazorPages();

        builder.Services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "SeaCarp API", Version = "v1" });

            // Enable Swagger annotations to process SwaggerOperation and SwaggerResponse attributes
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

        app.Use(async (context, next) =>
        {
            if (context.Connection.LocalPort == 6001)
            {
                var remoteIp = context.Connection.RemoteIpAddress;

                if (!IPAddress.IsLoopback(remoteIp))
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    await context.Response.WriteAsync("Forbidden");
                    return;
                }

                var cryptographySettings = context.RequestServices.GetService<IOptions<CryptographySettings>>().Value;
                context.Response.ContentType = "text/html";
                await context.Response.WriteAsync(@"
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Admin Information</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            h1 { color: #0066cc; }
                            h2 { color: #0099cc; margin-top: 20px; }
                            table { border-collapse: collapse; width: 100%; margin-top: 10px; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #f2f2f2; }
                            tr:nth-child(even) { background-color: #f9f9f9; }
                        </style>
                    </head>
                    <body>
                        <h1>Internal Admin Dashboard</h1>
                        <p>This is served on port 6001 locally only.</p>

                        <h2>System Information</h2>
                        <table>
                            <tr><th>Property</th><th>Value</th></tr>
                            <tr><td>Last Started</td><td>" + SystemInformation.LastStarted + @"</td></tr>
                            <tr><td>Repository URL</td><td>" + SystemInformation.RepositoryUrl + @"</td></tr>
                            <tr><td>Current Version</td><td>" + SystemInformation.CurrentVersion + @"</td></tr>
                            <tr><td>Password Salt</td><td>" + SystemInformation.PasswordSalt + @"</td></tr>
                            <tr><td>Deployment Technology</td><td>" + SystemInformation.DeploymentTechnology + @"</td></tr>
                        </table>

                        <h2>Application Settings</h2>
                        <table>
                            <tr><th>Key</th><th>Value</th></tr>
                            <tr><td>AllowedHosts</td><td>" + builder.Configuration["AllowedHosts"] + @"</td></tr>
                            <tr><td>Logging:LogLevel:Default</td><td>" + builder.Configuration["Logging:LogLevel:Default"] + @"</td></tr>
                            <tr><td>Logging:LogLevel:Microsoft.AspNetCore</td><td>" + builder.Configuration["Logging:LogLevel:Microsoft.AspNetCore"] + @"</td></tr>
                            <tr><td>Cryptography:AdminAuthenticationKey</td><td>" + cryptographySettings.AdminAuthenticationKey + @"</td></tr>
                            <tr><td>Cryptography:JwtEncryptionKey</td><td>" + cryptographySettings.JwtEncryptionKey + @"</td></tr>
                            <tr><td>Cryptography:PasswordSalt</td><td>" + cryptographySettings.PasswordSalt + @"</td></tr>
                        </table>
                    </body>
                    </html>");
                return;
            }

            await next();
        });

        app.UsePwnMiddleware();

        app.UseSwagger();
        app.UseSwaggerUI();

        app.UseStaticFiles();

        app.UseRouting();

        app.UseCors("AllowCors");

        app.UseSession();
        app.UseJwtAuthentication();

        app.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}");

        app.MapRazorPages();

        app.UseExceptionHandler("/Error");

        app.UsePrettyErrorMessages();

        app.Run();
    }
}