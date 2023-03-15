using Microsoft.EntityFrameworkCore;
using SeaCarp.DomainModels;

namespace SeaCarp.Infrastructure.PermanentStorage;

public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => new { u.Email })
            .IsUnique(true);
    }
}