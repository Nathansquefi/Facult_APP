export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#051424] border-r border-[#3b494c] flex flex-col p-4 gap-2 z-50">
      <div className="mb-8 flex flex-col p-4">
        <h1 className="text-3xl text-cyan-400 font-bold tracking-tight">Facult</h1>
        <span className="text-sm text-slate-400 opacity-70">Portal Acadêmico</span>
      </div>
      
      <nav className="flex flex-col gap-2">
        <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-[#273647] hover:text-slate-100 rounded-lg transition-colors cursor-pointer active:scale-95">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-sm font-medium">Dashboard</span>
        </div>
        
        {/* Item Ativo */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#474746] text-slate-100 rounded-lg font-bold cursor-pointer active:scale-95 transition-transform">
          <span className="material-symbols-outlined">menu_book</span>
          <span className="text-sm">Disciplinas</span>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-[#273647] hover:text-slate-100 rounded-lg transition-colors cursor-pointer active:scale-95">
          <span className="material-symbols-outlined">bar_chart</span>
          <span className="text-sm font-medium">Gráficos</span>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-[#273647] hover:text-slate-100 rounded-lg transition-colors cursor-pointer active:scale-95">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-sm font-medium">Configurações</span>
        </div>
      </nav>

      <div className="mt-auto p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-bold">
          AS
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-200">Nathan Squefi Pacheco</p>
          <p className="text-[10px] text-slate-400">Ciencia da Computação</p>
        </div>
      </div>
    </aside>
  );
}