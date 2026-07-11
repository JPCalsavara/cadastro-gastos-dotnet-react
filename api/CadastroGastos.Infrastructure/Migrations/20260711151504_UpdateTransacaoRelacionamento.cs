using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CadastroGastos.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTransacaoRelacionamento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transacoes_Pessoas_PagadorId",
                table: "Transacoes");

            migrationBuilder.DropForeignKey(
                name: "FK_Transacoes_Pessoas_RecebedorId",
                table: "Transacoes");

            migrationBuilder.DropIndex(
                name: "IX_Transacoes_PagadorId",
                table: "Transacoes");

            migrationBuilder.DropColumn(
                name: "PagadorId",
                table: "Transacoes");

            migrationBuilder.RenameColumn(
                name: "RecebedorId",
                table: "Transacoes",
                newName: "PessoaId");

            migrationBuilder.RenameIndex(
                name: "IX_Transacoes_RecebedorId",
                table: "Transacoes",
                newName: "IX_Transacoes_PessoaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transacoes_Pessoas_PessoaId",
                table: "Transacoes",
                column: "PessoaId",
                principalTable: "Pessoas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transacoes_Pessoas_PessoaId",
                table: "Transacoes");

            migrationBuilder.RenameColumn(
                name: "PessoaId",
                table: "Transacoes",
                newName: "RecebedorId");

            migrationBuilder.RenameIndex(
                name: "IX_Transacoes_PessoaId",
                table: "Transacoes",
                newName: "IX_Transacoes_RecebedorId");

            migrationBuilder.AddColumn<int>(
                name: "PagadorId",
                table: "Transacoes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Transacoes_PagadorId",
                table: "Transacoes",
                column: "PagadorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transacoes_Pessoas_PagadorId",
                table: "Transacoes",
                column: "PagadorId",
                principalTable: "Pessoas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Transacoes_Pessoas_RecebedorId",
                table: "Transacoes",
                column: "RecebedorId",
                principalTable: "Pessoas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
