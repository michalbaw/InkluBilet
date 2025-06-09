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
    public DbSet<User> Users => Set<User>();
    public DbSet<Ticket> Tickets => Set<Ticket>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new OrganisationEntityTypeConfiguration());
        modelBuilder.ApplyConfiguration(new UserEntityTypeConfiguration());
    }

    // Seed database with sample data
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    => optionsBuilder
        .UseSeeding((context, _) =>
        {
            Dictionary<string, string> testOrgData = new () {
                {"Name", "Test Org."},
                {"Password", "testorgpasswd"},
                {"Login", "testorg"}
            };

            var testOrg = context.Set<Organisation>().FirstOrDefault(org => org.Name == testOrgData["Name"]);
            if (testOrg == null)
            {
                context.Set<Organisation>().Add(new Organisation {
                        Name = testOrgData["Name"],
                        Password = testOrgData["Password"],
                        Login = testOrgData["Login"]
                });
                context.SaveChanges();
            }
            testOrg = context.Set<Organisation>().FirstOrDefault(org => org.Name == testOrgData["Name"]);

            List<Dictionary<string, object>> testEventsData = [
                new () {
                    {"Name", "Romeo i Julia"},
                    {"Description", "'Romeo i Julia' w teatrze"},
                    {"Time", "2025-06-20T19:00"},
                    {"Location", "Teatr Słowackiego"},
                    {"Accessibility", EventAccessibility.PersonReading}
                },
                new () {
                    {"Name", "Hamlet"},
                    {"Description", "'Hamlet' dla każdego"},
                    {"Time", "2025-06-25T18:30"},
                    {"Location", "Teatr Bagatela"},
                    {"Accessibility", EventAccessibility.PersonReading}
                },
                new () {
                    {"Name", "Straszny dwór"},
                    {"Description", "Opera z napisami"},
                    {"Time", "2025-06-20T20:00"},
                    {"Location", "Opera Krakowska"},
                    {"Accessibility", EventAccessibility.Captions}
                },
                new () {
                    {"Name", "Koncert rodzinny"},
                    {"Description", "Piknik rodzinny z koncertem"},
                    {"Time", "2025-06-21T11:00"},
                    {"Location", "Błonia"},
                    {"Accessibility", EventAccessibility.Captions}
                }
            ];

            foreach (var testEvData in testEventsData) {
                var testEvent = context.Set<Event>().FirstOrDefault(ev => ev.Name == (string)testEvData["Name"]);
                if (testEvent == null)
                {
                    context.Set<Event>().Add(new Event {
                            Organisation = testOrg,
                            Name = (string)testEvData["Name"],
                            Description = (string)testEvData["Description"],
                            Time = (string)testEvData["Time"],
                            Location = (string)testEvData["Location"],
                            Accessibility = (EventAccessibility)testEvData["Accessibility"],
                    });
                    context.SaveChanges();
                }
            }
        });
}
