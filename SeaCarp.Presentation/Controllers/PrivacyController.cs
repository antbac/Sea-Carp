﻿using SeaCarp.ViewModels;

namespace SeaCarp.Controllers;

public class PrivacyController : Controller
{
    private readonly ILogger<PrivacyController> _logger;

    public PrivacyController(ILogger<PrivacyController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}