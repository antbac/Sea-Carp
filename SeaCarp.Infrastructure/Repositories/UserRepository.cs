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

    public async Task<bool> CreateUser(User user)
    {
        return await _dbContext.Database.ExecuteSqlRawAsync(@$"
            INSERT INTO [{SeaCarpDbContext.DEFAULT_SCHEMA}].[{nameof(User)}] ([{nameof(User.Email)}], [{nameof(User.Password)}], [{nameof(User.Description)}], [{nameof(User.ProfileImage)}])
            VALUES ('{user.Email}', '{user.Password}', '{user.Description}', '{user.ProfileImage}');
        ") > 0;
    }

    public Task<User> GetUser(string email, string password)
    {
        return Task.FromResult<User>(
            _dbContext.Users.FromSqlRaw(@$"
                SELECT *
                FROM [{SeaCarpDbContext.DEFAULT_SCHEMA}].[{nameof(User)}]
                WHERE [{nameof(User.Email)}] = '{email}' AND [{nameof(User.Password)}] = '{password}'
            ").FirstOrDefault());
    }

    public Task<User> GetUserById(int id)
    {
        return Task.FromResult<User>(
            _dbContext.Users.FromSqlRaw(@$"
                SELECT *
                FROM [{SeaCarpDbContext.DEFAULT_SCHEMA}].[{nameof(User)}]
                WHERE [{nameof(User.Id)}] = id
            ").FirstOrDefault());
    }
}