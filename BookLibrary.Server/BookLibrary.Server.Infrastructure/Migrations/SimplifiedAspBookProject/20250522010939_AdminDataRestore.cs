using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BookLibrary.Server.Infrastructure.Migrations.SimplifiedAspBookProject
{
    /// <inheritdoc />
    public partial class AdminDataRestore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
        }
    }
}
