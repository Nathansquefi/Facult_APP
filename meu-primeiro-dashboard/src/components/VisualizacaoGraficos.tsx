import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

// Contratos de tipos para integração
interface Cadeira {
  id: string;
  nome: string;
  tipoMedia: 'aritmetica' | 'harmonica';
  notas: number[];
}

interface VisualizacaoGraficosProps {
  cadeiras: Cadeira[];
}

// Funções de apoio matemático
const calcularMediaArray = (notas: number[], tipo: 'aritmetica' | 'harmonica'): number => {
  if (notas.length === 0) return 0;
  if (tipo === 'aritmetica') {
    return notas.reduce((acc, n) => acc + n, 0) / notas.length;
  }
  if (notas.some(n => n === 0)) return 0;
  return notas.length / notas.reduce((acc, n) => acc + (1 / n), 0);
};

export default function VisualizacaoGraficos({ cadeiras }: VisualizacaoGraficosProps) {
  
  // 1. CALCULADORA DE KPIS REAIS (Métricas do Semestre)
  const metricas = useMemo(() => {
    if (cadeiras.length === 0) return { gpa: '0.00', acimaMeta: 0, total: 0, acimaCount: 0 };
    
    const medias = cadeiras.map(c => calcularMediaArray(c.notas, c.tipoMedia));
    const somaGpa = medias.reduce((acc, m) => acc + m, 0);
    const gpaCalculado = somaGpa / cadeiras.length;
    
    const acimametaCount = medias.filter(m => m >= 6.0).length;
    const porcentagemAcima = Math.round((acimametaCount / cadeiras.length) * 100);

    return {
      gpa: gpaCalculado.toFixed(2),
      acimaMeta: porcentagemAcima,
      total: cadeiras.length,
      acimaCount: acimametaCount
    };
  }, [cadeiras]);

  // 2. MOCK DATA PARA O HISTÓRICO SEMESTRAL (Até integrarmos com backend multi-semestre)
  const dadosEvolucao = [
    { name: '2022.1', 'Seu GPA': 7.20, 'Média Curso': 6.80 },
    { name: '2022.2', 'Seu GPA': 7.80, 'Média Curso': 6.90 },
    { name: '2023.1', 'Seu GPA': 8.10, 'Média Curso': 7.10 },
    { name: '2023.2', 'Seu GPA': 8.40, 'Média Curso': 7.00 },
    { name: 'HOJE', 'Seu GPA': parseFloat(metricas.gpa), 'Média Curso': 7.20 },
  ];

  return (
    <div className="space-y-6">
      
      {/* SEÇÃO: CARDS DE KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card GPA */}
        <div className="glass-card p-6 rounded-xl flex flex-col gap-2 relative overflow-hidden group">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Média Geral (GPA)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-cyan-400">{metricas.gpa}</span>
            <span className="text-xs text-emerald-400 flex items-center font-bold">▲ +0.4</span>
          </div>
        </div>

        {/* Card Acima da Meta */}
        <div className="glass-card p-6 rounded-xl flex flex-col gap-2 relative overflow-hidden group">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Acima da Meta</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-100">{metricas.acimaMeta}%</span>
            <span className="text-xs text-slate-400">{metricas.acimaCount} de {metricas.total} mat.</span>
          </div>
        </div>

        {/* Card Frequência */}
        <div className="glass-card p-6 rounded-xl flex flex-col gap-2 relative overflow-hidden group">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Frequência Média</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-100">94.2%</span>
            <span className="text-xs text-emerald-400 font-bold">Estável</span>
          </div>
        </div>

        {/* Card Projeção */}
        <div className="glass-card p-6 rounded-xl flex flex-col gap-2 relative overflow-hidden group border-l-4 border-cyan-400">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Projeção Final</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-cyan-300">{(parseFloat(metricas.gpa) * 1.04).toFixed(2)}</span>
            <span className="text-xs text-cyan-400 font-bold">ALVO</span>
          </div>
        </div>
      </div>

      {/* BENTO GRID: GRÁFICO E IA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Bloco do Gráfico de Evolução (8 Colunas) */}
        <div className="lg:col-span-8 glass-card rounded-xl p-6 flex flex-col h-[400px]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Evolução do GPA</h3>
              <p className="text-xs text-slate-400">Histórico semestral comparado à média do curso</p>
            </div>
            <div className="flex gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span> Seu GPA
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block"></span> Média Curso
              </span>
            </div>
          </div>

          <div className="flex-1 min-h-0 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dadosEvolucao} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e2b3c" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 10]} stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#122131', border: '1px solid #3b494c', borderRadius: '8px', color: '#fff' }} />
                <ReferenceLine y={6.0} stroke="#ff4b4b" strokeDasharray="3 3" label={{ value: 'META 6.0', fill: '#ff4b4b', fontSize: 10, position: 'top' }} />
                <Area type="monotone" dataKey="Média Curso" stroke="#64748b" strokeWidth={1.5} fill="none" dot={false} />
                <Area type="monotone" dataKey="Seu GPA" stroke="#00e5ff" strokeWidth={3} fillOpacity={1} fill="url(#colorGpa)" dot={{ r: 4, fill: '#00e5ff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bloco do Insight de IA (4 Colunas) */}
        <div className="lg:col-span-4 glass-card rounded-xl overflow-hidden flex flex-col bg-gradient-to-br from-[#1c2b3c] to-[#051424] border-none relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
          <div className="p-6 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 text-cyan-400">
                <span className="material-symbols-outlined">auto_awesome</span>
                <h3 className="font-bold text-lg">Insight da IA</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-cyan-400/10 border border-cyan-400/20 rounded-lg">
                  <p className="text-sm font-bold text-cyan-400 mb-1">Otimização Detectada</p>
                  <p className="text-xs leading-relaxed text-slate-300">
                    Seu GPA atual está em <span className="font-bold text-cyan-300">{metricas.gpa}</span>. 
                    {cadeiras.length > 0 ? " O algoritmo de harmônica indica estabilidade em matérias de exatas, mantenha o ritmo." : " Cadastre disciplinas na aba dedicada para calibrar o motor de inteligência analítica."}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sugestões Estratégicas</p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex gap-2"><span className="text-cyan-400">1.</span> Focar em atividades de peso elevado para proteger o GPA.</li>
                    <li className="flex gap-2"><span className="text-cyan-400">2.</span> Evitar notas zero em cadeiras sob regime harmônico.</li>
                  </ul>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 py-2.5 text-cyan-400 font-bold text-xs border border-cyan-400/30 rounded-lg hover:bg-cyan-400/10 transition-colors cursor-pointer">
              GERAR RELATÓRIO COMPLETO
            </button>
          </div>
        </div>

      </div>

      {/* SEÇÃO: HISTOGRAMA DE DISCIPLINAS INDIVIDUAIS */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-slate-100 mb-6">Comparativo das Disciplinas do Semestre</h3>
        
        {cadeiras.length === 0 ? (
          <p className="text-sm text-slate-400 italic">Nenhuma disciplina cadastrada para comparação.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cadeiras.map((cad) => {
              const media = calcularMediaArray(cad.notas, cad.tipoMedia);
              const isAbaixoMeta = media < 6.0;

              return (
                <div key={cad.id} className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="truncate max-w-[150px]">{cad.nome}</span>
                    <span className={isAbaixoMeta ? 'text-rose-400 font-bold' : 'text-cyan-400 font-bold'}>
                      {media.toFixed(2)}
                    </span>
                  </div>

                  {/* Micro Gráfico de Barras Puro Tailwind */}
                  <div className="h-20 flex items-end gap-1 bg-[#0d1c2d] rounded-lg p-2 relative overflow-hidden">
                    {/* Linha Tracejada de Meta */}
                    <div className="absolute top-[40%] left-0 w-full border-t border-dashed border-rose-500/30 z-0"></div>
                    
                    {/* Renderização dinâmica de barras com base nas notas reais da cadeira */}
                    {cad.notas.map((nota, nIdx) => {
                      const alturaPorcentagem = Math.min(100, Math.max(10, nota * 10));
                      return (
                        <div 
                          key={nIdx}
                          style={{ height: `${alturaPorcentagem}%` }}
                          className={`w-full rounded-t-sm z-10 transition-all ${
                            isAbaixoMeta ? 'bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.3)]' : 'bg-cyan-400/80 shadow-[0_0_8px_rgba(0,229,255,0.3)]'
                          }`}
                          title={`Avaliação ${nIdx + 1}: ${nota}`}
                        />
                      );
                    })}
                  </div>
                  
                  <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                    {cad.notas.map((_, idx) => <span key={idx}>A{idx+1}</span>)}
                    <span>MÉDIA</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}