using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OpenQA.Selenium.Chrome;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;
using System.Runtime.InteropServices;

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
            var productRepository = scope.ServiceProvider.GetRequiredService<IProductRepository>();
            var logService = scope.ServiceProvider.GetRequiredService<ILogService>();
            var jwtService = scope.ServiceProvider.GetRequiredService<IJwtService>();
            var userRepository = scope.ServiceProvider.GetRequiredService<IUserRepository>();
            var supportCaseRepository = scope.ServiceProvider.GetRequiredService<ISupportCaseRepository>();

            var user = await userRepository.GetUser(1);
            var jwt = jwtService.GenerateJwt(
                (nameof(User.Id), user.Id.ToString()),
                (nameof(User.Username), user.Username),
                (nameof(User.Password), user.Password),
                (nameof(User.Email), user.Email),
                (nameof(User.Credits), user.Credits.ToString()),
                (nameof(User.IsAdmin), user.IsAdmin.ToString())
            );

            var supportCases = await supportCaseRepository.GetRecentSupportCases(_lastRun);
            _lastRun = DateTime.Now;

            if (supportCases.Count > 0)
            {
                try
                {
                    var options = new ChromeOptions();
                    options.AddArgument("--headless");
                    options.AddArgument("--no-sandbox");
                    options.AddArgument("--disable-dev-shm-usage");
                    options.AddArgument("--disable-gpu");
                    options.AddArgument("--window-size=1920,1080");
                    options.AddArgument("--ignore-certificate-errors");
                    options.AddArgument("--ignore-ssl-errors=yes");

                    var isRunningInDocker = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";
                    var isLinux = RuntimeInformation.IsOSPlatform(OSPlatform.Linux);

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

                                    string baseUrl;
                                    if (isRunningInDocker)
                                    {
                                        baseUrl = "http://seacarp-app";
                                        logService.Information($"Using Docker service URL: {baseUrl}");
                                    }
                                    else
                                    {
                                        baseUrl = $"https://localhost:{Environment.GetEnvironmentVariable("ASPNETCORE_HTTPS_PORT") ?? "443"}";
                                        logService.Information($"Using local URL: {baseUrl}");
                                    }

                                    var supportCaseUrl = $"{baseUrl}/Support/{caseNumber}";

                                    driver.Navigate().GoToUrl(supportCaseUrl);

                                    var cookie = new OpenQA.Selenium.Cookie(Constants.JWT, jwt, "/", null);
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
                        catch (Exception)
                        {
                            if (attemptCount < 3)
                            {
                                await Task.Delay(2000, stoppingToken);
                            }
                        }
                    }
                }
                catch (Exception)
                {
                }
            }

            await Task.Delay(_interval, stoppingToken);
        }
    }
}