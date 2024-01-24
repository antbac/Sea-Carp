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
                    Password = table.Column<string>(type: "nchar(64)", fixedLength: true, maxLength: 64, nullable: false),
                    Salt = table.Column<string>(type: "nchar(64)", fixedLength: true, maxLength: 64, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    ProfileImage = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Discussion",
                schema: "SeaCarp",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StartedById = table.Column<int>(type: "int", nullable: false),
                    Topic = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Discussion", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Discussion_User_StartedById",
                        column: x => x.StartedById,
                        principalSchema: "SeaCarp",
                        principalTable: "User",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Post",
                schema: "SeaCarp",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WrittenById = table.Column<int>(type: "int", nullable: false),
                    Text = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Dislikes = table.Column<int>(type: "int", nullable: false),
                    Likes = table.Column<int>(type: "int", nullable: false),
                    DiscussionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Post", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Post_Discussion_DiscussionId",
                        column: x => x.DiscussionId,
                        principalSchema: "SeaCarp",
                        principalTable: "Discussion",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Post_User_WrittenById",
                        column: x => x.WrittenById,
                        principalSchema: "SeaCarp",
                        principalTable: "User",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Discussion_StartedById",
                schema: "SeaCarp",
                table: "Discussion",
                column: "StartedById");

            migrationBuilder.CreateIndex(
                name: "IX_Post_DiscussionId",
                schema: "SeaCarp",
                table: "Post",
                column: "DiscussionId");

            migrationBuilder.CreateIndex(
                name: "IX_Post_WrittenById",
                schema: "SeaCarp",
                table: "Post",
                column: "WrittenById");

            migrationBuilder.CreateIndex(
                name: "IX_User_Email",
                schema: "SeaCarp",
                table: "User",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Post",
                schema: "SeaCarp");

            migrationBuilder.DropTable(
                name: "Discussion",
                schema: "SeaCarp");

            migrationBuilder.DropTable(
                name: "User",
                schema: "SeaCarp");
        }
    }
}
