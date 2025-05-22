using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using InkluBilet.Database;
using InkluBilet.Database.Models;

[ApiController]
[Route("api/[controller]")]
public class TodosController(AppDbContext db) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> AddTodo([FromBody] int id)
    {
        var x = new Todo { Id = id, Title = "example title" };
        db.Todos.Add(x);
        await db.SaveChangesAsync();
        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> GetTodos()
    {
        var x = await db.Todos.ToListAsync();
        return Ok(x);
    }
}