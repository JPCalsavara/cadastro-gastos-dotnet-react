using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CadastroGastos.Domain.Entities;

[Table("Pessoas")]
public class Pessoa
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required(ErrorMessage = "O nome é obrigatório.")]
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    public int Idade { get; set; }

    // Saldo inicial do usuário
    public decimal Saldo { get; set; } = 0;

    // Propriedade de navegação (transações do usuário)
    [InverseProperty("Pessoa")]
    public virtual ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
}
