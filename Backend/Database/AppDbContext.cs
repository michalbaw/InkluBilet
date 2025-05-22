using Microsoft.EntityFrameworkCore;
using InkluBilet.Database.Models;

namespace InkluBilet.Database;

public class AppDbContext : DbContext
{

    public DbSet<Todo> Todos => Set<Todo>();
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
}