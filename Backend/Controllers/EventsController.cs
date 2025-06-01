using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using InkluBilet.Database;
using InkluBilet.Database.Models;

namespace InkluBilet.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController(AppDbContext db) : ControllerBase
{
    public struct EventTemplate
    {
        public String Name { get; set; }
        public String Description { get; set; }
        public String Time { get; set; }
    }

    [HttpPost("AddEvent/{id}")]
    public async Task<IActionResult> AddEvent(Guid id, [FromBody] EventTemplate e)
    {
        var org = await db.Organisations.Where(o => o.Id == id).FirstOrDefaultAsync();
        if (org == null) {
            return NotFound("Organisation not found.");
        }
        var x = new Event { Organiser = org, Name = e.Name, Description = e.Description, Time = e.Time };
        var y = await db.Events.AddAsync(x);
        await db.SaveChangesAsync();
        return Ok();
    }

    [HttpGet("GetEvents")]
    public async Task<IActionResult> GetEvents()
    {
        var x = await db.Events.Select(e => new
        {
            e.Name,
            e.Description,
            e.Time,
            OrganisedBy = e.Organiser.Name
        }).ToListAsync();

        return Ok(x);
    }
}