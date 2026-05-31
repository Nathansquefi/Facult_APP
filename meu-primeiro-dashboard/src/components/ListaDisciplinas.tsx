import { useState } from 'react';

interface Cadeira {
  id: string;
  nome: string;
  tipoMedia: 'aritmetica' | 'harmonica';
  notas: number[];
}

interface ListaDisciplinasProps {
  cadeiras: Cadeira[];
  onExcluirCadeira: (id: string) => void;
}

const calcularMediaFinal = (notas: number[], tipo: 'aritmetica' | 'harmonica'): number => {
  if (notas.length === 0) return 0;
  if (tipo === 'aritmetica') {
    return notas.reduce((acc, n) => acc + n, 0) / notas.length;
  }
  if (notas.some(n => n === 0)) return 0;
  return notas.length / notas.reduce((acc, n) => acc + (1 / n), 0);
};

const obterLetraEColor = (nota: number) => {
  if (nota < 6.0) return { letra: 'D', cor: 'text-rose-400 bg-rose-500/10 border-rose-500/20', barra: 'bg-rose-500' };
  if (nota <= 7.5) return { letra: 'C', cor: 'text-amber-400 bg-amber-500/10 border-amber-500/20', barra: 'bg-amber-400' };
  if (nota <= 9.0) return { letra: 'B', cor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', barra: 'bg-cyan-400' };
  return { letra: 'A', cor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', barra: 'bg-emerald-400' };
};

export default function ListaDisciplinas({ cadeiras, onExcluirCadeira }: ListaDisciplinasProps) {
  // ESTADO REATIVO DE LAYOUT SUBSTUINDO O DOM DO JAVASCRIPT PURO
  const [visualizacao, setVisualizacao] = useState<'grid' | 'lista'>('grid');

  return (
    <div className="space-y-6 mt-12 border-t border-[#3b494c]/40 pt-8">
      
      {/* CABEÇALHO E CONTROLES ALTERNADORES */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-100">Disciplinas Matriculadas</h3>
          <p className="text-xs text-slate-400 mt-0.5">{cadeiras.length} matérias em andamento neste período</p>
        </div>

        <div className="flex items-center gap-2 bg-[#0d1c2d] p-1 rounded-lg border border-[#3b494c]">
          <button 
            onClick={() => setVisualizacao('grid')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              visualizacao === 'grid' ? 'bg-cyan-400 text-[#001f24] font-bold' : 'text-slate-400 hover:bg-[#273647]'
            }`}
          >
            <span className="material-symbols-outlined text-base">grid_view</span> Grid
          </button>
          <button 
            onClick={() => setVisualizacao('lista')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              visualizacao === 'lista' ? 'bg-cyan-400 text-[#001f24] font-bold' : 'text-slate-400 hover:bg-[#273647]'
            }`}
          >
            <span className="material-symbols-outlined text-base">list</span> Lista
          </button>
        </div>
      </div>

      {/* RENDERIZAÇÃO ADAPTÁVEL GRID OU LISTA COMPORTAMENTAL */}
      {cadeiras.length === 0 ? (
        <p className="text-sm text-slate-400 italic">Nenhuma disciplina cadastrada no momento. Preencha o configurador acima.</p>
      ) : (
        <div className={`grid gap-6 transition-all duration-300 ${
          visualizacao === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
        }`}>
          {cadeiras.map((cad) => {
            const media = calcularMediaFinal(cad.notas, cad.tipoMedia);
            const metaInfo = obterLetraEColor(media);
            
            return (
              <div 
                key={cad.id} 
                className={`glass-card rounded-xl p-6 flex gap-4 border border-[#3b494c]/30 hover:border-cyan-400/50 transition-all duration-300 relative group ${
                  visualizacao === 'grid' ? 'flex-col justify-between' : 'flex-row items-center justify-between'
                }`}
              >
                {/* BLOCO IDENTIFICADOR */}
                <div className={visualizacao === 'lista' ? 'w-1/3' : 'w-full'}>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider mb-2 inline-block ${
                    cad.tipoMedia === 'aritmetica' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/10 text-purple-400'
                  }`}>
                    {cad.tipoMedia === 'aritmetica' ? 'Aritmética' : 'Harmônica'}
                  </span>
                  <h4 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition-colors truncate">{cad.nome}</h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">Carga Acadêmica Ativa</p>
                </div>

                {/* BLOCO PROGRESSO E MÉDIA */}
                <div className={`flex flex-col gap-1.5 ${visualizacao === 'lista' ? 'w-1/3' : 'w-full mt-2'}`}>
                  <div className="flex justify-between items-end">
                    <span className="text-slate-400 text-xs font-semibold">Média Atual</span>
                    <div className={`flex items-center gap-0.5 font-bold ${media < 6 ? 'text-rose-400' : 'text-cyan-400'}`}>
                      <span className="text-lg font-bold">{media.toFixed(2)}</span>
                      <span className="material-symbols-outlined text-sm">{media >= 7.5 ? 'trending_up' : media >= 6 ? 'trending_flat' : 'trending_down'}</span>
                    </div>
                  </div>
                  {/* Barra de Progresso do Stitch Reativa */}
                  <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${metaInfo.barra}`}
                      style={{ width: `${Math.min(100, media * 10)}%` }}
                    />
                    {/* Linha Tracejada de Corte da Média 6.0 */}
                    <div className="absolute top-0 left-[60%] w-px h-full border-l border-dashed border-red-500/40 z-10" />
                  </div>
                </div>

                {/* BLOCO DIREITO / STATUS CONCEITO */}
                <div className={`flex items-center justify-between border-slate-700/30 ${visualizacao === 'lista' ? 'gap-6 pt-0' : 'border-t pt-4 mt-auto'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-base border ${metaInfo.cor}`}>
                      {metaInfo.letra}
                    </div>
                    {visualizacao === 'grid' && (
                      <span className="text-xs text-slate-400 font-medium truncate max-w-[120px]">Prof. Titular</span>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => onExcluirCadeira(cad.id)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer text-xs flex items-center gap-1 font-bold"
                  >
                    🗑️ Remover
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}