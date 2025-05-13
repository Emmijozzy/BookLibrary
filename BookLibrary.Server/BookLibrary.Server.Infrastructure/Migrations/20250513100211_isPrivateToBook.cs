using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BookLibrary.Server.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class isPrivateToBook : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<bool>(
                name: "IsPrivate",
                table: "Books",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Description", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1a45afb0-1fc5-4536-a78a-f9233be401b0", null, "Administrator role with full access", "Admin", "ADMIN" },
                    { "a9beed4b-8fe4-4c36-86b4-645ed543ebae", null, "Standard user role with limited access", "User", "USER" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "FullName", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "e1dd5284-2a42-4f5a-bbd6-42aa11d043f5", 0, "5860245a-7046-4611-be59-d878d6f002f8", "admin@booklibrary.com", true, "System Administrator", false, null, "ADMIN@BOOKLIBRARY.COM", "ADMIN@BOOKLIBRARY.COM", "AQAAAAIAAYagAAAAEIbeiIV5j789zlc7/jAiFzg1a2Vw4XxWkYBd4Udu0OarWiwxXXeLZELiG1Zdv19k9w==", null, false, "f82e9cb9-9c52-4851-8b00-b115d899669a", false, "admin@booklibrary.com" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "1a45afb0-1fc5-4536-a78a-f9233be401b0", "e1dd5284-2a42-4f5a-bbd6-42aa11d043f5" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a9beed4b-8fe4-4c36-86b4-645ed543ebae");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "1a45afb0-1fc5-4536-a78a-f9233be401b0", "e1dd5284-2a42-4f5a-bbd6-42aa11d043f5" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1a45afb0-1fc5-4536-a78a-f9233be401b0");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "e1dd5284-2a42-4f5a-bbd6-42aa11d043f5");

            migrationBuilder.DropColumn(
                name: "IsPrivate",
                table: "Books");

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
    }
}
