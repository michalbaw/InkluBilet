using System.ComponentModel.DataAnnotations;

namespace InkluBilet.Database.Models;

public class Organisation
{
    [Key]
    public Guid Id { get; set; }

    public virtual ICollection<Event> Events { get; } = [];

    [Required]
    public String Name { get; set; } = "";
}