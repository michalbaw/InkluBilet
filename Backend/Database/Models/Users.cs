using System.ComponentModel.DataAnnotations;

namespace InkluBilet.Database.Models;

public class User
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public String Name { get; set; } = "";

    // Storing password as String is bad, but this app is just a demo, and should never be used anyway
    [Required]
    public String Password { get; set; } = "";

    public ICollection<Ticket> Tickets { get; } = [];
}