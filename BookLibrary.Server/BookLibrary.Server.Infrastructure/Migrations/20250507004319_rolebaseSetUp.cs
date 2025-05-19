using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BookLibrary.Server.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class rolebaseSetUp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "1", "1" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "1");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Description", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "47029514-1de4-4807-8043-3dcd4dafe6c7", null, "Standard user role with limited access", "User", "USER" },
                    { "c6da810a-10f5-4dda-863d-1bc8d59dc69d", null, "Administrator role with full access", "Admin", "ADMIN" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "FullName", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "99dd87f0-a0bd-4a97-8511-0995c825b611", 0, "cb704a49-5f57-4f98-9dfa-e21eb5643263", "admin@booklibrary.com", true, "System Administrator", false, null, "ADMIN@BOOKLIBRARY.COM", "ADMIN@BOOKLIBRARY.COM", "AQAAAAIAAYagAAAAEDVHFO7qJ9EtS5hPjVy2Du5C0ahiTbXyx5Wi5wQeQtc0U2GYqV0fjVk8KDirLqBQbg==", null, false, "c01fabfc-ec46-4675-bfdf-ae60dbc55038", false, "admin@booklibrary.com" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "c6da810a-10f5-4dda-863d-1bc8d59dc69d", "99dd87f0-a0bd-4a97-8511-0995c825b611" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "47029514-1de4-4807-8043-3dcd4dafe6c7");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "c6da810a-10f5-4dda-863d-1bc8d59dc69d", "99dd87f0-a0bd-4a97-8511-0995c825b611" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c6da810a-10f5-4dda-863d-1bc8d59dc69d");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "99dd87f0-a0bd-4a97-8511-0995c825b611");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Description", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1", null, "Administrator role with full access", "Admin", "ADMIN" },
                    { "2", null, "Standard user role with limited access", "User", "USER" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "FullName", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "1", 0, "fc35d5df-ac07-44a7-ac92-81ef41e11008", "admin@booklibrary.com", true, "System Administrator", false, null, "ADMIN@BOOKLIBRARY.COM", "ADMIN@BOOKLIBRARY.COM", "AQAAAAIAAYagAAAAEG2xccpSku/Ebr0Hr+QEh5AJEs7nY4pK8OBgpVJlZX9r5u3waBcpt2e2O6dUEEg25Q==", null, false, "a12e6ccc-5870-4a4a-8a5e-7a948cadd0b6", false, "admin@booklibrary.com" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "1", "1" });
        }
    }
}
