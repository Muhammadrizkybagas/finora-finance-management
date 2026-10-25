import { 
  LayoutDashboard, ArrowRightLeft, Target, PieChart as PieChartIcon, 
  Lightbulb, TrendingUp, Settings, Sparkles, X, PiggyBank 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
  setIsPredictOpen: (val: boolean) => void;
  healthScore: number;
  healthStatus: string;
  healthColor: string;
}

export default function Sidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  setIsPredictOpen,
  healthScore,
  healthStatus,
  healthColor,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#6A040F] text-white flex flex-col h-full shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-lg">F</div>
            <span className="text-2xl font-bold tracking-tight">Finora</span>
          </div>
          <button className="lg:hidden text-white/70 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto">
          <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === '/dashboard' ? 'bg-white/10' : 'text-white/70 hover:bg-white/5'}`}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/savings" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === '/savings' ? 'bg-white/10' : 'text-white/70 hover:bg-white/5'}`}>
            <PiggyBank size={18} /> Target & Tabungan
          </Link>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 rounded-xl font-medium transition-colors">
            <ArrowRightLeft size={18} /> Transaksi
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 rounded-xl font-medium transition-colors">
            <Target size={18} /> Budget
          </a>
          
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Lanjutan</div>
          <button onClick={() => { setIsPredictOpen(true); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 rounded-xl font-medium transition-colors">
            <TrendingUp size={18} /> SpendPredict
          </button>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 rounded-xl font-medium transition-colors">
            <Settings size={18} /> Pengaturan
          </a>
        </nav>

        <div className="p-6 shrink-0">
          <div className="bg-white/10 rounded-2xl p-4 flex flex-col items-center border border-white/5 text-center shadow-inner">
            <p className="text-xs font-medium text-white/80 mb-3">Financial Health</p>
            <div className={`relative w-20 h-20 rounded-full border-4 flex items-center justify-center ${healthColor}`}>
              <span className="text-xl font-bold text-white">{healthScore}<span className="text-xs font-normal text-white/70">/100</span></span>
            </div>
            <p className={`text-[11px] mt-2 font-bold flex items-center gap-1 ${healthColor.split(' ')[1]}`}>
              <Sparkles size={12}/> {healthStatus}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}