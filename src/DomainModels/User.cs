﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace SeaCarp.DomainModels;

public class User
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [MaxLength(255)]
    public string Email { get; set; }

    [MaxLength(255)]
    public string Password { get; set; }

    [MaxLength(1024)]
    public string? Description { get; set; }

    [MaxLength(4096)]
    public string? ProfilePhoto { get; set; }

    public static User Create(string email, string password) => new() { Email = email, Password = password };
}