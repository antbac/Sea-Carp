using SeaCarp.Domain.Models;

namespace SeaCarp.Domain.Abstractions;

public interface IUserRepository
{
    Task CreateUser(User user);

    Task<User> GetUser(string username, string password);

    Task<User> GetUser(int id);

    Task<User> GetUser(string username);

    Task UpdateUser(User user);
}