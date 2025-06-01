using Microsoft.EntityFrameworkCore;
using InkluBilet.Database;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var DevelopmentAllAllow = "_developmentAllAllow";

builder.Services.AddCors(options =>
{
    options.AddPolicy(DevelopmentAllAllow,
        policy =>
		{
            policy.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseCors(DevelopmentAllAllow);
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();