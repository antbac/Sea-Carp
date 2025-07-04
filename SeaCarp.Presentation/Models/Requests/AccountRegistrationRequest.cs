﻿namespace SeaCarp.Presentation.Models.Requests;

public class AccountRegistrationRequest
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public string Email { get; set; }
    public decimal Credits { get; set; }
    public string ProfilePicture { get; set; }
    public bool IsAdmin { get; set; }
}