﻿namespace SeaCarp.Presentation.Models.Responses;

public class GenericResponse
{
    public bool Success { get; set; }
    public string RedirectUrl { get; set; }
    public string ErrorMessage { get; set; }
    public string StackTrace { get; set; }
}