"use client";

import { useEffect, useState } from "react";
import { 
  PiggyBank, Plus, Target, Shield, Laptop, GraduationCap, 
  Car, Palmtree, Menu, CheckCircle2, ArrowUpRight, Wallet 
} from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";

export default function SavingsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState("");
  const [depositType, setDepositType] = useState<"virtual" | "finora">("virtual");
  
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("Shield");
  const [depositAmount, setDepositAmount] = useState("");

  const formatRupiah = (value: string | number) => {
    if (!value) return "";
    const numberString = value.toString().replace(/[^,\d]/g, "");
    const split = numberString.split(",");
    let sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    let ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      let separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }

    return split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
  };

  const fetchGoals = async () => {
    try {
      const res = await fetch("/api/savings");
      if (res.ok) {
        const data = await res.json();
        setGoals(data.goals || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/savings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, targetAmount: parseFloat(targetAmount), categoryIcon }),
      });
      if (res.ok) {
        setTitle("");
        setTargetAmount("");
        setIsModalOpen(false);
        fetchGoals();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/savings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedGoalId, addAmount: parseFloat(depositAmount), type: depositType }),
      });
      if (res.ok) {
        setDepositAmount("");
        setSelectedGoalId("");
        setIsDepositModalOpen(false);
        fetchGoals();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Shield": return <Shield size={22} className="text-[#6A040F]" />;
      case "Laptop": return <Laptop size={22} className="text-[#6A040F]" />;
      case "GraduationCap": return <GraduationCap size={22} className="text-[#6A040F]" />;
      case "Car": return <Car size={22} className="text-[#6A040F]" />;
      case "Palmtree": return <Palmtree size={22} className="text-[#6A040F]" />;
      default: return <Target size={22} className="text-[#6A040F]" />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden text-slate-800 relative">
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
        setIsPredictOpen={() => {}}
        healthScore={85}
        healthStatus="Sangat Optimal"
        healthColor="border-emerald-400 text-emerald-400"
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <button className="lg:hidden p-2 -ml-2 text-slate-600 rounded-lg hover:bg-slate-100" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="font-extrabold text-lg text-slate-900 tracking-tight">Target & Pos Tabungan</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#6A040F] text-white flex items-center justify-center font-bold text-sm shadow-sm">BR</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto space-y-6">
            
            <div className="bg-gradient-to-r from-[#6A040F] to-[#9d0208] rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 bg-white/25 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                  <PiggyBank size={14} /> Alokasi Finansial Fleksibel
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Rencanakan Masa Depanmu</h2>
                <p className="text-white/80 text-xs sm:text-sm max-w-xl">
                  Sisihkan dana secara berkala untuk pos darurat, investasi perangkat, maupun kebutuhan akademik tanpa tercampur uang harian.
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="flex items-center gap-2 px-5 py-3 bg-white text-[#6A040F] hover:bg-slate-100 rounded-xl text-sm font-bold shadow-sm transition-all shrink-0"
              >
                <Plus size={18} /> Buat Target Baru
              </button>
            </div>

            {goals.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm space-y-3">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-[#6A040F]">
                  <PiggyBank size={32} />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Belum Ada Target Finansial</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Mulai buat pos alokasi pertama Anda agar pengelolaan dana darurat dan kebutuhan penting menjadi lebih terstruktur.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {goals.map((goal) => {
                  const percentage = Math.min(Math.round((parseFloat(goal.currentAmount) / parseFloat(goal.targetAmount)) * 100), 100);
                  const isCompleted = percentage >= 100;

                  return (
                    <div key={goal.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5 relative overflow-hidden">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100/60 shadow-inner">
                            {renderIcon(goal.categoryIcon)}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-base">{goal.title}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Pos Alokasi Aktif</p>
                          </div>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${isCompleted ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-[#6A040F] border border-rose-100'}`}>
                          {isCompleted && <CheckCircle2 size={12} />} {percentage}% Tercapai
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-bold text-slate-900">Rp {parseFloat(goal.currentAmount).toLocaleString("id-ID")}</span>
                          <span className="text-xs text-slate-400 font-medium">Target: Rp {parseFloat(goal.targetAmount).toLocaleString("id-ID")}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5">
                          <div className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-[#6A040F]'}`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>

                      {/* disabled button */}
                      {!isCompleted ? (
                        <button 
                          onClick={() => { setSelectedGoalId(goal.id); setIsDepositModalOpen(true); }}
                          className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200/80 transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                          <Plus size={16} /> Setor Dana Tabungan
                        </button>
                      ) : (
                        <div className="w-full py-3 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-100 flex items-center justify-center gap-2">
                          <CheckCircle2 size={16} /> Target Selesai Terkumpul! 
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </main>

      {/* modal add target */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 animate-fade-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="font-extrabold text-lg text-slate-900">Buat Pos Target Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Nama Pos / Kebutuhan</label>
                <input 
                  type="text" 
                  required 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Contoh: Dana Darurat / Laptop Baru" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Target Nominal (Rp)</label>
                <input 
                  type="text" 
                  required 
                  value={targetAmount ? formatRupiah(targetAmount) : ""} 
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/[^0-9]/g, "");
                    setTargetAmount(rawValue);
                  }} 
                  placeholder="Contoh: 1.500.000" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Pilih Ikon Kategori</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: "Shield", icon: <Shield size={20} /> },
                    { id: "Laptop", icon: <Laptop size={20} /> },
                    { id: "GraduationCap", icon: <GraduationCap size={20} /> },
                    { id: "Car", icon: <Car size={20} /> },
                    { id: "Palmtree", icon: <Palmtree size={20} /> },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCategoryIcon(item.id)}
                      className={`flex items-center justify-center p-3 rounded-xl border transition-all ${categoryIcon === item.id ? 'border-[#6A040F] bg-rose-50 text-[#6A040F]' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Batal</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-[#6A040F] hover:bg-[#5d0017] text-white text-sm font-bold shadow-sm">Simpan Target</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* modal setor dana */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 animate-fade-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="font-extrabold text-lg text-slate-900">Pilih Metode Setoran Dana</h3>
              <button onClick={() => setIsDepositModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <form onSubmit={handleDeposit} className="space-y-5">
              {/* methode button */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDepositType("virtual")}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${depositType === "virtual" ? 'border-[#6A040F] bg-rose-50/60 ring-2 ring-[#6A040F]/10' : 'border-slate-200 hover:bg-slate-50'}`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#6A040F] mb-2">
                    <PiggyBank size={18} />
                  </div>
                  <p className="font-bold text-xs text-slate-900">Setor Virtual</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Tambah tabungan mandiri</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDepositType("finora")}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${depositType === "finora" ? 'border-[#6A040F] bg-rose-50/60 ring-2 ring-[#6A040F]/10' : 'border-slate-200 hover:bg-slate-50'}`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600 mb-2">
                    <Wallet size={18} />
                  </div>
                  <p className="font-bold text-xs text-slate-900">Dari Pemasukan</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Alokasi dari saldo utama</p>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Nominal Setoran (Rp)</label>
                <input 
                  type="text" 
                  required 
                  value={depositAmount ? formatRupiah(depositAmount) : ""} 
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/[^0-9]/g, "");
                    setDepositAmount(rawValue);
                  }} 
                  placeholder="Contoh: 100.000" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsDepositModalOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Batal</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-[#6A040F] hover:bg-[#5d0017] text-white text-sm font-bold shadow-sm">Konfirmasi Setoran</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}