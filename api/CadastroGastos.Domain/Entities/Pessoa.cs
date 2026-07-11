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

    // Propriedades de navegação (transações onde é pagador ou recebedor)
    [InverseProperty("Pagador")]
    public virtual ICollection<Transacao> TransacoesPagas { get; set; } = new List<Transacao>();

    [InverseProperty("Recebedor")]
    public virtual ICollection<Transacao> TransacoesRecebidas { get; set; } = new List<Transacao>();
}
