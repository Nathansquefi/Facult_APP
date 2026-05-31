import { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import FormCadastro from './components/FormCadastro';
import VisualizacaoGraficos from './components/VisualizacaoGraficos';
import DashboardHome from './components/DashboardHome';

function ListaDisciplinas({
  cadeiras,
  onExcluirCadeira,
}: {
  cadeiras: Cadeira[];
  onExcluirCadeira: (id: string) => void;
}) {
  if (cadeiras.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 space-y-3">
      {cadeiras.map((cadeira) => (
        <div
          key={cadeira.id}
          className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3"
        >
          <div>
            <p className="font-medium text-slate-100">{cadeira.nome}</p>
            <p className="text-xs text-slate-400">{cadeira.tipoMedia}</p>
          </div>
          <button
            type="button"
            onClick={() => onExcluirCadeira(cadeira.id)}
            className="rounded-md bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300 hover:bg-red-500/20"
          >
            Excluir
          </button>
        </div>
      ))}
    </div>
  );
}
interface Cadeira {
  id: string;
  nome: string;
  tipoMedia: 'aritmetica' | 'harmonica';
  notas: number[];
}

export default function App() {
  // Inicializa o app abrindo direto na aba 'dashboard' (Tela 3)
  const [abaAtiva, setAbaAtiva] = useState<'dashboard' | 'cadastro' | 'graficos'>('dashboard');

  const FormCadastroSeguro = FormCadastro as unknown as React.ComponentType<{
    onAdicionarCadeira: (nova: Cadeira) => void;
  }>;

  const [cadeiras, setCadeiras] = useState<Cadeira[]>(() => {
    const dadosSalvos = localStorage.getItem('@meu-dashboard-academico:cadeiras');
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });

  const handleAlterarNotaGlobal = (cadeiraId: string, notaIndex: number, novoValor: string) => {
    const valorNumerico = parseFloat(novoValor) || 0;

    const listaAtualizada = cadeiras.map((c) => {
      if (c.id === cadeiraId) {
        const novasNotas = [...c.notas];
        novasNotas[notaIndex] = valorNumerico;
        return { ...c, notas: novasNotas };
      }
      return c;
    });

    setCadeiras(listaAtualizada);
  };

  useEffect(() => {
    localStorage.setItem('@meu-dashboard-academico:cadeiras', JSON.stringify(cadeiras));
  }, [cadeiras]);

  return (
    <div className="min-h-screen bg-[#051424] text-slate-200 font-sans antialiased overflow-x-hidden">
      
      {/* SIDEBAR ATUALIZADA COM TRÊS ABAS OPERACIONAIS */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#051424] border-r border-[#3b494c] flex flex-col p-4 gap-2 z-50">
        <div className="mb-8 flex flex-col p-4">
          <h1 className="text-3xl text-cyan-400 font-bold tracking-tight">Facult</h1>
          <span className="text-sm text-slate-400 opacity-70">Portal Acadêmico</span>
        </div>
        
        <nav className="flex flex-col gap-2">
          {/* Aba 1: Dashboard Home */}
          <button 
            onClick={() => setAbaAtiva('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all text-sm font-medium cursor-pointer ${
              abaAtiva === 'dashboard' ? 'bg-[#474746] text-slate-100 font-bold shadow-sm' : 'text-slate-400 hover:bg-[#273647] hover:text-slate-100'
            }`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </button>

          {/* Aba 2: Disciplinas */}
          <button 
            onClick={() => setAbaAtiva('cadastro')}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all text-sm font-medium cursor-pointer ${
              abaAtiva === 'cadastro' ? 'bg-[#474746] text-slate-100 font-bold shadow-sm' : 'text-slate-400 hover:bg-[#273647] hover:text-slate-100'
            }`}
          >
            <span className="material-symbols-outlined">menu_book</span>
            <span>Disciplinas</span>
          </button>
          
          {/* Aba 3: Gráficos */}
          <button 
            onClick={() => setAbaAtiva('graficos')}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all text-sm font-medium cursor-pointer ${
              abaAtiva === 'graficos' ? 'bg-[#474746] text-slate-100 font-bold shadow-sm' : 'text-slate-400 hover:bg-[#273647] hover:text-slate-100'
            }`}
          >
            <span className="material-symbols-outlined">bar_chart</span>
            <span>Gráficos</span>
          </button>
        </nav>

        <div className="mt-auto p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-bold text-xs">AS</div>
          <div>
            <p className="text-xs font-semibold text-slate-200">Nathan Squefi Pacheco</p>
            <p className="text-[10px] text-slate-400">Ciencia da Computação</p>
          </div>
        </div>
      </aside>

      <TopBar />

      {/* CANVAS DINÂMICO CENTRAL */}
      <main className="ml-64 pt-16 min-h-screen bg-[#051424]">
        <div className="max-w-7xl mx-auto p-8">
          
          {abaAtiva === 'dashboard' && (
            <div>
              <header className="mb-8">
                <div className="flex items-center gap-1 text-cyan-400 mb-1">
                  <span className="material-symbols-outlined text-sm">space_dashboard</span>
                  <span className="text-xs font-bold tracking-wider uppercase">VISÃO SISTÊMICA</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-100 tracking-tight">Portal de Desempenho</h2>
                <p className="text-base text-slate-400 max-w-xl mt-1">Visão geral do progresso das disciplinas e metas de assiduidade.</p>
              </header>
              <DashboardHome 
  cadeiras={cadeiras} 
  onMudarAba={setAbaAtiva} 
  onAlterarNota={handleAlterarNotaGlobal} // <-- Linha adicionada!
/>
            </div>
          )}

         {abaAtiva === 'cadastro' && (
  <div>
    <header className="mb-8">
      <div className="flex items-center gap-1 text-cyan-400 mb-1">
        <span className="material-symbols-outlined text-sm">add_circle</span>
        <span className="text-xs font-bold tracking-wider uppercase">GESTÃO ACADÊMICA</span>
      </div>
      <h2 className="text-3xl font-bold text-slate-100 tracking-tight">Cadastrar Disciplina</h2>
      <p className="text-base text-slate-400 max-w-xl mt-1">Configure os critérios e pesos para acompanhar seu desempenho.</p>
    </header>
    
    {/* 1. FORMULÁRIO ENVIANDO O COMANDO DE SALVAR */}
    <FormCadastroSeguro onAdicionarCadeira={(nova) => setCadeiras([...cadeiras, nova])} />
    
    {/* 2. LISTA DE DISCIPLINAS CADASTRADAS */}
    <ListaDisciplinas 
      cadeiras={cadeiras} 
      onExcluirCadeira={(id) => setCadeiras(cadeiras.filter(c => c.id !== id))} 
    />
  </div>
)}

          {abaAtiva === 'graficos' && (
            <div>
              <header className="mb-8">
                <div className="flex items-center gap-1 text-cyan-400 mb-1">
                  <span className="material-symbols-outlined text-sm">insights</span>
                  <span className="text-xs font-bold tracking-wider uppercase">ANÁLISE AVANÇADA</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-100 tracking-tight">Análise de Desempenho</h2>
                <p className="text-base text-slate-400 max-w-xl mt-1">Insights detalhados da sua evolução acadêmica e projeções futuras.</p>
              </header>
              <VisualizacaoGraficos cadeiras={cadeiras} />
            </div>
          )}

        </div>
      </main>
    </div>
  );
}