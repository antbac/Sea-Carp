using elFinder.Net.AspNetCore.Extensions;
using elFinder.Net.Drivers.FileSystem.Extensions;
using elFinder.Net.Drivers.FileSystem.Helpers;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.DependencyInjection;
using SeaCarp.Application.Jobs;
using SeaCarp.CrossCutting;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation;
using SeaCarp.Presentation.Config;
using SeaCarp.Presentation.Middlewares;

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

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
            });
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

        IocSetup.ConfigureIoc(builder.Services);
        SystemInformation.LastStarted = DateTime.Now;
        SystemInformation.PasswordSalt = builder.Configuration["Cryptography:PasswordSalt"];

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

        var app = builder.Build();

        {
            using var scope = app.Services.CreateScope();
            scope.ServiceProvider.GetRequiredService<IFileService>().ConfigureRoot(WebRootPath);
        }

        ServiceLocator.Instance = app.Services;

        app.UsePwnMiddleware();

        app.UseHsts();
        app.UseHttpsRedirection();

        app.UseStaticFiles();

        app.UseRouting();
        app.UseCors("AllowFrontend");

        app.UseCors("AllowCors");

        app.UseSession();
        app.UseSessionAuthorization();

        app.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}");

        app.MapRazorPages();

        app.UseExceptionHandler("/Error");

        app.UsePrettyErrorMessages();

        app.Run();
    }
}