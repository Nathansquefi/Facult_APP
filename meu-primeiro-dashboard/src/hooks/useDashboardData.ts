import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import type { Transaction } from '../types/dashboard';

export function useDashboardData() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Novo estado para tratar erros de rede

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Uma API real de testes estruturada exatamente para o nosso dashboard
        // Altere apenas a linha do axios.get para esta:
        const response = await axios.get<Transaction[]>('http://localhost:3000/transactions');

        setTransactions(response.data);
      } catch (err) {
        console.error("Erro na requisição da API:", err);
        setError("Não foi possível conectar ao endpoint. Verifique sua conexão.");
      } finally {
        setLoading(false);
      }
    };

    fetchApiData();
  }, []);

  // Consolidação dos dados (continua igual, performance garantida com useMemo)
  const metrics = useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income += transaction.amount;
        } else {
          acc.expense += transaction.amount;
        }
        acc.balance = acc.income - acc.expense;
        return acc;
      },
      { income: 0, expense: 0, balance: 0 }
    );
  }, [transactions]);

  return { transactions, metrics, loading, error }; // Agora retornamos o erro também
}