import React, { useState, useEffect } from 'react';

// Contrato de uma atividade com peso individualizado
interface AtividadeConfig {
  nome: string;
  peso: number;
}
interface AtividadeConfig {
  nome: string;
  peso: number;
}

interface Cadeira {
  id: string;
  nome: string;
  tipoMedia: 'aritmetica' | 'harmonica';
  notas: number[];
}

interface FormCadastroProps {
  onAdicionarCadeira: (novaCadeira: Cadeira) => void;
}

export default function FormCadastro({ onAdicionarCadeira }: FormCadastroProps) {
  const [nomeDisciplina, setNomeDisciplina] = useState('');
  const [codigo, setCodigo] = useState('');
  const [tipoMedia, setTipoMedia] = useState<'aritmetica' | 'harmonica'>('aritmetica');
  const [activityCount, setActivityCount] = useState(3);
  const [atividades, setAtividades] = useState<AtividadeConfig[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const baseWeight = Math.floor(100 / activityCount);
    const remainder = 100 % activityCount;
    const novasAtividades = Array.from({ length: activityCount }, (_, i) => ({
      nome: `Avaliação ${i + 1}`,
      peso: i === activityCount - 1 ? baseWeight + remainder : baseWeight
    }));
    setAtividades(novasAtividades);
  }, [activityCount]);

  const totalPesos = atividades.reduce((acc, curr) => acc + curr.peso, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeDisciplina.trim()) return alert("Digite o nome da disciplina!");
    if (totalPesos !== 100) return alert("A soma dos pesos deve ser exatamente 100%!");

    setIsSubmitting(true);
    
    setTimeout(() => {
      // 1. CRIA O OBJETO REAL DE ACORDO COM A ARQUITETURA DE MATÉRIAS (Começa com notas zeradas)
      const novaCadeira: Cadeira = {
        id: Date.now().toString(),
        nome: nomeDisciplina,
        tipoMedia,
        notas: Array(activityCount).fill(0) // Inicializa as atividades zeradas para você editar na Home
      };

      // 2. DISPARA O SALVAMENTO NO LOCALSTORAGE ATRAVÉS DO APP.TSX
      onAdicionarCadeira(novaCadeira);

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setNomeDisciplina('');
      setCodigo('');
      
      setTimeout(() => setSubmitSuccess(false), 2000);
    }, 1000);
  };

  const handleNomeAtividadeChange = (index: number, novoNome: string) => {
    const atualizadas = [...atividades];
    atualizadas[index].nome = novoNome;
    setAtividades(atualizadas);
  };

  const handlePesoChange = (index: number, novoPeso: string) => {
    const atualizadas = [...atividades];
    atualizadas[index].peso = parseInt(novoPeso) || 0;
    setAtividades(atualizadas);
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* SEÇÃO: IDENTIFICAÇÃO */}
      <section className="glass-card rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-cyan-400">identity_platform</span>
          <h3 className="text-xl font-semibold text-slate-100">Identificação</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400 tracking-wider">NOME DA DISCIPLINA</label>
            <input 
              type="text"
              value={nomeDisciplina}
              onChange={(e) => setNomeDisciplina(e.target.value)}
              placeholder="Ex: Cálculo I, Redes de Computadores..." 
              className="bg-[#010f1f] border border-[#3b494c] rounded-lg p-3 text-slate-100 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all outline-none text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400 tracking-wider">CÓDIGO (OPCIONAL)</label>
            <input 
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ex: MAT001" 
              className="bg-[#010f1f] border border-[#3b494c] rounded-lg p-3 text-slate-100 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all outline-none text-sm"
            />
          </div>
        </div>
      </section>

      {/* SEÇÃO: REGRA DE CÁLCULO */}
      <section className="glass-card rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-cyan-400">calculate</span>
          <h3 className="text-xl font-semibold text-slate-100">Regra de Cálculo</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-400 tracking-wider">MÉTODO DE MÉDIA</label>
              <div className="flex p-1 bg-[#010f1f] border border-[#3b494c] rounded-xl">
                <button 
                  type="button"
                  onClick={() => setTipoMedia('aritmetica')}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${tipoMedia === 'aritmetica' ? 'bg-[#474746] text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  ARITMÉTICA
                </button>
                <button 
                  type="button"
                  onClick={() => setTipoMedia('harmonica')}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${tipoMedia === 'harmonica' ? 'bg-[#474746] text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  HARMÔNICA
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-400 tracking-wider">NÚMERO DE ATIVIDADES / PROVAS</label>
              <div className="flex items-center gap-4">
                <button 
                  type="button"
                  onClick={() => setActivityCount(prev => Math.max(1, prev - 1))}
                  className="w-12 h-12 rounded-lg bg-[#1c2b3c] border border-[#3b494c] flex items-center justify-center text-slate-100 hover:bg-cyan-400 hover:text-[#001f24] transition-colors"
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <input 
                  type="number" 
                  readOnly 
                  value={activityCount}
                  className="bg-[#010f1f] border border-[#3b494c] rounded-lg p-3 text-center text-slate-100 w-full font-bold text-lg outline-none"
                />
                <button 
                  type="button"
                  onClick={() => setActivityCount(prev => Math.min(10, prev + 1))}
                  className="w-12 h-12 rounded-lg bg-[#1c2b3c] border border-[#3b494c] flex items-center justify-center text-slate-100 hover:bg-cyan-400 hover:text-[#001f24] transition-colors"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-cyan-400/5 border border-cyan-400/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-cyan-400">info</span>
              <div className="space-y-1">
                <p className="text-xs font-bold text-cyan-400 tracking-wider">DICA DO SISTEMA</p>
                <p className="text-sm text-slate-400 leading-relaxed">
                  A média <strong className="text-cyan-300">Aritmética</strong> é a soma dividida pela quantidade. A média <strong className="text-cyan-300">Harmônica</strong> é comum em algoritmos complexos e tende a penalizar notas muito baixas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: PESOS DINÂMICOS */}
      <section className="glass-card rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-400">list_alt</span>
            <h3 className="text-xl font-semibold text-slate-100">Distribuição de Pesos</h3>
          </div>
          <div className="px-3 py-1 bg-[#1c2b3c] border border-[#3b494c] rounded-full flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">TOTAL:</span>
            <span className={`text-xs font-bold ${totalPesos !== 100 ? 'text-red-400' : 'text-cyan-400'}`}>
              {totalPesos}%
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {atividades.map((atv, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-[#0d1c2d]/40 rounded-lg border border-[#3b494c]/30 hover:border-cyan-400/40 transition-all">
              <div className="w-10 h-10 rounded-full bg-[#1c2b3c] flex items-center justify-center font-bold text-cyan-400 border border-[#3b494c]">
                {index + 1}
              </div>
              <div className="flex-1">
                <input 
                  type="text" 
                  value={atv.nome}
                  onChange={(e) => handleNomeAtividadeChange(index, e.target.value)}
                  className="bg-transparent border-none text-slate-100 text-sm focus:ring-0 w-full outline-none"
                />
              </div>
              <div className="flex items-center gap-2 w-32">
                <input 
                  type="number" 
                  value={atv.peso}
                  onChange={(e) => handlePesoChange(index, e.target.value)}
                  className="bg-[#010f1f] border border-[#3b494c] rounded p-1 text-center text-slate-100 w-full text-sm font-bold"
                />
                <span className="text-slate-400 text-xs font-bold">%</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOTÃO SUBMIT COM RENDERIZAÇÃO CONDICIONAL DE ESTADO */}
      <div className="flex justify-end pt-4">
        <button 
          type="submit"
          disabled={isSubmitting}
          className={`neon-btn neon-glow px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition-all active:scale-95 group text-sm cursor-pointer ${
            submitSuccess ? 'bg-emerald-500 text-slate-900' : 'bg-cyan-400 text-[#001f24]'
          }`}
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> 
              SALVANDO...
            </>
          ) : submitSuccess ? (
            <>
              <span className="material-symbols-outlined">check_circle</span> 
              SALVO COM SUCESSO!
            </>
          ) : (
            <>
              SALVAR MATÉRIA
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">send</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}