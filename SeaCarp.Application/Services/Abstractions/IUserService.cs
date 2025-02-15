using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services.Abstractions;

public interface IUserService
{
    Task<User> GetUser(int id);

    Task<User> GetUser(string identifier);

    Task UpdateUser(User user);

    Task UpdateProfilePicture(User user, string url);
}