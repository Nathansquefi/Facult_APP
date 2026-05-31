import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface Cadeira {
  id: string;
  nome: string;
  tipoMedia: 'aritmetica' | 'harmonica';
  notas: number[];
}

interface DashboardHomeProps {
  cadeiras: Cadeira[];
  onMudarAba: (aba: 'dashboard' | 'cadastro' | 'graficos') => void;
  onAlterarNota: (cadeiraId: string, notaIndex: number, novoValor: string) => void; // <-- Adicione essa linha
}

// Utilitário interno para cálculo de médias
const calcularMediaCadeira = (notas: number[], tipo: 'aritmetica' | 'harmonica'): number => {
  if (notas.length === 0) return 0;
  if (tipo === 'aritmetica') {
    return notas.reduce((acc, n) => acc + n, 0) / notas.length;
  }
  if (notas.some(n => n === 0)) return 0;
  return notas.length / notas.reduce((acc, n) => acc + (1 / n), 0);
};

// Transforma nota em letra
const obterLetraConceito = (nota: number): string => {
  if (nota < 6.0) return 'D';
  if (nota <= 7.5) return 'C';
  if (nota <= 9.0) return 'B';
  return 'A';
};

export default function DashboardHome({ cadeiras, onMudarAba, onAlterarNota }: DashboardHomeProps) {
  
 const dadosGerais = useMemo(() => {
  if (cadeiras.length === 0) return { gpa: '0.00', totalCadeiras: 0, listaDestaques: [], dadosGrafico: [] };

  const materiasCalculadas = cadeiras.map(c => {
    const media = calcularMediaCadeira(c.notas, c.tipoMedia);
    return {
      id: c.id,
      nome: c.nome,
      media: media,
      conceito: obterLetraConceito(media),
      // Objeto formatado para o Recharts ler
      "Nota Atual": parseFloat(media.toFixed(2))
    };
  });

  const somaGpa = materiasCalculadas.reduce((acc, m) => acc + m.media, 0);
  const gpaGeral = (somaGpa / cadeiras.length).toFixed(2);
  const destaques = materiasCalculadas.slice(0, 2);

  return {
    gpa: gpaGeral,
    totalCadeiras: cadeiras.length,
    listaDestaques: destaques,
    dadosGrafico: materiasCalculadas // <-- Adicionado aqui!
  };
}, [cadeiras]);

  // Configuração do Anel de Frequência (Frequência estática de 90%)
  const raioFrequencia = 58;
  const circunferencia = 2 * Math.PI * raioFrequencia; // 364.4
  const frequenciaPorcentagem = 90;
  const strokeDashoffset = circunferencia - (frequenciaPorcentagem / 100) * circunferencia;

  return (
    <div className="grid grid-cols-12 gap-6 max-w-[1600px] mx-auto">
      
      {/* COLUNA ESQUERDA/CENTRAL: HISTÓRICO E DESTAQUES (8 Colunas) */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        
        {/* Gráfico de Desempenho por Semestre */}
       {/* NOVO GRÁFICO DE BARRAS HORIZONTAIS (BARRAS DE PROGRESSO POR MATÉRIA) */}
<section className="glass-card rounded-xl p-6 flex flex-col relative overflow-hidden">
  <div className="flex justify-between items-end mb-6">
    <div>
      <h2 className="text-xl font-bold text-slate-100">Progresso por Disciplina</h2>
      <p className="text-xs text-slate-400">Visualização do rendimento atual em relação à média de corte</p>
    </div>
    <span className="flex items-center gap-1 px-3 py-1 bg-cyan-400/10 text-cyan-400 text-xs font-bold rounded-full border border-cyan-400/20">
      Média Geral: {dadosGerais.gpa}
    </span>
  </div>

  <div className="min-h-[260px] w-full mt-4">
    {cadeiras.length === 0 ? (
      <div className="h-48 flex items-center justify-center text-xs text-slate-500 italic">
        Nenhuma matéria cadastrada para exibir o progresso.
      </div>
    ) : (
      <ResponsiveContainer width="100%" height={cadeiras.length * 50 + 40}>
        {/* Adicionamos layout="vertical" para deitar as barras */}
        <BarChart 
          data={dadosGerais.dadosGrafico} 
          layout="vertical"
          margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e2b3c" />
          
          {/* O eixo X agora é numérico (de 0 a 10) */}
          <XAxis type="number" domain={[0, 10]} stroke="#64748b" fontSize={11} tickLine={false} />
          
          {/* O eixo Y agora exibe o Nome das Matérias */}
          <YAxis dataKey="nome" type="category" stroke="#64748b" fontSize={11} tickLine={false} width={120} textAnchor="start" dx={-130} />
          
          <Tooltip 
            contentStyle={{ backgroundColor: '#122131', border: '1px solid #3b494c', borderRadius: '8px', color: '#fff' }}
            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
          />
          
          {/* Linha vertical tracejada indicando a meta de aprovação (6.0) */}
          <ReferenceLine x={6.0} stroke="#ff4b4b" strokeDasharray="3 3" label={{ value: 'META 6.0', fill: '#ff4b4b', fontSize: 10, position: 'top' }} />
          
          {/* A Barra se transforma em um indicador horizontal com bordas arredondadas na ponta direita */}
          <Bar 
            dataKey="Nota Atual" 
            radius={[0, 4, 4, 0]} 
            barSize={16}
            fill="#00e5ff"
          />
        </BarChart>
      </ResponsiveContainer>
    )}
  </div>
</section>

        {/* Grid de Disciplinas Destaques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dadosGerais.listaDestaques.length === 0 ? (
            <div className="col-span-2 p-5 bg-[#0d1c2d]/40 border border-dashed border-[#3b494c] rounded-xl text-center text-xs text-slate-400 cursor-pointer hover:border-cyan-400/40 transition-colors" onClick={() => onMudarAba('cadastro')}>
              + Cadastre suas primeiras disciplinas para gerar os blocos de resumo rápidos.
            </div>
          ) : (
            <>
              {dadosGerais.listaDestaques.map((m) => {
  // Busca a cadeira completa para pegar o array de notas original e o tipo de média
  const cadeiraCompleta = cadeiras.find(c => c.id === m.id)!;

  return (
    <div key={m.id} className="glass-card p-5 rounded-xl flex flex-col justify-between border border-[#3b494c]/30 hover:border-cyan-400/40 transition-all group">
      
      {/* Topo do Card: Nome e Tipo de Média */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100">{m.nome}</h3>
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider block mt-1 w-max ${
            cadeiraCompleta.tipoMedia === 'aritmetica' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/10 text-purple-400'
          }`}>
            {cadeiraCompleta.tipoMedia === 'aritmetica' ? 'Aritmética' : 'Harmônica'}
          </span>
        </div>

        {/* Letra do Conceito Dinâmica com a cor certa */}
        <span className={`inline-block px-2.5 py-0.5 rounded font-black text-sm border ${
          m.conceito === 'D' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : m.conceito === 'C' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
        }`}>{m.conceito}</span>
      </div>
      
      {/* NOVO PAINEL DE NOTAS: INPUTS VIVOS PARA PREENCHIMENTO */}
      <div className="mb-4 bg-[#010f1f]/40 p-3 rounded-lg border border-[#3b494c]/20">
        <span className="text-[10px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">Notas das Avaliações:</span>
        <div className="flex flex-wrap gap-3">
          {cadeiraCompleta.notas.map((nota, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-[9px] text-slate-500 font-bold mb-1">A{index + 1}</span>
              <input 
                type="number"
                step="0.1"
                min="0"
                max="10"
                placeholder="0.0"
                value={nota || ''}
                onChange={(e) => onAlterarNota(m.id, index, e.target.value)}
                className="w-12 bg-[#010f1f] border border-[#3b494c] rounded px-1.5 py-1 text-center text-xs font-bold text-slate-200 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Rodapé do Card: Média Final Calculada */}
      <div className="border-t border-[#3b494c]/20 pt-3 flex justify-between items-center text-xs">
        <span className="text-slate-400 font-medium">Média Consolidada:</span>
        <span className="font-bold text-slate-200 text-sm">{m.media.toFixed(2)}</span>
      </div>

    </div>
  );
              })}
            </>
          )}
        </div>

        {/* Linha do Tempo de Atividades */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4">Atividades Recentes</h3>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,229,255,0.6)]"></div>
              <div>
                <p className="text-sm text-slate-200 font-semibold">Cálculo de Média Automatizado</p>
                <p className="text-xs text-slate-400">Seu GPA foi recalculado dinamicamente para <span className="text-cyan-400 font-bold">{dadosGerais.gpa}</span>.</p>
                <p className="text-[10px] text-cyan-400 mt-1 uppercase font-bold">Agora mesmo</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-slate-500"></div>
              <div>
                <p className="text-sm text-slate-300">Persistência Ativada</p>
                <p className="text-xs text-slate-400">O banco de dados local sincronizou suas alterações com segurança no disco rígido.</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase">Sincronizado</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COLUNA DIREITA: ANÉIS DE PROGRESSO E CALENDÁRIO (4 Colunas) */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        
        {/* Minis KPIs Rápidos */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-5 rounded-xl flex flex-col gap-2">
            <span className="text-slate-400 text-xs uppercase tracking-wider font-medium">Média Geral</span>
            <span className="text-2xl font-bold text-cyan-400">{dadosGerais.gpa}</span>
            <div className="w-full bg-[#1c2b3c] h-1 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full transition-all" style={{ width: `${Math.min(100, parseFloat(dadosGerais.gpa) * 10)}%` }}></div>
            </div>
          </div>
          <div className="glass-card p-5 rounded-xl flex flex-col gap-2">
            <span className="text-slate-400 text-xs uppercase tracking-wider font-medium">Créditos</span>
            <span className="text-2xl font-bold text-slate-200">124</span>
            <span className="text-[10px] text-slate-500">De 240 totais</span>
          </div>
        </div>

        {/* Anel de Progresso de Frequência NATIVO REACT */}
        <div className="glass-card p-6 rounded-xl flex flex-col items-center gap-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Frequência Geral</h3>
          <div className="relative flex items-center justify-center w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="progress-ring-bg" cx="64" cy="64" r={raioFrequencia} fill="transparent" stroke="#1c2b3c" strokeWidth="8"></circle>
              <circle 
                cx="64" 
                cy="64" 
                r={raioFrequencia} 
                fill="transparent" 
                stroke="#00e5ff" 
                strokeWidth="8"
                strokeDasharray={circunferencia}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-cyan-400">{frequenciaPorcentagem}%</span>
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Presença</span>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 leading-relaxed">
            Seu nível de assiduidade está 15% acima do limite de reprovação.
          </p>
        </div>

        {/* Próximo Passo Card Inteligente */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-[#001f24] p-6 rounded-xl flex flex-col gap-3 shadow-lg shadow-cyan-500/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg font-bold">auto_awesome</span>
            <h3 className="text-sm font-bold uppercase tracking-wider">Próximo Passo</h3>
          </div>
          <p className="text-xs font-semibold leading-relaxed text-[#002f37]">
            {cadeiras.length > 0 
              ? `Continue alimentando e revisando as notas das suas ${dadosGerais.totalCadeiras} disciplinas registradas para blindar os conceitos.`
              : "Abra a aba de disciplinas e faça seu primeiro cadastro para liberar os relatórios analíticos do ecossistema."
            }
          </p>
          <button 
            onClick={() => onMudarAba('cadastro')}
            className="w-full bg-[#001f24] text-white py-2.5 rounded-lg text-xs font-bold hover:bg-[#00363d] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Gerenciar Matérias</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>

        {/* Widget do Calendário */}
        <div className="glass-card p-5 rounded-xl flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Calendário Semestral</h3>
            <span className="text-[10px] text-cyan-400 font-bold cursor-pointer hover:underline">Ver tudo</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-[#0d1c2d]/40 border border-[#3b494c]/20">
              <div className="flex flex-col items-center justify-center w-10 h-10 bg-[#1c2b3c] rounded border border-[#3b494c] shrink-0">
                <span className="text-[9px] uppercase font-bold text-slate-400">Jul</span>
                <span className="text-sm font-black text-slate-200 leading-none">10</span>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-200 truncate">Fechamento do Semestre</p>
                <p className="text-[10px] text-slate-500">Prazo final de consolidação</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}