using SeaCarp.Application.Services.Abstractions;
using SeaCarp.Domain.Abstractions;

namespace SeaCarp.Application.Services;

public class AdminService : IAdminService
{
    private readonly IAdminRepository _adminRepository;

    public AdminService(IAdminRepository adminRepository)
    {
        _adminRepository = adminRepository;
    }

    public Task ResetDatabase() => _adminRepository.ResetDatabase();
}