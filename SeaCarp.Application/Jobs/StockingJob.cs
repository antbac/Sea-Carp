using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;

namespace SeaCarp.Application.Jobs;

public class StockingJob(IServiceScopeFactory scopeFactory) : BackgroundService
{
    private readonly TimeSpan _interval = TimeSpan.FromMinutes(1);

    private readonly IServiceScopeFactory _scopeFactory = scopeFactory;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();
            var productRepository = scope.ServiceProvider.GetRequiredService<IProductRepository>();
            var logService = scope.ServiceProvider.GetRequiredService<ILogService>();

            var products = await productRepository.GetAllProducts();
            foreach (var product in products)
            {
                if (product.Stock > 50)
                {
                    continue;
                }

                if (new Random().Next(100) >= 20)
                {
                    continue;
                }

                var addedStock = new Random().Next(1, 7);
                product.AddStock(addedStock);
                await productRepository.UpdateProduct(product.Id, product);

                logService.Information($"Stocked product {product.ProductName} with {addedStock} items. New stock: {product.Stock}.");
            }

            await Task.Delay(_interval, stoppingToken);
        }
    }
}