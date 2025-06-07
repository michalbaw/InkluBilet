using System.ComponentModel.DataAnnotations;

namespace InkluBilet.Database.Models;

public class Organisation
{
    [Key]
    public Guid Id { get; set; }

    public ICollection<Event> Events { get; } = [];

    [Required]
    public String Name { get; set; } = "";

    [Required]
    public String Login { get; set; } = "";

    [Required]
    public String Password { get; set; } = "";
}