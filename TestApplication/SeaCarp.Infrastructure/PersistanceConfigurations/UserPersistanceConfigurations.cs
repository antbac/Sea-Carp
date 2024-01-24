using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SeaCarp.Domain.Models;

namespace SeaCarp.Infrastructure.EntityConfigurations;

public class UserPersistanceConfigurations : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        var entityConfiguration = builder.ToTable(nameof(User), SeaCarpDbContext.DEFAULT_SCHEMA);

        builder.HasKey(user => user.Id);

        entityConfiguration
            .HasIndex(user => user.Email)
            .IsUnique();

        builder
            .Property(user => user.Email)
            .IsRequired()
            .HasMaxLength(128);

        builder
            .Property(user => user.Salt)
            .IsRequired()
            .HasMaxLength(64)
            .IsFixedLength();

        builder
            .Property(user => user.Password)
            .IsRequired()
            .HasMaxLength(64)
            .IsFixedLength();

        builder
            .Property(user => user.Description)
            .IsRequired()
            .HasMaxLength(256);

        builder
            .Property(user => user.ProfileImage)
            .IsRequired()
            .HasMaxLength(256);
    }
}