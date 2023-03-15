using Microsoft.EntityFrameworkCore;
using SeaCarp.DomainModels;

namespace SeaCarp.Infrastructure.PermanentStorage.Interactions;

public class UserDatabaseInteraction
{
    private readonly ApplicationDbContext _dbContext;

    public UserDatabaseInteraction(ApplicationDbContext dbContext) => _dbContext = dbContext;

    public int CreateUser(string email, string password) =>
        _dbContext.Database.ExecuteSqlRaw($"INSERT INTO dbo.Users (Email, Password) VALUES ('{email}', '{password}');");

    public User GetUser(string email, string password) =>
        _dbContext.Users.FromSqlRaw($"SELECT * FROM dbo.Users WHERE Email = '{email}' AND Password = '{password}';").ToArray().FirstOrDefault();

    public User GetUser(int id) =>
        _dbContext.Users.FromSqlRaw($"SELECT * FROM dbo.Users WHERE Id = {id};").ToArray().FirstOrDefault();

    public int ChangeDescription(int id, string description) =>
        _dbContext.Database.ExecuteSqlRaw($"Update dbo.Users SET Description = '{description}' WHERE Id = {id};");

    public int ChangeProfilePhoto(int id, string profilePhoto) =>
        _dbContext.Database.ExecuteSqlRaw($"Update dbo.Users SET ProfilePhoto = '{profilePhoto}' WHERE Id = {id};");

    public int ChangePassword(int id, string password) =>
        _dbContext.Database.ExecuteSqlRaw($"Update dbo.Users SET Password = '{password}' WHERE Id = {id};");
}