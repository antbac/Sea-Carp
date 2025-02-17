using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services.Abstractions;

public interface IAdminService
{
    Task ResetDatabase();
}