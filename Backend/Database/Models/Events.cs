using System.ComponentModel.DataAnnotations;

namespace InkluBilet.Database.Models;

public class Event
{
    [Key]
    public Guid Id { get; set; }

    public virtual Organisation Organiser { get; set; }

    [Required]
    public Guid Organisation_ID { get; set; }

    [Required]
    public String Name { get; set; } = "";

    [Required]
    public String Description { get; set; } = "";

    [Required]
    public String Time { get; set; } = "";
}