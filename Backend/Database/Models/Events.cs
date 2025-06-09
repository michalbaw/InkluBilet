using System.ComponentModel.DataAnnotations;
using System.Diagnostics.Tracing;

namespace InkluBilet.Database.Models;

public enum EventAccessibility
{
    None,
    PersonReading,
    Captions,
}

public class Event
{
    [Key]
    public Guid Id { get; set; }

    public virtual Organisation Organisation { get; set; } = null!;

    [Required]
    public Guid OrganisationId { get; set; }

    [Required]
    public String Name { get; set; } = "";

    [Required]
    public String Location { get; set; } = "";

    [Required]
    public String Description { get; set; } = "";

    [Required]
    public DateTime Time { get; set; } = DateTime.Now;

    [Required]
    public EventAccessibility Accessibility { get; set; } = EventAccessibility.None;

    public ICollection<Ticket> Tickets { get; } = [];
}
