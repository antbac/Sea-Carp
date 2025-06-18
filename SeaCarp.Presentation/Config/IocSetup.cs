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
            .AddScoped<ICryptographyService, CryptographyService>()
            .AddSingleton<IEnvironmentInformationService, EnvironmentInformationService>()
            .AddSingleton<IExternalLibsService, ExternalLibsService>()
            .AddScoped<IFileService, FileService>()
            .AddScoped<IHttpService, HttpService>()
            .AddScoped<IJwtService, JwtService>()
            .AddScoped<ILogService, LogService>()
            .AddScoped<ITimeService, TimeService>()

            // Application
            .AddScoped<IAdminService, AdminService>()
            .AddScoped<IOrderService, OrderService>()
            .AddScoped<IProductService, ProductService>()
            .AddScoped<ISupportCaseService, SupportCaseService>()
            .AddScoped<IUserService, UserService>()

            // Infrastructure
            .AddScoped<IAdminRepository, AdminRepository>()
            .AddScoped<IOrderRepository, OrderRepository>()
            .AddScoped<IProductRepository, ProductRepository>()
            .AddScoped<ISupportCaseRepository, SupportCaseRepository>()
            .AddScoped<IUserRepository, UserRepository>();
    }
}