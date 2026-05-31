import { useDashboardData } from './hooks/useDashboardData';
export const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};
// Função para converter os dados e disparar o download do CSV
export const exportarParaCSV = (dados: any[]) => {
  if (dados.length === 0) return;

  // 1. Definição dos cabeçalhos da planilha (Primeira linha)
  const cabecalhos = ['ID', 'Categoria', 'Valor (R$)', 'Tipo', 'Data'];

  // 2. Transforma as linhas de dados. Usamos o ponto-e-vírgula (;) porque o Excel em português abre direto sem quebrar a formatação.
  const linhas = dados.map(t => [
    t.id,
    t.category,
    t.amount.toFixed(2), // Salva o número puro com duas casas decimais
    t.type === 'income' ? 'Entrada' : 'Saída',
    t.date
  ]);

  // 3. Junta os cabeçalhos com as linhas em uma única string de texto
  const conteudoCSV = [
    cabecalhos.join(';'), 
    ...linhas.map(linha => linha.join(';'))
  ].join('\n');

  // 4. Cria o arquivo na memória (Blob) adicionando a tag BOM para o Excel entender caracteres acentuados (como "Alimentação")
  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), conteudoCSV], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // 5. Cria um elemento de link oculto na página para forçar o download
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `consolidacao_financeira_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click(); // Força o clique do usuário de forma invisível
  document.body.removeChild(link); // Remove o link após o download
};
export default function Dashboard() {
  const { transactions, metrics, loading, error } = useDashboardData();

  // 1. Estado de Carregamento (Loading)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="font-medium text-slate-600">Buscando dados no endpoint remoto...</p>
        </div>
      </div>
    );
  }

  // 2. Novo Estado de Erro 
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-rose-100 text-center max-w-md">
          <div className="text-rose-500 text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Falha na Integração</h3>
          <p className="text-slate-500 text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // 3. Renderização do Dashboard (
  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-800">
      {/* ... todo o resto do código do dashboard que você já fez permanece aqui ... */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Consolidação Financeira</h1>
        <p className="text-slate-500">Métricas consolidadas em tempo real através dos endpoints de transações.</p>
      </header>

      {/* Seção de KPIs (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Entradas</span>
          <p className="text-2xl font-bold text-emerald-600 mt-2"> {formatarMoeda(metrics.income)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Saídas</span>
          <p className="text-2xl font-bold text-rose-600 mt-2"> {formatarMoeda(metrics.expense)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Saldo Líquido</span>
          <p className={`text-2xl font-bold mt-2 ${metrics.balance >= 0 ? 'text-slate-800' : 'text-rose-600'}`}>
            {formatarMoeda(metrics.balance)}
          </p>
        </div>
      </div>

      {/* Tabela de Dados Brutos */}
<div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
  
  {/* Modifique este bloco do cabeçalho da tabela */}
  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
    <h2 className="font-semibold text-lg">Registros Consolidados</h2>
    
    <button
      onClick={() => exportarParaCSV(transactions)}
      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
    >
      📥 Exportar Planilha (CSV)
    </button>
  </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-xs uppercase font-semibold">
              <th className="p-4">Categoria</th>
              <th className="p-4">Data</th>
              <th className="p-4 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-medium">{t.category}</td>
                <td className="p-4 text-slate-500">{t.date}</td>
                <td className={`p-4 text-right font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {t.type === 'income' ? '+' : '-'} {formatarMoeda(t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}