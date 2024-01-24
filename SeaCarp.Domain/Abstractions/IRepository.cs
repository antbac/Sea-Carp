namespace SeaCarp.Domain.Abstractions;

public interface IRepository
{
    public Task SaveChanges();
}
