using Microsoft.EntityFrameworkCore;
using InkluBilet.Database.Models;
using InkluBilet.Database.Configurations;

namespace InkluBilet.Database;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    { }

    public DbSet<Event> Events => Set<Event>();
    public DbSet<Organisation> Organisations => Set<Organisation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new OrganisationsEntityTypeConfiguration());
    }
}