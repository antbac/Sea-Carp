using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SeaCarp.Domain.Models;

namespace SeaCarp.Infrastructure.EntityConfigurations;

public class PostPersistanceConfigurations : IEntityTypeConfiguration<Post>
{
    public void Configure(EntityTypeBuilder<Post> builder)
    {
        var entityConfiguration = builder.ToTable(nameof(Post), SeaCarpDbContext.DEFAULT_SCHEMA);

        builder.HasKey(post => post.Id);

        builder
            .Property(post => post.Text)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(post => post.Likes);
        builder.Property(post => post.Dislikes);

        builder
            .HasOne(p => p.WrittenBy)
            .WithMany()
            .OnDelete(DeleteBehavior.NoAction);
    }
}