using SeaCarp.CrossCutting.Extensions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;
using System.Text.RegularExpressions;

namespace SeaCarp.Infrastructure.Repositories;

public class OrderRepository : IOrderRepository
{
    public async Task CreateOrder(Order order)
    {
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = Regex.Replace(@$"
                INSERT INTO {nameof(Order).ToPlural()}
                (
                    {nameof(Order.User)}Id,
                    {nameof(Order.OrderDate)},
                    {nameof(Order.Status)}
                ) VALUES (
                    (SELECT {nameof(User.Id)} FROM {nameof(User).ToPlural()} WHERE {nameof(User.Username)} = '{order.User}'),
                    '{order.OrderDate:yyyy-MM-dd}',
                    '{order.Status}'
                );
            ", @"\s+", " ");
            await cmd.ExecuteNonQueryAsync();
        }

        var orderId = -1;
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = $"SELECT MAX({nameof(Order.Id)}) FROM {nameof(Order).ToPlural()};";
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                orderId = reader.GetInt32(0);
            }
        }

        {
            foreach (var item in order.OrderItems)
            {
                using var cmd = Database.GetConnection().CreateCommand();
                cmd.CommandText = Regex.Replace(@$"
                    INSERT INTO {nameof(OrderItem).ToPlural()}
                    (
                        {nameof(OrderItem.Order)}Id,
                        {nameof(OrderItem.Product)}Id,
                        {nameof(OrderItem.Quantity)},
                        {nameof(OrderItem.UnitPrice)}
                    ) VALUES (
                        {orderId},
                        {item.Product.Id},
                        {item.Quantity},
                        {item.UnitPrice.ToString().Replace(",", ".")}
                    );
                ", @"\s+", " ");
                await cmd.ExecuteNonQueryAsync();
            }
        }
    }

    public Task<Order> GetNewestOrder()
    {
        // TODO
        throw new NotImplementedException();
    }

    public async Task<Order> GetOrder(string orderNumber)
    {
        // TODO
        throw new NotImplementedException();
    }
}