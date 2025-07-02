using Microsoft.Extensions.DependencyInjection;

namespace SeaCarp.Domain;

public static class IocSetup
{
    public static IServiceCollection ConfigureServices(this IServiceCollection services) => services;
}