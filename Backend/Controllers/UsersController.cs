using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using InkluBilet.Database;
using InkluBilet.Database.Models;
using System.Data;

namespace InkluBilet.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(AppDbContext db) : ControllerBase
{
    public struct UserTemplate
    {
        public String Name { get; set; }
        public String Password { get; set; }
    }

    [HttpPost("AddUser")]
    public async Task<IActionResult> AddUser([FromBody] UserTemplate ut)
    {
        var org = await db.Users.Where(u => u.Name == ut.Name).FirstOrDefaultAsync();
        if (org != null)
        {
            return Conflict("User with specified name already exists.");
        }
        var x = new User { Name = ut.Name, Password = ut.Password };
        var y = await db.Users.AddAsync(x);
        await db.SaveChangesAsync();
        return Ok();
    }

    [HttpPost("Login/{name}")]
    public async Task<IActionResult> Login(String name, [FromBody] String password)
    {
        var u = await db.Users.Where(u => u.Name == name).Select(u => new { u.Id, u.Password }).FirstOrDefaultAsync();
        if (u == null || u.Password != password)
        {
            return NotFound();
        }
        return Ok(u.Id);
    }

    [HttpPost("BuyTicket/{id}")]
    public async Task<IActionResult> BuyTicket(Guid id, [FromBody] Guid eventId)
    {
        var e = await db.Events.Where(e => e.Id == eventId).Select(e => e.Id).FirstOrDefaultAsync();
        if (e == default)
        {
            return NotFound("Event not found.");
        }
        var u = await db.Users.Where(u => u.Id == id).Select(u => u.Id).FirstOrDefaultAsync();
        if (u == default)
        {
            return NotFound("User not found.");
        }
        Ticket ticket = new Ticket { EventId = e, UserId = u };
        await db.Tickets.AddAsync(ticket);
        await db.SaveChangesAsync();
        return Ok();
    }

    [HttpGet("GetTicketList/{id}")]
    public async Task<IActionResult> GetTicketList(Guid id)
    {
        var tickets = await db.Tickets.Where(t => t.UserId == id)
            .Select(t => new
            {
                t.Id,
                Event = new
                {
                    t.Event.Id,
                    t.Event.Name,
                    t.Event.Time,
                    t.Event.Location,
                    t.Event.Description,
                    t.Event.Accessibility,
                    t.Event.City,
                },
                Organiser = t.Event.Organisation.Name,
            }).ToListAsync();
        return Ok(tickets);
    }

    [HttpGet("GetTicket/{id}")]
    public async Task<IActionResult> GetTicket(Guid id)
    {
        var ticket = await db.Tickets.Where(t => t.Id == id)
            .Select(t => new
            {
                t.Id,
                Event = new
                {
                    t.Event.Id,
                    t.Event.Name,
                    t.Event.Time,
                    t.Event.Location,
                    t.Event.Description,
                    t.Event.Accessibility,
                    t.Event.City,
                },
                Organiser = t.Event.Organisation.Name,
            })
            .FirstOrDefaultAsync();
        if (ticket == default)
        {
            return NotFound();
        }
        return Ok(ticket);
    }
}