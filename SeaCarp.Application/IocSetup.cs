using Microsoft.Extensions.DependencyInjection;
using SeaCarp.Application.Services;
using SeaCarp.Application.Services.Abstractions;

namespace SeaCarp.Application;

public static class IocSetup
{
    public static IServiceCollection ConfigureServices(this IServiceCollection services) =>
        services
            .AddScoped<IOrderService, OrderService>()
            .AddScoped<IProductService, ProductService>()
            .AddScoped<ISupportCaseService, SupportCaseService>()
            .AddScoped<IUserService, UserService>()
            .AddScoped<IBugReportService, BugReportService>()
            .AddScoped<IDebugService, DebugService>();
}