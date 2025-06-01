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
    }

    [HttpPost("AddOrganisation")]
    public async Task<IActionResult> AddOrganisation([FromBody] OrganisationTemplate o)
    {
        var org = await db.Organisations.Where(org => org.Name == o.Name).FirstOrDefaultAsync();
        if (org != null)
        {
            return Conflict("Organisation with specified name already exists.");
        }
        var x = new Organisation { Name = o.Name };
        var y = await db.Organisations.AddAsync(x);
        await db.SaveChangesAsync();
        return Ok();
    }

    [HttpGet("GetOrganisation/{name}")]
    public async Task<IActionResult> GetOrganisation(String name)
    {
        var x = await db.Organisations.Where(o => o.Name == name).Select(o => new { o.Id, o.Name }).FirstOrDefaultAsync();
        if (x == null)
        {
            return NotFound();
        }
        return Ok(x);
    }
}