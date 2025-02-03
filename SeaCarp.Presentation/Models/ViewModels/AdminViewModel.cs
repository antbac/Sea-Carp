namespace SeaCarp.Presentation.Models.ViewModels;

public class AdminViewModel
{
    public int TotalProducts => Products.Count();
    public int TotalOrders => Orders.Count();
    public int TotalUsers => Users.Count();
    public IEnumerable<ProductViewModel> Products { get; set; }
    public IEnumerable<OrderViewModel> Orders => Users.SelectMany(x => x.Orders);
    public IEnumerable<UserViewModel> Users { get; set; }
}