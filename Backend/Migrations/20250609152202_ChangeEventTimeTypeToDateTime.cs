using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class ChangeEventTimeTypeToDateTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(""" ALTER TABLE "Events" ALTER COLUMN "Time" TYPE timestamp with time zone USING ("Time"::timestamp); """);
            // migrationBuilder.AlterColumn<DateTime>(
            //     name: "Time",
            //     table: "Events",
            //     type: "timestamp with time zone",
            //     nullable: false,
            //     oldClrType: typeof(string),
            //     oldType: "text");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Time",
                table: "Events",
                type: "text",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");
        }
    }
}
