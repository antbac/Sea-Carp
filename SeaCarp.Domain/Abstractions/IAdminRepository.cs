namespace SeaCarp.Domain.Abstractions;

public interface IAdminRepository
{
    Task ResetDatabase();
}