using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Models.Contracts;
using SeaCarp.Presentation.Models.ViewModels;
using Swashbuckle.AspNetCore.Annotations;

namespace SeaCarp.Presentation.Controllers;

[SwaggerTag("User management and administrative operations")]
public class UsersController(
    IUserService userService,
    IFileService fileService,
    IJwtService jwtService,
    ILogService<UsersController> logService)
    : BaseController<UsersController>(
        jwtService,
        logService)
{
    private readonly IUserService _userService = userService;
    private readonly IFileService _fileService = fileService;

    private async Task<UserDto> ResolveProfile(string identifier, bool maskData)
    {
        var user = int.TryParse(identifier, out var id)
            ? await _userService.GetUser(id)
            : await _userService.GetUser(identifier);

        if (user is null)
        {
            LogService.Warning($"No user found with identifier {identifier}.");
            return null;
        }

        var userResponse = user.Id != (CurrentUser?.Id ?? -1)
            ? new UserDto(user)
            : new UserDto(user, await _fileService.GetUserFiles(CurrentUser.Username));

        LogService.Information($"User profile for {user.Username} retrieved successfully.");

        var isCallForCurrentUser = int.TryParse(identifier, out id)
            ? CurrentUser != null && CurrentUser.Id == id
            : CurrentUser != null && CurrentUser.Username == identifier;

        if (maskData && !isCallForCurrentUser)
        {
            userResponse.MaskSensitiveData();
        }

        return userResponse;
    }

    [HttpGet]
    [Route("/users", Name = $"{nameof(UsersController)}/{nameof(GetProfile)}")]
    public async Task<IActionResult> GetProfile()
    {
        LogService.Information($"User {CurrentUser.Username} accessed their profile.");

        return RedirectToAction(CurrentUser.Id.ToString(), nameof(UsersController).RemoveControllerSuffix());
    }

    [HttpGet]
    [Route("/users/{identifier}", Name = $"{nameof(UsersController)}/{nameof(GetProfilePageById)}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProfilePageById(string identifier, [FromQuery] bool maskData = true)
    {
        var userResponse = await ResolveProfile(identifier, maskData);
        return userResponse is null
            ? NotFound($"No user with identifier {identifier} found")
            : View("Index", new UserViewModel(userResponse));
    }
}