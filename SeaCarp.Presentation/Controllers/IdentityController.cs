﻿using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Extensions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Models.Requests;
using SeaCarp.Presentation.Models.Responses;

namespace SeaCarp.Presentation.Controllers;

public class IdentityController(
    IUserService userService,
    IJwtService jwtService,
    ILogService logService)
    : BaseController(
        jwtService,
        logService)
{
    private readonly IUserService _userService = userService;

    [HttpGet("Identity/Register", Name = "IdentityIndex")]
    public IActionResult Index()
    {
        return View("Register");
    }

    [HttpPost("Identity/Register", Name = "CreateAccount")]
    public async Task<IActionResult> CreateAccount([FromBody] AccountRegistrationRequest registration)
    {
        try
        {
            var user = Domain.Models.User.Create(
                username: registration.Username,
                email: registration.Email,
                password: registration.Password,
                credits: registration.Credits,
                profilePicture: registration.ProfilePicture,
                isAdmin: registration.IsAdmin);

            await _userService.CreateUser(user);

            LogService.Log(LogLevel.Information, $"Successfully registered user {registration.Username} : {registration.Password}");

            return Json(new GenericResponse { Success = true });
        }
        catch (Exception)
        {
            return Json(new GenericResponse { Success = false, ErrorMessage = "An error occurred when trying to register the account." });
        }
    }

    [HttpGet("Identity/Login", Name = "LoginPage")]
    public IActionResult LoginPage()
    {
        return CurrentUser is null
            ? View("Login")
            : RedirectToAction("Index", nameof(ProfilesController).RemoveControllerSuffix());
    }

    [HttpPost("Identity/Login")]
    public async Task<IActionResult> LoginUser([FromBody] LoginRequest login)
    {
        var user = await _userService.GetUser(login.Username, login.Password);
        if (user is null)
        {
            LogService.Log(LogLevel.Warning, $"Username or password was incorrect {login.Username} : {login.Password}");

            return Json(new GenericResponse { Success = false, ErrorMessage = "No user found with that username and password." });
        }

        LogService.Log(LogLevel.Information, $"User {login.Username} logged in");

        CurrentUser = user;
        return Json(new GenericResponse { Success = true });
    }

    [HttpGet("Identity/Logout", Name = "LogoutUser")]
    public IActionResult LogoutUser()
    {
        var user = CurrentUser;

        if (user is null)
        {
            LogService.Log(LogLevel.Warning, $"Unable to log out unknown user");
            return RedirectToAction("Index", "Home");
        }

        LogService.Log(LogLevel.Information, $"User {user.Username} logged out");
        CurrentUser = null;

        return RedirectToAction("Index", "Home");
    }
}