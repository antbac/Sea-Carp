using SeaCarp.CrossCutting.Extensions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;
using System.Text.RegularExpressions;

namespace SeaCarp.Infrastructure.Repositories;

public class SupportCaseRepository : ISupportCaseRepository
{
    public async Task<SupportCase> CreateSupportCase(int orderId, string description, string image)
    {
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = Regex.Replace(@$"
            INSERT INTO {nameof(SupportCase).ToPlural()}
            (
                {nameof(SupportCase.Order)}{nameof(SupportCase.Order.Id)},
                {nameof(SupportCase.Description)},
                {nameof(SupportCase.Image)},
                {nameof(SupportCase.CreatedDate)}
            ) VALUES (
                {orderId},
                '{description}',
                {(string.IsNullOrWhiteSpace(image) ? "NULL" : $"'{image}'")},
                '{DateTime.Today.ToString("yyyy-MM-dd")}'
            );
        ", @"\s+", " ");
            await cmd.ExecuteNonQueryAsync();
        }

        {
            //using var cmd = Database.GetConnection().CreateCommand();
            //cmd.CommandText = Regex.Replace(@$"
            //    SELECT
            //        {nameof(Order).ToPlural()}.{nameof(Order.Id)},
            //        {nameof(User).ToPlural()}.{nameof(User.Username)},
            //        {nameof(Order).ToPlural()}.{nameof(Order.OrderDate)},
            //        {nameof(Order).ToPlural()}.{nameof(Order.Status)},
            //        {nameof(Order).ToPlural()}.{nameof(Order.DeliveryAddress)},
            //        {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Quantity)},
            //        {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.UnitPrice)},
            //        {nameof(Product).ToPlural()}.{nameof(Product.ProductName)},
            //        Categories.Category
            //    FROM {nameof(Order).ToPlural()}
            //    INNER JOIN {nameof(User).ToPlural()} ON {nameof(User).ToPlural()}.{nameof(User.Id)} = {nameof(Order).ToPlural()}.{nameof(Order.User)}Id
            //    INNER JOIN {nameof(OrderItem).ToPlural()} ON {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Order)}Id = {nameof(Order).ToPlural()}.{nameof(Order.Id)}
            //    INNER JOIN {nameof(Product).ToPlural()} ON {nameof(Product).ToPlural()}.{nameof(Product.Id)} = {nameof(OrderItem).ToPlural()}.{nameof(OrderItem.Product)}Id
            //    INNER JOIN Categories ON Categories.Id = {nameof(Product).ToPlural()}.{nameof(Product.Category)}Id
            //    WHERE {nameof(Order).ToPlural()}.{nameof(Order.Id)} = {orderId};
            //", @"\s+", " ");

            //using var reader = await cmd.ExecuteReaderAsync();
            //Order order = null;
            //while (await reader.ReadAsync())
            //{
            //    order ??= new()
            //    {
            //        Id = reader.GetInt32(0),
            //        User = reader.GetString(1),
            //        OrderDate = reader.GetDateTime(2),
            //        Status = Enum.Parse<OrderStatus>(reader.GetString(3)),
            //        DeliveryAddress = reader.GetString(4),
            //        OrderItems = [],
            //    };

            //    order.AddItems([new OrderItem
            //    {
            //        Quantity = reader.GetInt32(5),
            //        UnitPrice = reader.GetDecimal(6),
            //        Product = new Product
            //        {
            //            ProductName = reader.GetString(7),
            //            Category = reader.GetString(8),
            //        }
            //    }]);
            //}

            //return order;
            throw new NotImplementedException();
        }
    }

    public Task<SupportCase> GetCaseByCaseNumber(string identifier) => throw new NotImplementedException();

    public Task<SupportCase> GetCaseById(int id) => throw new NotImplementedException();
}