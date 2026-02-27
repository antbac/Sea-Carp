using Microsoft.Extensions.DependencyInjection;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Infrastructure.Repositories;

namespace SeaCarp.Infrastructure;

public static class IocSetup
{
    public static IServiceCollection ConfigureServices(this IServiceCollection services) =>
        services
            .AddScoped<IBugReportRepository, BugReportRepository>()
            .AddScoped<IDebugRepository, DebugRepository>()
            .AddScoped<IOrderRepository, OrderRepository>()
            .AddScoped<IProductRepository, ProductRepository>()
            .AddScoped<ISupportCaseRepository, SupportCaseRepository>()
            .AddScoped<IUserRepository, UserRepository>();
}