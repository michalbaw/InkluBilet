using System.ComponentModel.DataAnnotations;

namespace InkluBilet.Database.Models;

public enum TicketType
{
    Normal,
    Discounted
}

public class Ticket
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid EventId { get; set; }
    public Event Event { get; set; } = null!;

    [Required]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    [Required]
    public TicketType Type { get; set; } = TicketType.Normal;
}
