using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services.Abstractions;

public interface IUserService
{
    Task CreateUser(User user);

    Task<IEnumerable<User>> GetAllUsers();

    Task<User> GetUser(int id);

    Task<User> GetUser(string identifier);

    Task<User> GetUser(string username, string password);

    Task RemoveUser(int id);

    Task UpdateUser(User user);

    Task UpdateProfilePicture(User user, string url);
}