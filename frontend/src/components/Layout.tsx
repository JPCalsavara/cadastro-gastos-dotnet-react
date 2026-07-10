import { useState, useEffect, useCallback } from 'react';
import PessoasPage from './Pessoas/PessoasPage';
import TransacoesPage from './Transacoes/TransacoesPage';
import DashboardPage from './Resumo/DashboardPage';
import { fetchPessoas, fetchTransacoes } from '../services/api';
import type { Pessoa, Transacao } from '../types';

export default function Layout() {
    const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);

    // Função de refetch reutilizável — chamada no mount e após mutações
    const carregarDados = useCallback(async () => {
        try {
            const [pessoasData, transacoesData] = await Promise.all([
                fetchPessoas(),
                fetchTransacoes()
            ]);
            setPessoas(pessoasData);
            setTransacoes(transacoesData);
        } catch (err) {
            console.error("Erro ao carregar dados:", err);
        }
    }, []);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Controle de Gastos</h1>
            </header>

            <main className="app-main">
                <div className="dashboard-grid">
                    <PessoasPage pessoas={pessoas} setPessoas={setPessoas} transacoes={transacoes} onRefetch={carregarDados} />
                    <TransacoesPage transacoes={transacoes} setTransacoes={setTransacoes} pessoas={pessoas} onRefetch={carregarDados} />
                </div>

                <div className="dashboard-footer">
                    <DashboardPage transacoes={transacoes} />
                </div>
            </main>
        </div>
    )
}
