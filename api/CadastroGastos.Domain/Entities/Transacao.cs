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

    // Relacionamento com Pessoa
    public int PessoaId { get; set; }
    
    [ForeignKey("PessoaId")]
    public virtual Pessoa Pessoa { get; set; } = null!;
}
