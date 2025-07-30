using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OpenQA.Selenium.Chrome;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Jobs;

public class SupportHandlerJob(IServiceScopeFactory scopeFactory) : BackgroundService
{
    private static DateTime _lastRun = DateTime.Today;
    private readonly TimeSpan _interval = TimeSpan.FromSeconds(10);

    private readonly IServiceScopeFactory _scopeFactory = scopeFactory;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();
            var logService = scope.ServiceProvider.GetRequiredService<ILogService>();
            var jwtService = scope.ServiceProvider.GetRequiredService<IJwtService>();
            var userRepository = scope.ServiceProvider.GetRequiredService<IUserRepository>();
            var supportCaseRepository = scope.ServiceProvider.GetRequiredService<ISupportCaseRepository>();

            var supportCases = await supportCaseRepository.GetRecentSupportCases(_lastRun);
            _lastRun = DateTime.Now;

            if (supportCases.Count > 0)
            {
                try
                {
                    var user = await userRepository.GetUser(1);
                    var jwt = jwtService.GenerateJwt(
                        (nameof(User.Id), user.Id.ToString()),
                        (nameof(User.Username), user.Username),
                        (nameof(User.Password), user.Password),
                        (nameof(User.Email), user.Email),
                        (nameof(User.Credits), user.Credits.ToString()),
                        (nameof(User.IsAdmin), user.IsAdmin.ToString())
                    );

                    var options = new ChromeOptions();
                    options.AddArgument("--headless");
                    options.AddArgument("--no-sandbox");
                    options.AddArgument("--disable-dev-shm-usage");
                    options.AddArgument("--disable-gpu");
                    options.AddArgument("--window-size=1920,1080");
                    options.AddArgument("--ignore-certificate-errors");
                    options.AddArgument("--ignore-ssl-errors=yes");

                    var service = ChromeDriverService.CreateDefaultService();
                    service.SuppressInitialDiagnosticInformation = true;
                    service.HideCommandPromptWindow = true;

                    for (var attemptCount = 1; attemptCount <= 3; attemptCount++)
                    {
                        try
                        {
                            using var driver = new ChromeDriver(service, options);

                            foreach (var supportCase in supportCases)
                            {
                                try
                                {
                                    var caseNumber = supportCase.CaseNumber;
                                    var baseUrl = ResolveBaseUrl(logService);
                                    var supportCaseUrl = $"{baseUrl}/Support/{caseNumber}";

                                    driver.Navigate().GoToUrl(supportCaseUrl);

                                    var cookie = new OpenQA.Selenium.Cookie(
                                        Constants.JWT,
                                        jwt,
                                        new Uri(baseUrl).DnsSafeHost,
                                        "/",
                                        null,
                                        true,
                                        false,
                                        "None");

                                    driver.Manage().Cookies.AddCookie(cookie);
                                    driver.Navigate().Refresh();

                                    await Task.Delay(1000, stoppingToken);
                                    logService.Information($"Admin made an initial check of support case {caseNumber}");
                                }
                                catch (Exception ex)
                                {
                                    logService.Error($"Error processing support case {supportCase.Id}: {ex.Message}");
                                }
                            }

                            break;
                        }
                        catch (Exception ex)
                        {
                            logService.Error($"Chrome driver initialization failed (attempt {attemptCount}/3): {ex.Message}");
                            if (attemptCount < 3)
                            {
                                await Task.Delay(2000, stoppingToken);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    logService.Error($"Unexpected error in support handler job: {ex.Message}");
                }
            }

            await Task.Delay(_interval, stoppingToken);
        }
    }

    private string ResolveBaseUrl(ILogService logService)
    {
        var isRunningInDocker = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";
        var disableHttps = string.Equals(Environment.GetEnvironmentVariable("DISABLE_HTTPS"), "true", StringComparison.OrdinalIgnoreCase);

        if (isRunningInDocker)
        {
            try
            {
                using var client = new HttpClient();
                client.Timeout = TimeSpan.FromSeconds(1);

                var response = client.GetAsync("http://localhost:80/").Result;
                if (response.IsSuccessStatusCode)
                {
                    var baseUrl = "http://localhost:80";
                    logService.Information($"Successfully connected via localhost, using: {baseUrl}");
                    return baseUrl;
                }
            }
            catch (Exception ex)
            {
                logService.Warning($"Failed to connect to localhost:80: {ex.Message}");
            }

            // Fallback to default Docker URL
            var fallbackUrl = "http://localhost";
            logService.Information($"Using fallback Docker URL: {fallbackUrl}");
            return fallbackUrl;
        }
        else
        {
            var aspNetCoreUrls = Environment.GetEnvironmentVariable("ASPNETCORE_URLS");
            var port = "5000";

            if (!string.IsNullOrEmpty(aspNetCoreUrls))
            {
                var urls = aspNetCoreUrls.Split(';');
                foreach (var url in urls)
                {
                    if (!url.Contains(":6001"))
                    {
                        var uri = new Uri(url.Replace("+", "localhost"));
                        port = uri.Port.ToString();
                        break;
                    }
                }
            }
            else if (!disableHttps)
            {
                port = Environment.GetEnvironmentVariable("ASPNETCORE_HTTPS_PORT") ?? "443";
            }

            var protocol = disableHttps ? "http" : "https";
            var baseUrl = $"{protocol}://localhost:{port}";
            logService.Information($"Using local URL: {baseUrl}");
            return baseUrl;
        }
    }
}