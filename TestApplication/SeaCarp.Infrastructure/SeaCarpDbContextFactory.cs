using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Configuration;
using SeaCarp.Infrastructure;

namespace Halo.Regulation.Sanction.Infrastructure;

public class SeaCarpDbContextFactory : IDesignTimeDbContextFactory<SeaCarpDbContext>
{
    public SeaCarpDbContext CreateDbContext(string[] args)
    {
        var config = new ConfigurationBuilder()
            .AddJsonFile($"appsettings.json", true)
            .Build();

        var builder = new DbContextOptionsBuilder<SeaCarpDbContext>();

        builder.UseSqlServer(config.GetConnectionString("DefaultConnection"),
            optionsBuilder => optionsBuilder.MigrationsHistoryTable(
                HistoryRepository.DefaultTableName, SeaCarpDbContext.DEFAULT_SCHEMA));

        return new SeaCarpDbContext(builder.Options);
    }
}