using SeaCarp.Domain.Models;

namespace SeaCarp.Domain.Abstractions;

public interface IUserRepository
{
    void CreateUser(User user);

    IEnumerable<User> GetAllUsers();

    User GetUser(string username, string password);

    User GetUser(int id, bool skipLock = false);

    User GetUser(string username);

    void UpdateAdminStatus(User user);

    void UpdateCaseOfficerStatus(User user);

    void UpdateCredits(User user);

    void UpdateProfilePicture(User user);
}