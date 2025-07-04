namespace SeaCarp.Presentation.Config;

public static class IocSetup
{
    public static IServiceCollection ConfigureCrossCuttingServices(this IServiceCollection services) =>
        CrossCutting.IocSetup.ConfigureServices(services);

    public static IServiceCollection ConfigureApplicationServices(this IServiceCollection services) =>
        Application.IocSetup.ConfigureServices(services);

    public static IServiceCollection ConfigureDomainServices(this IServiceCollection services) =>
        Domain.IocSetup.ConfigureServices(services);

    public static IServiceCollection ConfigureInfrastructureServices(this IServiceCollection services) =>
        Infrastructure.IocSetup.ConfigureServices(services);
}