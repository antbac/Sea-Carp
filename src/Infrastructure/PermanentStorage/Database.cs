using SeaCarp.Infrastructure.PermanentStorage.Interactions;

namespace SeaCarp.Infrastructure.PermanentStorage;

public class Database
{
    private readonly ApplicationDbContext _dbContext;

    public UserDatabaseInteraction Users { get; }

    public Database(ApplicationDbContext dbContext)
    {
        Users = new UserDatabaseInteraction(dbContext);
    }
}