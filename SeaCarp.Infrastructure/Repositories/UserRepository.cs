using SeaCarp.CrossCutting.Extensions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;
using System.Text.RegularExpressions;

namespace SeaCarp.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    public async Task CreateUser(User user)
    {
        using var cmd = Database.GetConnection().CreateCommand();
        cmd.CommandText = Regex.Replace(@$"
            INSERT INTO {nameof(User).ToPlural()}
            (
                {nameof(User.Username)},
                {nameof(User.Password)},
                {nameof(User.Email)},
                {nameof(User.IsAdmin)}
            ) VALUES (
                '{user.Username}',
                '{user.Password}',
                '{user.Email}',
                {user.IsAdmin.ToInt()});
        ", @"\s+", " ");
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<User> GetUser(string username, string password)
    {
        var connection = Database.GetConnection();
        using var cmd = connection.CreateCommand();
        cmd.CommandText = Regex.Replace(@$"
            SELECT
                {nameof(User.Id)},
                {nameof(User.Username)},
                {nameof(User.Password)},
                {nameof(User.Email)},
                {nameof(User.IsAdmin)}
            FROM {nameof(User).ToPlural()}
            WHERE
                {nameof(User.Username)} = '{username}'
                AND
                {nameof(User.Password)} = '{password}';
        ", @"\s+", " ");

        using var reader = await cmd.ExecuteReaderAsync();
        while (reader.Read())
        {
            return new User()
            {
                Id = reader.GetInt32(0),
                Username = reader.GetString(1),
                Password = reader.GetString(2),
                Email = reader.GetString(3),
                IsAdmin = reader.GetBoolean(4),
            };
        }

        return null;
    }

    public async Task<User> GetUser(int id)
    {
        var connection = Database.GetConnection();
        using var cmd = connection.CreateCommand();
        cmd.CommandText = Regex.Replace(@$"
            SELECT
                {nameof(User.Id)},
                {nameof(User.Username)},
                {nameof(User.Password)},
                {nameof(User.Email)},
                {nameof(User.IsAdmin)}
            FROM {nameof(User).ToPlural()}
            WHERE {nameof(User.Id)} = {id};
        ", @"\s+", " ");

        using var reader = await cmd.ExecuteReaderAsync();
        while (reader.Read())
        {
            return new User()
            {
                Id = reader.GetInt32(0),
                Username = reader.GetString(1),
                Password = reader.GetString(2),
                Email = reader.GetString(3),
                IsAdmin = reader.GetBoolean(4),
            };
        }

        return null;
    }

    public async Task<User> GetUser(string username)
    {
        var connection = Database.GetConnection();
        using var cmd = connection.CreateCommand();
        cmd.CommandText = Regex.Replace(@$"
            SELECT
                {nameof(User.Id)},
                {nameof(User.Username)},
                {nameof(User.Password)},
                {nameof(User.Email)},
                {nameof(User.IsAdmin)}
            FROM {nameof(User).ToPlural()}
            WHERE {nameof(User.Username)} = '{username}';
        ", @"\s+", " ");

        using var reader = await cmd.ExecuteReaderAsync();
        while (reader.Read())
        {
            return new User()
            {
                Id = reader.GetInt32(0),
                Username = reader.GetString(1),
                Password = reader.GetString(2),
                Email = reader.GetString(3),
                IsAdmin = reader.GetBoolean(4),
            };
        }

        return null;
    }

    public async Task UpdateUser(User user)
    {
        using var cmd = Database.GetConnection().CreateCommand();
        cmd.CommandText = Regex.Replace(@$"
            UPDATE {nameof(User).ToPlural()}
            SET
                {nameof(User.Username)} = '{user.Username}',
                {nameof(User.Password)} = '{user.Password}',
                {nameof(User.Email)} = '{user.Email}',
                {nameof(User.IsAdmin)} = {user.IsAdmin.ToInt()}
            WHERE {nameof(User.Id)} = {user.Id};
        ", @"\s+", " ");
        await cmd.ExecuteNonQueryAsync();
    }
}