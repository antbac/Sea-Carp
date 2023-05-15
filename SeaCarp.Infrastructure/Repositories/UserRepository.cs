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

    public async Task<bool> CreateUser(string email, string password)
    {
        return await _dbContext.Database.ExecuteSqlRawAsync(@$"
            INSERT INTO [{SeaCarpDbContext.DEFAULT_SCHEMA}].[User] ([{nameof(User.Email)}], [{nameof(User.Password)}])
            VALUES ('{email}', '{password}');
        ") > 0;
    }

    public Task<User> GetUser(string email, string password)
    {
        return Task.FromResult<User>(
            _dbContext.Database.SqlQueryRaw<User>(@$"
                SELECT *
                FROM [{SeaCarpDbContext.DEFAULT_SCHEMA}].[User]
                WHERE [{nameof(User.Email)}] = '{email}' AND [{nameof(User.Password)}] = '{password}';
            ").FirstOrDefault());
    }
}