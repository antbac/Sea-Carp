using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeaCarp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "SeaCarp");

            migrationBuilder.CreateTable(
                name: "User",
                schema: "SeaCarp",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ProfileImage = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_User_Email",
                schema: "SeaCarp",
                table: "User",
                column: "Email",
                unique: true);

            migrationBuilder.Sql("INSERT INTO [SeaCarp].[SeaCarp].[User] ([Email], [Password], [Description], [ProfileImage]) VALUES ('admin@seacarp.com', '4179A76F97865271164FA5CCCDAA0E3F173DC2E27B72BECAF83FDDC4EB799B9D', 'I''m a fish-crazy system administrator. I explore the ocean, tinker with my aquariums, and stay updated on aquatic research. My attention to detail and patience in solving tech problems reflect my love for fish.', 'https://img.uxwing.com/wp-content/themes/uxwing/download/editing-user-action/admin-icon.png')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "User",
                schema: "SeaCarp");
        }
    }
}