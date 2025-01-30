namespace SeaCarp.Domain.Models;

public enum OrderStatus
{
    Unknown = 0,
    Cancelled = 1,
    Delivered = 2,
    Pending = 3,
    Shipped = 4,
}