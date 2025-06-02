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

    [HttpPost("LoginAsUser/{name}")]
    public async Task<IActionResult> LoginAsUser(String name, [FromBody] String password)
    {
        var u = await db.Users.Where(u => u.Name == name).Select(u => new { u.Id, u.Password }).FirstOrDefaultAsync();
        if (u == null)
        {
            return NotFound();
        }
        if (u.Password != password)
        {
            return Forbid();
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

    [HttpGet("GetTickets/{id}")]
    public async Task<IActionResult> GetTickets(Guid id)
    {
        var tickets = await db.Tickets.Where(t => t.UserId == id).Select(t => new { t.Id, t.Event }).ToListAsync();
        return Ok(tickets);
    }

}