using Microsoft.EntityFrameworkCore;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;

namespace SeaCarp.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly SeaCarpDbContext _dbContext;

    public UserRepository(SeaCarpDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task CreateUser(User user)
    {
        await _dbContext.Users.AddAsync(user);
    }

    public async Task<User> GetUser(string email, string password)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
        return user != default && user.PasswordMatches(password)
            ? user
            : default;
    }

    public async Task<User> GetUserById(int id)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
    }

    public Task SaveChanges() => _dbContext.SaveChangesAsync();
}