﻿namespace SeaCarp.Domain.Models;

public class Product
{
    public int Id { get; set; }
    public string ProductName { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; }
    public int Stock { get; set; }
    public List<Review> Reviews { get; set; }

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
        Stock += addedStock;
        return this;
    }
}