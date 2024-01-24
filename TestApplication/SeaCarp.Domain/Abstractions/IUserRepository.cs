using SeaCarp.Domain.Models;

namespace SeaCarp.Domain.Abstractions;

public interface IUserRepository : IRepository
{
    public Task CreateUser(User user);

    public Task<User> GetUser(string email, string password);

    public Task<User> GetUserById(int id);
}