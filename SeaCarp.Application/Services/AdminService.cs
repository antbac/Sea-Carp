using SeaCarp.Application.Services.Abstractions;
using SeaCarp.Domain.Abstractions;

namespace SeaCarp.Application.Services;

public class AdminService(IAdminRepository adminRepository) : IAdminService
{
    private readonly IAdminRepository _adminRepository = adminRepository;

    public Task ResetDatabase() => _adminRepository.ResetDatabase();
}