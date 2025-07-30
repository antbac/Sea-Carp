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
using SeaCarp.Infrastructure;
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

        // Check if we should disable HTTPS (useful for Docker containers without certificates)
        var useHttps = !string.Equals(Environment.GetEnvironmentVariable("DISABLE_HTTPS"), "true", StringComparison.OrdinalIgnoreCase);

        // Check if ASPNETCORE_URLS is set (common in Docker)
        var aspNetCoreUrls = Environment.GetEnvironmentVariable("ASPNETCORE_URLS");
        var useEnvironmentUrls = !string.IsNullOrEmpty(aspNetCoreUrls);

        if (!useEnvironmentUrls)
        {
            // Only configure explicit Kestrel options if ASPNETCORE_URLS is not set
            builder.WebHost.ConfigureKestrel(options =>
            {
                // Public endpoint
                if (useHttps)
                {
                    options.ListenAnyIP(5000, opt => opt.UseHttps());
                }
                else
                {
                    options.ListenAnyIP(5000); // HTTP only
                }

                // Private, localhost-only endpoint
                if (useHttps)
                {
                    options.ListenLocalhost(6001, opt => opt.UseHttps());
                }
                else
                {
                    options.ListenLocalhost(6001); // HTTP only
                }
            });
        }
        else
        {
            Console.WriteLine($"Using environment-provided URLs: {aspNetCoreUrls}");
        }

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

        SystemInformation.LastStarted = DateTime.Now;
        SystemInformation.PasswordSalt = builder.Configuration["Cryptography:PasswordSalt"];

        // Dynamically determine deployment technology and ports
        var deploymentTechnology = "ASP.NET Core";
        var ports = string.Empty;

        // Check if running in Docker container
        var inDocker = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";
        if (inDocker)
        {
            deploymentTechnology = "Containerized with Docker, running ASP.NET Core Kestrel web server";

            // Get port mapping from environment variables or docker-compose configuration
            if (!string.IsNullOrEmpty(aspNetCoreUrls))
            {
                // Parse the URLs to extract ports
                var urlParts = aspNetCoreUrls.Split(';');
                foreach (var part in urlParts)
                {
                    if (part.Contains("http://+:"))
                    {
                        var internalPort = part.Split(':').Last();
                        // In Docker we typically map internal port to external port
                        ports = $"port {internalPort} (internal), mapped to port 8080 on host";
                        break;
                    }
                }
            }

            if (string.IsNullOrEmpty(ports))
            {
                ports = "port 80 (internal), mapped to port 8080 on host"; // Default if not found in environment
            }
        }
        else
        {
            // Not running in Docker
            if (!useEnvironmentUrls)
            {
                deploymentTechnology += " Kestrel";
                ports = "port 5000";
                if (useHttps)
                {
                    ports += " with HTTPS";
                }

                ports += " (public)";
            }
            else
            {
                deploymentTechnology += " Kestrel with custom URLs";

                // Filter out localhost:6001 from the displayed ports
                if (!string.IsNullOrEmpty(aspNetCoreUrls))
                {
                    // Split the URLs and filter out any that contain port 6001
                    var urlParts = aspNetCoreUrls.Split(';')
                        .Where(url => !url.Contains(":6001"))
                        .ToArray();

                    ports = urlParts.Length > 0
                        ? string.Join("; ", urlParts)
                        : "custom ports";
                }
                else
                {
                    ports = "custom ports";
                }
            }

            // Check if potentially running behind IIS
            if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("ASPNETCORE_IIS_HTTPAUTH")) ||
                !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("IIS_DRIVE_LETTER")))
            {
                deploymentTechnology = "IIS with ASP.NET Core";
            }
        }

        SystemInformation.DeploymentTechnology = deploymentTechnology;
        SystemInformation.Ports = ports;

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
                        <p>This is served on localhost:6001 only.</p>

                        <h2>System Information</h2>
                        <table>
                            <tr><th>Property</th><th>Value</th></tr>
                            <tr><td>Last Started</td><td>" + SystemInformation.LastStarted + @"</td></tr>
                            <tr><td>Repository URL</td><td>" + SystemInformation.RepositoryUrl + @"</td></tr>
                            <tr><td>Current Version</td><td>" + SystemInformation.CurrentVersion + @"</td></tr>
                            <tr><td>Password Salt</td><td>" + SystemInformation.PasswordSalt + @"</td></tr>
                            <tr><td>Deployment Technology</td><td>" + SystemInformation.DeploymentTechnology + @"</td></tr>
                            <tr><td>Ports</td><td>" + SystemInformation.Ports + @"</td></tr>
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

        app.UseHsts();
        app.UseHttpsRedirection();

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