using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services;

public class UserService(
    IHttpService httpService,
    IUserRepository userRepository,
    ISupportCaseRepository supportCaseRepository,
    ICryptographyService cryptographyService,
    ILogService logService) : IUserService
{
    private readonly ICryptographyService _cryptographyService = cryptographyService;
    private readonly IHttpService _httpService = httpService;
    private readonly ILogService _logService = logService;
    private readonly ISupportCaseRepository _supportCaseRepository = supportCaseRepository;
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<IEnumerable<User>> GetAllUsers()
    {
        var users = _userRepository.GetAllUsers().ToList();
        _logService.Information($"Retrieved {users.Count} users.");

        return users;
    }

    public async Task CreateUser(User user)
    {
        _userRepository.CreateUser(user);

        _logService.Information($"User created: {user.Username} (ID: {user.Id})");
    }

    public async Task DemoteCaseOfficer(User user)
    {
        user.DemoteFromCaseOfficer();
        _userRepository.UpdateCaseOfficerStatus(user);
    }

    public async Task<User> GetUser(int id)
    {
        var user = _userRepository.GetUser(id);
        if (user == null)
        {
            _logService.Warning($"User with ID {id} not found.");
            throw new KeyNotFoundException($"User with ID {id} not found.");
        }

        _logService.Information($"Retrieved user: {user.Username} (ID: {id})");

        foreach (var order in user.Orders)
        {
            order.AppendSupportCases(_supportCaseRepository.GetSupportCasesByOrderId(order.Id));
        }

        return user;
    }

    public async Task<User> GetUser(string identifier)
    {
        var user = _userRepository.GetUser(identifier);
        if (user == null)
        {
            _logService.Warning($"User with identifier '{identifier}' not found.");
            throw new KeyNotFoundException($"User with identifier '{identifier}' not found.");
        }

        _logService.Information($"Retrieved user: {user.Username} (ID: {user.Id})");

        return user;
    }

    public async Task<User> GetUser(string username, string password)
    {
        var user = _userRepository.GetUser(username, _cryptographyService.HashPassword(password));
        if (user == null)
        {
            _logService.Warning($"User with username '{username}' not found or password is incorrect.");
            throw new KeyNotFoundException($"User with username '{username}' not found or password is incorrect.");
        }

        _logService.Information($"User authenticated: {user.Username} (ID: {user.Id})");

        return user;
    }

    public async Task PromoteCaseOfficer(User user)
    {
        user.PromoteToCaseOfficer();
        _userRepository.UpdateCaseOfficerStatus(user);
    }

    public async Task UpdateProfilePicture(User user, string gravatarPath)
    {
        var imageContent = await _httpService.FetchContent(
            $"https://gravatar.com{gravatarPath}",
            OutputType.Base64,
            user?.AuthenticationLevel ?? AuthenticationLevel.Anonymous)
            as string;

        user.UpdateProfilePicture(imageContent);
        _userRepository.UpdateProfilePicture(user);

        _logService.Information($"Profile picture updated for user: {user.Username} (ID: {user.Id})");
    }
}