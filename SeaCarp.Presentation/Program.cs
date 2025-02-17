using SeaCarp.CrossCutting;
using SeaCarp.CrossCutting.Config;
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

builder.Services
    .AddControllersWithViews()
    .AddJsonOptions(jsonOptions => { })
    .AddMvcOptions(options =>
    {
        var jsonFormatter = options.InputFormatters
            .OfType<Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonInputFormatter>()
            .FirstOrDefault();

        options.InputFormatters.Clear();
        if (jsonFormatter != null)
        {
            jsonFormatter.SupportedMediaTypes.Clear();
            jsonFormatter.SupportedMediaTypes.Add("*/*");
            options.InputFormatters.Add(jsonFormatter);
        }
    });

builder.Services.AddRazorPages();

var app = builder.Build();

ServiceLocator.Instance = app.Services;

app.UseHsts();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseSession();
app.UseSessionAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();

app.UseExceptionHandler("/Error");

app.Run();