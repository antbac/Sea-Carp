using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SeaCarp.Domain.Models;

namespace SeaCarp.Infrastructure.EntityConfigurations;

public class DiscussionPersistanceConfigurations : IEntityTypeConfiguration<Discussion>
{
    public void Configure(EntityTypeBuilder<Discussion> builder)
    {
        var entityConfiguration = builder.ToTable(nameof(Discussion), SeaCarpDbContext.DEFAULT_SCHEMA);

        builder.HasKey(user => user.Id);

        builder
            .Property(user => user.Topic)
            .IsRequired()
            .HasMaxLength(128);

        builder
            .HasOne(p => p.StartedBy)
            .WithMany()
            .OnDelete(DeleteBehavior.NoAction);

        #region Posts

        builder.HasMany(e => e.Posts)
            .WithOne()
            .IsRequired()
            .HasForeignKey("DiscussionId")
            .OnDelete(DeleteBehavior.Cascade);

        var navigation = builder.Metadata.FindNavigation(nameof(Discussion.Posts));
        navigation.SetPropertyAccessMode(PropertyAccessMode.Field);

        #endregion Posts
    }
}