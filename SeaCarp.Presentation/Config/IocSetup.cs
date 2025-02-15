using SeaCarp.Application.Services.Abstractions;
using SeaCarp.Application.Services;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Infrastructure.Repositories;

namespace SeaCarp.Presentation.Config;

public class IocSetup
{
    public static void ConfigureIoc(IServiceCollection services)
    {
        services
            .AddScoped<IUserRepository, UserRepository>()
            .AddScoped<IProductRepository, ProductRepository>()
            .AddScoped<IOrderRepository, OrderRepository>()
            .AddScoped<IAdminRepository, AdminRepository>()
            .AddScoped<IProductService, ProductService>()
            .AddScoped<IOrderService, OrderService>()
            .AddScoped<IUserService, UserService>();
    }
}