using System.Runtime.Serialization;

namespace CadastroGastos.Domain.Enums;

public enum TipoTransacao
{
    [EnumMember(Value = "receita")]
    Receita,
    
    [EnumMember(Value = "despesa")]
    Despesa
}
