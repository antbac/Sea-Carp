using Microsoft.EntityFrameworkCore;
using SeaCarp.Domain.Models;
using SeaCarp.Infrastructure.EntityConfigurations;

namespace SeaCarp.Infrastructure;

public class SeaCarpDbContext : DbContext
{
    public const string DEFAULT_SCHEMA = "SeaCarp";

    public DbSet<User> Users { get; set; }

    public SeaCarpDbContext(DbContextOptions<SeaCarpDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new UserPersistanceConfigurations());
    }
}