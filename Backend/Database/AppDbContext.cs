using Microsoft.EntityFrameworkCore;

namespace InkluBilet.Database;

class AppDbContext :DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
}