using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CadastroGastos.Domain.Entities;

[Table("Transacoes")]
public class Transacao
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Descricao { get; set; } = string.Empty;

    [Required]
    public decimal Valor { get; set; }

    [Required]
    public string Tipo { get; set; } = string.Empty; // "receita" ou "despesa"

    // Relacionamento com Pagador
    public int PagadorId { get; set; }
    
    [ForeignKey("PagadorId")]
    public virtual Pessoa Pagador { get; set; } = null!;

    // Relacionamento com Recebedor
    public int RecebedorId { get; set; }
    
    [ForeignKey("RecebedorId")]
    public virtual Pessoa Recebedor { get; set; } = null!;
}
