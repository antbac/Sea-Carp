using SeaCarp.Domain.Models;

namespace SeaCarp.Domain.Abstractions;

public interface IUserRepository
{
    public Task<bool> CreateUser(string email, string password);

    public Task<User> GetUser(string email, string password);
}