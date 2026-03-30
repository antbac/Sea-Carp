using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services;

public class UserService(
    ICryptographyService cryptographyService,
    IHttpService httpService,
    IJwtService jwtService,
    ILogService<UserService> logService,
    ISupportCaseRepository supportCaseRepository,
    IUserRepository userRepository) : IUserService
{
    private readonly ICryptographyService _cryptographyService = cryptographyService;
    private readonly IHttpService _httpService = httpService;
    private readonly ILogService<UserService> _logService = logService;
    private readonly ISupportCaseRepository _supportCaseRepository = supportCaseRepository;
    private readonly IJwtService _jwtService = jwtService;
    private readonly IUserRepository _userRepository = userRepository;

    public Task<IEnumerable<User>> GetAllUsers()
    {
        var users = _userRepository.GetAllUsers().ToList();
        _logService.Information($"Retrieved {users.Count} users.");

        return Task.FromResult<IEnumerable<User>>(users);
    }

    public Task CreateUser(User user)
    {
        _userRepository.CreateUser(user);

        _logService.Information($"User created: {user.Username} (ID: {user.Id})");

        return Task.CompletedTask;
    }

    public Task DemoteCaseOfficer(User user)
    {
        user.DemoteFromCaseOfficer();
        _userRepository.UpdateCaseOfficerStatus(user);

        return Task.CompletedTask;
    }

    public Task<User> GetUser(int id)
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

        return Task.FromResult(user);
    }

    public Task<User> GetUser(string identifier)
    {
        var user = _userRepository.GetUser(identifier);
        if (user == null)
        {
            _logService.Warning($"User with identifier '{identifier}' not found.");
            throw new KeyNotFoundException($"User with identifier '{identifier}' not found.");
        }

        _logService.Information($"Retrieved user: {user.Username} (ID: {user.Id})");

        return Task.FromResult(user);
    }

    public Task<User> GetUser(string username, string password)
    {
        var user = _userRepository.GetUser(username, _cryptographyService.HashPassword(password));
        if (user == null)
        {
            _logService.Warning($"User with username '{username}' not found or password is incorrect.");
            throw new KeyNotFoundException($"User with username '{username}' not found or password is incorrect.");
        }

        _logService.Information($"User authenticated: {user.Username} (ID: {user.Id})");

        return Task.FromResult(user);
    }

    public Task PromoteCaseOfficer(User user)
    {
        user.PromoteToCaseOfficer();
        _userRepository.UpdateCaseOfficerStatus(user);

        return Task.CompletedTask;
    }

    public async Task UpdateProfilePicture(User user, string gravatarPath)
    {
        var imageContent = await _httpService.FetchContent(
            $"https://gravatar.com{gravatarPath}",
            OutputType.Base64,
            user is null
                ? string.Empty
                : _jwtService.GenerateJwt(
                    (nameof(User.Id), user.Id.ToString()),
                    (nameof(User.Username), user.Username),
                    (nameof(User.Password), user.Password),
                    (nameof(User.Email), user.Email),
                    (nameof(User.Credits), user.Credits.ToString()),
                    (nameof(User.IsCaseOfficer), user.IsCaseOfficer.ToString()),
                    (nameof(User.IsAdmin), user.IsAdmin.ToString())
                ))
            as string;

        user.UpdateProfilePicture(imageContent);
        _userRepository.UpdateProfilePicture(user);

        _logService.Information($"Profile picture updated for user: {user.Username} (ID: {user.Id})");
    }
}