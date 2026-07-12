using System.ComponentModel.DataAnnotations;
using CadastroGastos.Domain.Enums;

namespace CadastroGastos.Domain.DTOs;

public class TransacaoCreateDto
{
    [Required(ErrorMessage = "A descrição é obrigatória.")]
    [MaxLength(200, ErrorMessage = "A descrição deve ter no máximo 200 caracteres.")]
    public string Descricao { get; set; } = string.Empty;

    [Required(ErrorMessage = "O valor é obrigatório.")]
    [Range(0.01, double.MaxValue, ErrorMessage = "O valor da transação deve ser positivo.")]
    public decimal Valor { get; set; }

    [Required(ErrorMessage = "O tipo de transação é obrigatório.")]
    public TipoTransacao Tipo { get; set; }

    [Required(ErrorMessage = "A pessoa é obrigatória.")]
    public int PessoaId { get; set; }
}
