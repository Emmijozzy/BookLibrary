using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BookLibrary.Server.Infrastructure.Migrations.SimplifiedAspBookProject
{
    /// <inheritdoc />
    public partial class FixDateTimeKind : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6ba4efbd-0481-43fe-9ce5-49630741cacc");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "d819fc88-08e9-411a-b616-5335108f65c6", "40e686c0-0895-45c4-a60e-de06cb624a3e" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d819fc88-08e9-411a-b616-5335108f65c6");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "40e686c0-0895-45c4-a60e-de06cb624a3e");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Description", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "6ba4efbd-0481-43fe-9ce5-49630741cacc", null, "Standard user role with limited access", "User", "USER" },
                    { "d819fc88-08e9-411a-b616-5335108f65c6", null, "Administrator role with full access", "Admin", "ADMIN" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "FullName", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "40e686c0-0895-45c4-a60e-de06cb624a3e", 0, "ff8a7259-4d1c-4579-8237-a5766aa42447", "admin@booklibrary.com", true, "System Administrator", false, null, "ADMIN@BOOKLIBRARY.COM", "ADMIN@BOOKLIBRARY.COM", "AQAAAAIAAYagAAAAEGqZSyOlX2GBa5nNUPZW/annTR1W/N2oeTWcy2kXW+vLyBPPNvAa6AFDHzfZqWlgDQ==", null, false, "f83e210d-0754-4aea-93f6-8da1e5332a81", false, "admin@booklibrary.com" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "d819fc88-08e9-411a-b616-5335108f65c6", "40e686c0-0895-45c4-a60e-de06cb624a3e" });
        }
    }
}
