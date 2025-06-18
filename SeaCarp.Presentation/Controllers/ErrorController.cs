using Microsoft.AspNetCore.Diagnostics;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Models.ViewModels;

namespace SeaCarp.Presentation.Controllers;

public class ErrorController(
    IJwtService jwtService,
    ILogService logService)
    : BaseController(
        jwtService,
        logService)
{
    [Route("/Error", Name = "ErrorIndex")]
    public IActionResult Index()
    {
        var exceptionHandlerFeature = HttpContext.Features.Get<IExceptionHandlerFeature>();
        if (exceptionHandlerFeature != null)
        {
            var exception = exceptionHandlerFeature.Error;
            var errorDetails = new ErrorViewModel
            {
                Message = exception.Message,
                StackTrace = exception.StackTrace ?? string.Empty
            };
            return View(errorDetails);
        }

        return View(null as ErrorViewModel);
    }
}