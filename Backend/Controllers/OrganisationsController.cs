using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using InkluBilet.Database;
using InkluBilet.Database.Models;

namespace InkluBilet.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrganisationsController(AppDbContext db) : ControllerBase
{
    public struct OrganisationTemplate
    {
        public String Name { get; set; }
        public String Login { get; set; }
        public String Password { get; set; }
    }

    [HttpPost("AddOrganisation")]
    public async Task<IActionResult> AddOrganisation([FromBody] OrganisationTemplate o)
    {
        var org = await db.Organisations.Where(org => org.Name == o.Name).FirstOrDefaultAsync();
        if (org != null)
        {
            return Conflict("Organisation with specified name already exists.");
        }
        var x = new Organisation { Name = o.Name, Login = o.Login, Password = o.Password };
        var y = await db.Organisations.AddAsync(x);
        await db.SaveChangesAsync();
        return Ok();
    }

    [HttpPost("Login/{login}")]
    public async Task<IActionResult> Login(String login, [FromBody] String password)
    {
        var org = await db.Organisations.Where(o => o.Login == login).Select(o => new { o.Id, o.Password }).FirstOrDefaultAsync();
        if (org == null)
        {
            return NotFound();
        }
        if (org.Password != password)
        {
            return Forbid();
        }
        return Ok(org.Id);
    }

    // This doesn't do anything now, but will probably be useful in the future
    [HttpGet("GetOrganisation/{name}")]
    public async Task<IActionResult> GetOrganisation(String name)
    {
        var x = await db.Organisations.Where(o => o.Name == name).Select(o => new { o.Name }).FirstOrDefaultAsync();
        if (x == null)
        {
            return NotFound();
        }
        return Ok(x);
    }
    public struct EventTemplate
    {
        public String Name { get; set; }
        public String Description { get; set; }
        public DateTime Time { get; set; }
        public String Location { get; set; }
        public EventAccessibility Accessibility { get; set; }
    }

    [HttpPost("AddEvent/{id}")]
    public async Task<IActionResult> AddEvent(Guid id, [FromBody] EventTemplate e)
    {
        var org = await db.Organisations.Where(o => o.Id == id).FirstOrDefaultAsync();
        if (org == null)
        {
            return NotFound("Organisation not found.");
        }
        var x = new Event
        {
            Organisation = org,
            Name = e.Name,
            Description = e.Description,
            Time = e.Time,
            Location = e.Location,
            Accessibility = e.Accessibility
        };
        var y = await db.Events.AddAsync(x);
        await db.SaveChangesAsync();
        return Ok();
    }

    [HttpGet("GetAllEvents")]
    public async Task<IActionResult> GetAllEvents()
    {
        var x = await db.Events.Select(e => new
        {
            e.Id,
            e.Name,
            e.Description,
            e.Time,
            OrganisedBy = e.Organisation.Name,
            e.Location,
            e.Accessibility
        }).OrderBy(e => e.Time).ToListAsync();

        return Ok(x);
    }

    [HttpGet("GetOrgEvents/{id}")]
    public async Task<IActionResult> GetOrgEvents(Guid id)
    {
        var x = await db.Events.Where(e => e.OrganisationId == id).Select(e => new
        {
            e.Id,
            e.Name,
            e.Description,
            e.Time,
            e.Location,
            e.Accessibility
        }).ToListAsync();
        return Ok(x);
    }

    [HttpGet("GetAvailableEventDates")]
    public async Task<IActionResult> GetAvailableEventDates()
    {
        var x = await db.Events.Select(e => new
        {
            e.Time.Date
        }).Distinct().ToListAsync();
        return Ok(x);
    }

    public struct ChangeEventTemplate
    {
        public Guid EventId { get; set; }
        public EventTemplate NewEvent { get; set; }
    }

    [HttpPut("ChangeEvent/{id}")]
    public async Task<IActionResult> ChangeEvent(Guid id, [FromBody] ChangeEventTemplate newEvent)
    {
        Event? e = await db.Events.Where(e => e.Id == newEvent.EventId).FirstOrDefaultAsync();
        if (e == null)
        {
            return NotFound();
        }
        if (e.OrganisationId != id)
        {
            return Forbid();
        }
        e.Name = newEvent.NewEvent.Name;
        e.Description = newEvent.NewEvent.Description;
        e.Time = newEvent.NewEvent.Time;
        e.Location = newEvent.NewEvent.Location;
        e.Accessibility = newEvent.NewEvent.Accessibility;
        await db.SaveChangesAsync();
        return Ok();
    }
}
