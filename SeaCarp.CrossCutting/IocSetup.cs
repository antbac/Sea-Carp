using Microsoft.Extensions.DependencyInjection;
using SeaCarp.CrossCutting.Services;
using SeaCarp.CrossCutting.Services.Abstractions;

namespace SeaCarp.CrossCutting;

public static class IocSetup
{
    public static IServiceCollection ConfigureServices(this IServiceCollection services) =>
        services
            .AddScoped<ICryptographyService, CryptographyService>()
            .AddSingleton<IEnvironmentInformationService, EnvironmentInformationService>()
            .AddSingleton<IExternalLibsService, ExternalLibsService>()
            .AddScoped<IFileService, FileService>()
            .AddScoped<IHttpService, HttpService>()
            .AddScoped<IJwtService, JwtService>()
            .AddScoped<ILogService, LogService>()
            .AddScoped<ITimeService, TimeService>();
}