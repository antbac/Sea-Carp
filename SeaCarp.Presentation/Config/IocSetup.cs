using SeaCarp.Application.Services;
using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Infrastructure.Repositories;

namespace SeaCarp.Presentation.Config;

public class IocSetup
{
    public static void ConfigureIoc(IServiceCollection services)
    {
        services
            // CrossCutting
            .AddScoped<IHttpService, HttpService>()
            .AddScoped<ICryptographyService, CryptographyService>()
            .AddScoped<IJwtService, JwtService>()

            // Application
            .AddScoped<IAdminService, AdminService>()
            .AddScoped<IOrderService, OrderService>()
            .AddScoped<IProductService, ProductService>()
            .AddScoped<IUserService, UserService>()

            // Infrastructure
            .AddScoped<IAdminRepository, AdminRepository>()
            .AddScoped<IOrderRepository, OrderRepository>()
            .AddScoped<IProductRepository, ProductRepository>()
            .AddScoped<IUserRepository, UserRepository>();
    }
}