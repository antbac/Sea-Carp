using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services.Abstractions;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services;

public class UserService : IUserService
{
    private readonly IHttpService _httpService;
    private readonly IUserRepository _userRepository;
    private readonly ICryptographyService _cryptographyService;

    public UserService(
        IHttpService httpService,
        IUserRepository userRepository,
        ICryptographyService cryptographyService)
    {
        _httpService = httpService;
        _userRepository = userRepository;
        _cryptographyService = cryptographyService;
    }

    public Task CreateUser(User user) => _userRepository.CreateUser(user);

    public Task<IEnumerable<User>> GetAllUsers() => _userRepository.GetAllUsers();

    public Task<User> GetUser(int id) => _userRepository.GetUser(id);

    public Task<User> GetUser(string identifier) => _userRepository.GetUser(identifier);

    public Task<User> GetUser(string username, string password) => _userRepository.GetUser(username, _cryptographyService.HashPassword(password));

    public Task RemoveUser(int id) => _userRepository.RemoveUser(id);

    public async Task UpdateProfilePicture(User user, string url)
    {
        var imageContent = await _httpService.FetchContentAsync(url, CrossCutting.OutputType.Base64) as string;
        user.UpdateProfilePicture(imageContent);
        await _userRepository.UpdateUser(user);
    }

    public Task UpdateUser(User user) => _userRepository.UpdateUser(user);
}