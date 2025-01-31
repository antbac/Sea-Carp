using SeaCarp.Presentation.Config;
using SeaCarp.Presentation.Middlewares;

var builder = WebApplication.CreateBuilder(args);

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
    .AddJsonOptions(jsonOptions =>
    {
        // Optional: configure System.Text.Json here if needed
    })
    // 2) Now configure the MvcOptions where the input formatters actually live
    .AddMvcOptions(options =>
    {
        // Find the existing JSON input formatter in the list
        var jsonFormatter = options.InputFormatters
            .OfType<Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonInputFormatter>()
            .FirstOrDefault();

        // Remove everything so ONLY JSON remains
        options.InputFormatters.Clear();

        // If the JSON formatter was found, tweak it to accept anything
        if (jsonFormatter != null)
        {
            // Remove the usual "application/json" if you like
            jsonFormatter.SupportedMediaTypes.Clear();

            // Tell it to accept everything
            jsonFormatter.SupportedMediaTypes.Add("*/*");

            // Re-add the JSON formatter back into the list
            options.InputFormatters.Add(jsonFormatter);
        }
    });
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseExceptionHandler("/Home/Error");
// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
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

#if DEBUG
app.UseDeveloperExceptionPage();
#endif

app.Run();