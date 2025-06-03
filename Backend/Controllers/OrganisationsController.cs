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
        var x = new Organisation { Name = o.Name, Password = o.Password };
        var y = await db.Organisations.AddAsync(x);
        await db.SaveChangesAsync();
        return Ok();
    }

    [HttpPost("Login/{name}")]
    public async Task<IActionResult> Login(String name, [FromBody] String password)
    {
        var org = await db.Organisations.Where(o => o.Name == name).Select(o => new { o.Id, o.Password }).FirstOrDefaultAsync();
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
        public String Time { get; set; }
    }

    [HttpPost("AddEvent/{id}")]
    public async Task<IActionResult> AddEvent(Guid id, [FromBody] EventTemplate e)
    {
        var org = await db.Organisations.Where(o => o.Id == id).FirstOrDefaultAsync();
        if (org == null) {
            return NotFound("Organisation not found.");
        }
        var x = new Event { Organisation = org, Name = e.Name, Description = e.Description, Time = e.Time };
        var y = await db.Events.AddAsync(x);
        await db.SaveChangesAsync();
        return Ok();
    }

    [HttpGet("GetEvents")]
    public async Task<IActionResult> GetEvents()
    {
        var x = await db.Events.Select(e => new
        {
            e.Id,
            e.Name,
            e.Description,
            e.Time,
            OrganisedBy = e.Organisation.Name
        }).ToListAsync();

        return Ok(x);
    }
}