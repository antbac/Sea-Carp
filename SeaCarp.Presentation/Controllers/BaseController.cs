﻿using SeaCarp.CrossCutting.Config;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Presentation.Services;

namespace SeaCarp.Presentation.Controllers;

public abstract class BaseController(
    IJwtService jwtService,
    ILogService logService) : Controller
{
    private readonly IJwtService _jwtService = jwtService;
    protected readonly ILogService LogService = logService;

    protected Domain.Models.User CurrentUser
    {
        get => RequestContext.Instance.CurrentUser.Value;
        set
        {
            RequestContext.Instance.CurrentUser.Value = value;
            if (value is null)
            {
                Response.Cookies.Delete(Constants.JWT);
            }
            else
            {
                Response.Cookies.Append(Constants.JWT, _jwtService.GenerateJwt(
                    (nameof(value.Id), value.Id.ToString()),
                    (nameof(value.Username), value.Username),
                    (nameof(value.Password), value.Password),
                    (nameof(value.Email), value.Email),
                    (nameof(value.Credits), value.Credits.ToString()),
                    (nameof(value.IsAdmin), value.IsAdmin.ToString())
                ), new CookieOptions
                {
                    HttpOnly = false,
                });
            }
        }
    }
}