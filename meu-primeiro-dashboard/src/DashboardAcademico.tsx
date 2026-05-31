import { useState, useMemo,useEffect} from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
// 1. Tipagem da nossa Cadeira
interface Cadeira {
  id: string;
  nome: string;
  tipoMedia: 'aritmetica' | 'harmonica';
  notas: number[];
}
// Função para transformar a nota numérica no Conceito (A, B, C, D)
const obterConceito = (nota: number) => {
  if (nota < 6.0) {
    return { letra: 'D', cor: 'bg-rose-50 text-rose-600 border-rose-200' };
  }
  if (nota <= 7.5) {
    return { letra: 'C', cor: 'bg-amber-50 text-amber-600 border-amber-200' };
  }
  if (nota <= 9.0) {
    return { letra: 'B', cor: 'bg-blue-50 text-blue-600 border-blue-200' };
  }
  return { letra: 'A', cor: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
};

// 2. Funções de Cálculo Isoladas (Fora do Componente)
const calcularMediaAritmetica = (notas: number[]) => {
  if (notas.length === 0) return 0;
  const soma = notas.reduce((acc, nota) => acc + nota, 0);
  return soma / notas.length;
};

const calcularMediaHarmonica = (notas: number[]) => {
  if (notas.length === 0) return 0;
  if (notas.some(nota => nota === 0)) return 0; // Se tiver nota zero, a média harmônica vai a zero
  const somaInversos = notas.reduce((acc, nota) => acc + (1 / nota), 0);
  return notas.length / somaInversos;
};

export default function DashboardAcademico() {
  // 3. Estados do Formulário e da Lista de Cadeiras
  // Substitua a linha antiga do useState por esta estrutura inteligente:
const [cadeiras, setCadeiras] = useState<Cadeira[]>(() => {
  const dadosSalvos = localStorage.getItem('@meu-dashboard-academico:cadeiras');
  return dadosSalvos ? JSON.parse(dadosSalvos) : [];
});
  const [nome, setNome] = useState('');
  const [tipoMedia, setTipoMedia] = useState<'aritmetica' | 'harmonica'>('aritmetica');
  const [qtdAtividades, setQtdAtividades] = useState(2);
  const [notasInputs, setNotasInputs] = useState<string[]>(['', '']);
useEffect(() => {
    localStorage.setItem('@meu-dashboard-academico:cadeiras', JSON.stringify(cadeiras));
  }, [cadeiras]);
  // Prepara os dados das cadeiras formatados especialmente para o gráfico
  const dadosGrafico = useMemo(() => {
    return cadeiras.map(cad => {
      const mediaFinal = cad.tipoMedia === 'aritmetica'
        ? calcularMediaAritmetica(cad.notas)
        : calcularMediaHarmonica(cad.notas);

      return {
        name: cad.nome,
        "Média Atual": parseFloat(mediaFinal.toFixed(2))
      };
    });
  }, [cadeiras]);

  // Atualiza a quantidade de campos de nota quando você muda o número de atividades
  const handleQtdAtividadesChange = (qtd: number) => {
    setQtdAtividades(qtd);
    setNotasInputs(Array(qtd).fill(''));
  };

  const handleNotaChange = (index: number, valor: string) => {
    const novasNotas = [...notasInputs];
    novasNotas[index] = valor;
    setNotasInputs(novasNotas);
  };

  // Função para Excluir uma cadeira inteira
  const excluirCadeira = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta cadeira?')) {
      setCadeiras(cadeiras.filter(c => c.id !== id));
    }
  };

  // Função para Editar uma nota específica direto no Card
  const alterarNotaNoCard = (cadeiraId: string, notaIndex: number, novoValor: string) => {
    const valorNumerico = parseFloat(novoValor) || 0;

    // Mapeia a lista de cadeiras para alterar apenas a nota da cadeira certa
    const cadeirasAtualizadas = cadeiras.map(c => {
      if (c.id === cadeiraId) {
        const novasNotas = [...c.notas];
        novasNotas[notaIndex] = valorNumerico;
        return { ...c, notas: novasNotas };
      }
      return c;
    });

    setCadeiras(cadeirasAtualizadas);
  };

  // 4. Função para Salvar a Cadeira digitada
  const adicionarCadeira = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return alert('Digite o nome da cadeira!');
    // Converte as strings do input para números reais
    const notasNumeros = notasInputs.map(n => parseFloat(n) || 0);

    const novaCadeira: Cadeira = {
      id: Date.now().toString(),
      nome,
      tipoMedia,
      notas: notasNumeros
    };

    setCadeiras([...cadeiras, novaCadeira]);
    
    // Limpa o formulário para o próximo cadastro
    setNome('');
    setNotasInputs(Array(qtdAtividades).fill(''));
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-800 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">🎓 Meu Dashboard Acadêmico</h1>
        <p className="text-slate-500">Gerencie suas cadeiras, selecione os métodos de avaliação e acompanhe seus conceitos.</p>
      </header>

      {/* FORMULÁRIO DE CADASTRO */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 max-w-4xl">
        <h2 className="text-xl font-bold mb-4 text-slate-700">Registrar Nova Cadeira</h2>
        <form onSubmit={adicionarCadeira} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Nome da Cadeira</label>
            <input 
              type="text" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Cálculo I, Algebrá..." 
              className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Tipo de Média</label>
            <select 
              value={tipoMedia} 
              onChange={(e) => setTipoMedia(e.target.value as 'aritmetica' | 'harmonica')}
              className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white focus:outline-none focus:border-slate-500"
            >
              <option value="aritmetica">Média Aritmética</option>
              <option value="harmonica">Média Harmônica</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Nº de Atividades/Provas</label>
            <input 
              type="number" 
              min="1" 
              max="10"
              value={qtdAtividades}
              onChange={(e) => handleQtdAtividadesChange(parseInt(e.target.value) || 1)}
              className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:border-slate-500"
            />
          </div>

          {/* CAMPOS DINÂMICOS DE NOTAS */}
          <div className="col-span-1 md:col-span-3 border-t border-slate-100 pt-4 mt-2">
            <label className="block text-sm font-medium text-slate-600 mb-2">Digite as Notas Obtidas:</label>
            <div className="flex flex-wrap gap-3">
              {notasInputs.map((nota, index) => (
                <div key={index} className="w-24">
                  <span className="text-xs text-slate-400 block mb-1">Atividade {index + 1}</span>
                  <input 
                    type="number" 
                    step="0.1"
                    min="0"
                    max="10"
                    value={nota}
                    onChange={(e) => handleNotaChange(index, e.target.value)}
                    placeholder="0.0"
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm text-center focus:outline-none focus:border-slate-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-1 md:col-span-3 text-right mt-2">
            <button 
              type="submit" 
              className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-6 py-2 rounded-lg text-sm transition-colors cursor-pointer"
            >
              + Salvar Cadeira
            </button>
          </div>
        </form>
      </div>

      {/* LISTAGEM DAS CADEIRAS E CONCEITOS CALCULADOS */}
      <h2 className="text-2xl font-bold mb-4 text-slate-700">Minhas Matérias</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cadeiras.length === 0 ? (
          <p className="text-slate-400 italic col-span-full">Nenhuma cadeira registrada ainda. Use o formulário acima!</p>
        ) : (
          cadeiras.map((cad) => {
  // 1. Calcula a média em tempo real dependendo da escolha do usuário
  const mediaFinal = cad.tipoMedia === 'aritmetica' 
    ? calcularMediaAritmetica(cad.notas) 
    : calcularMediaHarmonica(cad.notas);

  return (
    <div key={cad.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between relative">
      
      <div>
        {/* CABEÇALHO DO CARD COM BOTÃO DE EXCLUIR */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg text-slate-800 truncate max-w-[150px]">{cad.nome}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider block mt-1 w-max ${
              cad.tipoMedia === 'aritmetica' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-purple-50 text-purple-600 border border-purple-100'
            }`}>
              {cad.tipoMedia === 'aritmetica' ? 'Aritmética' : 'Harmônica'}
            </span>
          </div>

          {/* Botão de Excluir Cadeira */}
          <button 
            onClick={() => excluirCadeira(cad.id)}
            className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer text-sm"
            title="Excluir Cadeira"
          >
            🗑️
          </button>
        </div>
        
        {/* SEÇÃO DE NOTAS EDITÁVEIS (INPUTS VIVOS) */}
        <div className="mb-4">
          <span className="text-xs font-semibold text-slate-500 block mb-2">Notas (Edite direto aqui):</span>
          <div className="flex flex-wrap gap-2">
            {cad.notas.map((nota, index) => (
              <div key={index} className="flex flex-col items-center">
                <span className="text-[10px] text-slate-400 mb-0.5">A{index + 1}</span>
                <input 
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={nota || ''}
                  onChange={(e) => alterarNotaNoCard(cad.id, index, e.target.value)}
                  className="w-12 border border-slate-200 rounded px-1 py-0.5 text-center text-sm font-medium text-slate-700 bg-slate-50 focus:bg-white focus:border-slate-400 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
        {/* SEÇÃO ANALÍTICA: GRÁFICO DE DESEMPENHO */}
{cadeiras.length > 0 && (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
    <div className="mb-4">
      <h2 className="text-xl font-bold text-slate-700">📊 Comparativo de Rendimento</h2>
      <p className="text-sm text-slate-400">Acompanhe suas médias em relação à linha de corte ideal ($6.0$).</p>
    </div>
    
    {/* Container Responsivo para o Gráfico não quebrar em telas menores */}
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dadosGrafico}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          {/* Grade de fundo suave */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          
          {/* Eixos do Gráfico */}
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
          <YAxis domain={[0, 10]} stroke="#94a3b8" fontSize={12} tickLine={false} />
          
          {/* Balão de informações ao passar o mouse */}
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', borderColor: '#e2e8f0' }}
            labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
          />
          
          {/* Linha de referência sênior: Mostra a meta mínima para aprovação */}
          <ReferenceLine y={6.0} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: 'Média 6.0', fill: '#f43f5e', fontSize: 10, position: 'top' }} />
          
          {/* A Barra de dados em si, com cor moderna e bordas arredondadas */}
          <Bar dataKey="Média Atual" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
)}
      {/* SEÇÃO DE MÉDIA E CONCEITO CONSOLIDADO */}
      <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 block uppercase font-medium">Média Final</span>
          <span className="text-2xl font-bold text-slate-800">{mediaFinal.toFixed(2)}</span>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block uppercase font-medium">Conceito Final</span>
          <span className={`text-lg font-black px-4 py-1 rounded-lg inline-block mt-1 border ${obterConceito(mediaFinal).cor}`}>
            {obterConceito(mediaFinal).letra}
          </span>
        </div>
      </div>

    </div>
  );
          })
        )}
      </div>
    </div>
  );
}