using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using InkluBilet.Database.Models;

namespace InkluBilet.Database.Configurations;

public class OrganisationsEntityTypeConfiguration : IEntityTypeConfiguration<Organisation>
{
    public void Configure(EntityTypeBuilder<Organisation> builder)
    {
        builder
            .HasIndex(o => o.Name)
            .IsUnique();
    }
}