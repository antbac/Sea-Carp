using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.Extensions.FileProviders;
using Newtonsoft.Json;
using SeaCarp.CrossCutting;
using SeaCarp.CrossCutting.Config;
using SeaCarp.Presentation;
using SeaCarp.Presentation.Config;
using SeaCarp.Presentation.Middlewares;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<CryptographySettings>(builder.Configuration.GetSection("Cryptography"));

// Add services to the container.
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromSeconds(3600);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

IocSetup.ConfigureIoc(builder.Services);
SystemInformation.LastStarted = DateTime.Now;

builder.Services
    .AddControllersWithViews()
    .AddRazorRuntimeCompilation()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.TypeNameHandling = TypeNameHandling.All;
    })
    .AddMvcOptions(options =>
    {
        // Modify the existing Newtonsoft.Json formatter to accept all media types
        var jsonFormatter = options.InputFormatters
            .OfType<NewtonsoftJsonInputFormatter>()
            .FirstOrDefault();

        if (jsonFormatter != null)
        {
            jsonFormatter.SupportedMediaTypes.Clear();
            jsonFormatter.SupportedMediaTypes.Add("*/*");
        }
    });

builder.Services.Configure<RazorViewEngineOptions>(options =>
{
    options.ViewLocationFormats.Add("~/wwwroot/Views/{0}" + RazorViewEngine.ViewExtension);
});

builder.Services.AddRazorPages();

var app = builder.Build();

ServiceLocator.Instance = app.Services;

app.UseHsts();

app.UseHttpsRedirection();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")),
    RequestPath = "/files",
    ServeUnknownFileTypes = true,
    DefaultContentType = "application/octet-stream"
});

app.UseDirectoryBrowser(new DirectoryBrowserOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")),
    RequestPath = "/files"
});

app.UseRouting();

app.UseSession();
app.UseSessionAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();

app.UseExceptionHandler("/Error");

app.Run();