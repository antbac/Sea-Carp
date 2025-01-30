using SeaCarp.CrossCutting.Extensions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;

namespace SeaCarp.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        public async Task CreateUser(User user)
        {
            using var cmd = Database.GetConnection().CreateCommand();
            cmd.CommandText = @$"
                    INSERT INTO {nameof(User).ToPlural()} ({nameof(User.Username)}, {nameof(User.Password)}, {nameof(User.Email)}, {nameof(User.IsAdmin)}) VALUES ('{user.Username}', '{user.Password}', '{user.Email}', {user.IsAdmin.ToInt()});
                ";
            await cmd.ExecuteNonQueryAsync();
        }

        public async Task<User> GetUser(string username, string password)
        {
            var connection = Database.GetConnection();
            using var cmd = connection.CreateCommand();
            cmd.CommandText = @$"
                SELECT {nameof(User.Id)}, {nameof(User.Username)}, {nameof(User.Password)}, {nameof(User.Email)}, {nameof(User.IsAdmin)} FROM {nameof(User).ToPlural()} WHERE {nameof(User.Username)} = '{username}' AND {nameof(User.Password)} = '{password}';
            ";

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
            cmd.CommandText = @$"
                SELECT {nameof(User.Id)}, {nameof(User.Username)}, {nameof(User.Password)}, {nameof(User.Email)}, {nameof(User.IsAdmin)} FROM {nameof(User).ToPlural()} WHERE {nameof(User.Id)} = {id};
            ";

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
            cmd.CommandText = @$"
                    UPDATE {nameof(User).ToPlural()} SET {nameof(User.Username)} = '{user.Username}', {nameof(User.Password)} = '{user.Password}', {nameof(User.Email)} = '{user.Email}', {nameof(User.IsAdmin)} = {user.IsAdmin.ToInt()} WHERE {nameof(User.Id)} = {user.Id};
                ";
            await cmd.ExecuteNonQueryAsync();
        }
    }
}