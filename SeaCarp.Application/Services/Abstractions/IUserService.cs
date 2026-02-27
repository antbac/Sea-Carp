using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services.Abstractions;

public interface IUserService
{
    Task<IEnumerable<User>> GetAllUsers();

    Task CreateUser(User user);

    Task DemoteCaseOfficer(User user);

    Task<User> GetUser(int id);

    Task<User> GetUser(string identifier);

    Task<User> GetUser(string username, string password);

    Task PromoteCaseOfficer(User user);

    Task UpdateProfilePicture(User user, string gravatarPath);
}