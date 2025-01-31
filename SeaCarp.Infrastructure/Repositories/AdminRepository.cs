using SeaCarp.Domain.Abstractions;

namespace SeaCarp.Infrastructure.Repositories;

public class AdminRepository : IAdminRepository
{
    public Task ResetDatabase()
    {
        Database.ResetDatabase();
        return Task.CompletedTask;
    }
}