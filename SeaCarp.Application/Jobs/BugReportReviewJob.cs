using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OpenQA.Selenium.Chrome;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Jobs;

public class BugReportReviewJob(IServiceScopeFactory scopeFactory) : BackgroundService
{
    private readonly TimeSpan _interval = TimeSpan.FromSeconds(10);

    private readonly IServiceScopeFactory _scopeFactory = scopeFactory;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();
            var logService = scope.ServiceProvider.GetRequiredService<ILogService<BugReportReviewJob>>();
            var jwtService = scope.ServiceProvider.GetRequiredService<IJwtService>();
            var userRepository = scope.ServiceProvider.GetRequiredService<IUserRepository>();
            var bugReportRepository = scope.ServiceProvider.GetRequiredService<IBugReportRepository>();

            var openBugReports = bugReportRepository.GetOpenBugReports();

            if (openBugReports.Count > 0)
            {
                logService.Information($"{openBugReports.Count} newly opened bug reports found requiring review.");
                try
                {
                    var user = await GetAdmin(userRepository);
                    if (user is null)
                    {
                        logService.Warning("No administrators available to review open bug reports.");
                        return;
                    }

                    var jwt = jwtService.GenerateJwt(
                        (nameof(User.Id), user.Id.ToString()),
                        (nameof(User.Username), user.Username),
                        (nameof(User.Password), user.Password),
                        (nameof(User.Email), user.Email),
                        (nameof(User.Credits), user.Credits.ToString()),
                        (nameof(User.IsCaseOfficer), user.IsCaseOfficer.ToString()),
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

                            try
                            {
                                var baseUrl = Constants.AppBaseUrl;
                                await driver.Navigate().GoToUrlAsync(baseUrl);

                                var cookie = new OpenQA.Selenium.Cookie(
                                    name: Constants.JWT,
                                    value: jwt,
                                    domain: new Uri(baseUrl).DnsSafeHost,
                                    path: "/",
                                    expiry: null,
                                    secure: false,
                                    isHttpOnly: true,
                                    sameSite: Constants.CookieSameSiteLax);

                                driver.Manage().Cookies.AddCookie(cookie);

                                var adminUrl = $"{baseUrl}/admin";
                                await driver.Navigate().GoToUrlAsync(adminUrl);

                                await Task.Delay(1000, stoppingToken);

                                foreach (var bugReport in openBugReports)
                                {
                                    bugReportRepository.CloseBugReport(bugReport.Id);
                                }

                                logService.Information($"Administrator {user.Username} reviewed and closed all active bug reports");
                            }
                            catch (Exception ex)
                            {
                                logService.Error($"Error processing bug reports: {ex.Message}");
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
                    logService.Error($"Unexpected error in bug report review job: {ex.Message}");
                }
            }

            await Task.Delay(_interval, stoppingToken);
        }
    }

    private static async Task<User> GetAdmin(IUserRepository userRepository)
    {
        var adminIds = new[] { 1 };
        var users = userRepository.GetAllUsers();
        return users
            .Where(u => u.IsAdmin)
            .Where(u => adminIds.Contains(u.Id))
            .PickOne();
    }
}