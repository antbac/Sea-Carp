using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OpenQA.Selenium.Chrome;
using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Jobs;

public class SupportHandlerJob(IServiceScopeFactory scopeFactory) : BackgroundService
{
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

            var supportCases = supportCaseRepository.GetUnhandledSupportCases();

            if (supportCases.Count > 0)
            {
                try
                {
                    var user = await GetCaseOfficer(userRepository);
                    if (user is null)
                    {
                        logService.Warning("No case officer available to process support cases.");
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

                            foreach (var supportCase in supportCases)
                            {
                                try
                                {
                                    var caseNumber = supportCase.CaseNumber;
                                    var baseUrl = "http://localhost:8080";
                                    var supportCaseUrl = $"{baseUrl}/Support/{caseNumber}";

                                    driver.Navigate().GoToUrl(supportCaseUrl);

                                    var cookie = new OpenQA.Selenium.Cookie(
                                        name: Constants.JWT,
                                        value: jwt,
                                        domain: new Uri(baseUrl).DnsSafeHost,
                                        path: "/",
                                        expiry: null,
                                        secure: false,
                                        isHttpOnly: true,
                                        sameSite: "Lax");

                                    driver.Manage().Cookies.AddCookie(cookie);
                                    driver.Navigate().Refresh();

                                    await Task.Delay(1000, stoppingToken);

                                    supportCase.UpdateStatus(SupportCaseStatus.InProgress);
                                    supportCase.AssignCaseOfficer(user);
                                    supportCaseRepository.UpdateCase(supportCase);

                                    logService.Information($"Case {caseNumber} was assigned to {user.Username}");
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

    private static async Task<User> GetCaseOfficer(IUserRepository userRepository)
    {
        var handleOfficerIds = new[] { 2, 3, 4, 5 };
        var users = userRepository.GetAllUsers();
        return users
            .Where(u => u.IsCaseOfficer)
            .Where(u => handleOfficerIds.Contains(u.Id))
            .PickOne();
    }
}