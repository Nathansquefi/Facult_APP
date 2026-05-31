export default function TopBar() {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-[#051424]/80 backdrop-blur-md border-b border-[#3b494c] shadow-sm z-40 flex justify-between items-center px-6">
      <div className="flex items-center gap-4">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input 
            className="bg-[#0d1c2d] border border-[#3b494c] rounded-full py-1.5 pl-10 pr-4 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all w-64 text-sm" 
            placeholder="Buscar disciplina..." 
            type="text"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-xl">notifications</span>
        </button>
        <button className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-xl">help</span>
        </button>
        <div className="h-6 w-[1px] bg-[#3b494c]"></div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.6)]"></div>
          <span className="text-xs font-semibold text-slate-200">Online</span>
        </div>
      </div>
    </header>
  );
}