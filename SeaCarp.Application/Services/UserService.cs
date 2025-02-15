using SeaCarp.Application.Services.Abstractions;
using SeaCarp.CrossCutting.Services;
using SeaCarp.Domain.Abstractions;
using SeaCarp.Domain.Models;

namespace SeaCarp.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public Task<User> GetUser(int id) => _userRepository.GetUser(id);

    public Task<User> GetUser(string identifier) => _userRepository.GetUser(identifier);

    public async Task UpdateProfilePicture(User user, string url)
    {
        var imageContent = await HttpService.FetchContentAsync(url, CrossCutting.OutputType.Base64) as string;
        user.UpdateProfilePicture(imageContent);
        await _userRepository.UpdateUser(user);
    }

    public Task UpdateUser(User user) => _userRepository.UpdateUser(user);
}