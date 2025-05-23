using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BookLibrary.Server.Infrastructure.Migrations.Production
{
    /// <inheritdoc />
    public partial class UpdateProductionSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "82cf70fc-496c-44ff-a423-33ae755c4445");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "b1cbd368-a90c-4b53-a448-b65fd7dea7fe", "6b1dd0ae-522a-4c51-bdd2-e9b7bf339ac1" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b1cbd368-a90c-4b53-a448-b65fd7dea7fe");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "6b1dd0ae-522a-4c51-bdd2-e9b7bf339ac1");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Description", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1df1bc67-7e69-47b6-a625-008a4403f296", null, "Standard user role with limited access", "User", "USER" },
                    { "a6300e37-8760-4045-ab10-f4012da959e7", null, "Administrator role with full access", "Admin", "ADMIN" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "FullName", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "75332a84-fa61-4138-9429-70940a98b90d", 0, "9a836417-27b4-4af1-abf0-8d7070cde1d2", "admin@booklibrary.com", true, "System Administrator", false, null, "ADMIN@BOOKLIBRARY.COM", "ADMIN@BOOKLIBRARY.COM", "AQAAAAIAAYagAAAAECAeCvRCkKI9dWJKsl7pQ16V5w3w+uo7QpUWYyZ1rWjpQ4HRQcxDkmH4QxMKVciUVg==", null, false, "e2b5fe68-42e7-4f6b-b8af-8ceb1ed9c8a4", false, "admin@booklibrary.com" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "a6300e37-8760-4045-ab10-f4012da959e7", "75332a84-fa61-4138-9429-70940a98b90d" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1df1bc67-7e69-47b6-a625-008a4403f296");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "a6300e37-8760-4045-ab10-f4012da959e7", "75332a84-fa61-4138-9429-70940a98b90d" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a6300e37-8760-4045-ab10-f4012da959e7");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "75332a84-fa61-4138-9429-70940a98b90d");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Description", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "82cf70fc-496c-44ff-a423-33ae755c4445", null, "Standard user role with limited access", "User", "USER" },
                    { "b1cbd368-a90c-4b53-a448-b65fd7dea7fe", null, "Administrator role with full access", "Admin", "ADMIN" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "FullName", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "6b1dd0ae-522a-4c51-bdd2-e9b7bf339ac1", 0, "e654ed02-f737-40b5-90b2-98053c9e5bc5", "admin@booklibrary.com", true, "System Administrator", false, null, "ADMIN@BOOKLIBRARY.COM", "ADMIN@BOOKLIBRARY.COM", "AQAAAAIAAYagAAAAEA8Q2EnJCw/zkUzhLZknWBdN5I/4b7XSHpWy7DXXioQqCe7gcR/h3V2176fj+WwoOA==", null, false, "ad2ee865-d444-42a4-b779-1c184e367db9", false, "admin@booklibrary.com" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "b1cbd368-a90c-4b53-a448-b65fd7dea7fe", "6b1dd0ae-522a-4c51-bdd2-e9b7bf339ac1" });
        }
    }
}
