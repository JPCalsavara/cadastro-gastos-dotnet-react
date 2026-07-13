// Serviço centralizado para comunicação com a API.
// A URL base é lida da variável de ambiente VITE_API_URL definida no arquivo .env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function extractErrorMessage(response: Response, defaultMsg: string): Promise<never> {
  const text = await response.text();
  let errorMsg = text;
  try {
    // Se o backend retornou um JSON do GlobalExceptionMiddleware, extrai a chave "error"
    const parsed = JSON.parse(text);
    if (parsed.error) {
      errorMsg = parsed.error;
    }
  } catch {
    // Se não for um JSON válido, usa o texto bruto
  }
  throw new Error(errorMsg || defaultMsg);
}

// --- Funções de Pessoas ---

export async function fetchPessoas() {
  const response = await fetch(`${API_URL}/api/pessoas`);
  if (!response.ok) await extractErrorMessage(response, 'Erro ao buscar pessoas');
  return response.json();
}

export async function criarPessoa(payload: { nome: string; idade: number; saldo: number }) {
  const response = await fetch(`${API_URL}/api/pessoas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) await extractErrorMessage(response, 'Falha ao salvar pessoa');
  
  return response.json();
}

export async function deletarPessoa(id: number) {
  const response = await fetch(`${API_URL}/api/pessoas/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) await extractErrorMessage(response, 'Falha ao excluir pessoa');
}

// --- Funções de Transações ---

export async function fetchTransacoes() {
  const response = await fetch(`${API_URL}/api/transacoes`);
  if (!response.ok) await extractErrorMessage(response, 'Erro ao buscar transações');
  return response.json();
}

export async function criarTransacao(payload: {
  descricao: string;
  valor: number;
  tipo: string;
  pessoaId: number;
}) {
  const response = await fetch(`${API_URL}/api/transacoes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) await extractErrorMessage(response, 'Falha ao salvar transação');
  
  return response.json();
}
