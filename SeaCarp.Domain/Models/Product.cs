namespace SeaCarp.Domain.Models;

public class Product
{
    internal Product()
    { }

    public int Id { get; internal set; }
    public string ProductName { get; internal set; }
    public string Description { get; internal set; }
    public decimal Price { get; internal set; }
    public string Category { get; internal set; }
    public int Stock { get; internal set; }
    public List<Review> Reviews { get; internal set; }

    public static Product Create(string productName, string description, decimal price, string category, int stock) => new()
    {
        ProductName = productName,
        Description = description,
        Price = price,
        Category = category,
        Stock = stock,
    };

    public Product AddStock(int addedStock)
    {
        if (addedStock <= 0)
        {
            throw new ArgumentException("Added stock must be greater than 0", nameof(addedStock));
        }

        Stock += addedStock;
        return this;
    }

    public Product RemoveStock(int stockToRemove)
    {
        if (stockToRemove <= 0)
        {
            throw new ArgumentException("Stock to remove must be greater than 0", nameof(stockToRemove));
        }

        Stock -= stockToRemove;
        return this;
    }
}