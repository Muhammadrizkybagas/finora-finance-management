"use client";

import { useEffect, useState } from "react";
import { 
  Wallet, ArrowDownRight, ArrowUpRight, Plus, TrendingUp, Search, Bell, 
  Target, PieChart as PieChartIcon, Lightbulb, ChevronDown, Calendar, AlertCircle, Menu
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import AddTransactionModal from "@/components/dashboard/AddTransactionModal";
import OnboardingModal from "@/components/dashboard/OnboardingModal";
import SpendPredictModal from "@/components/dashboard/SpendPredictModal";
import Sidebar from "@/components/dashboard/Sidebar";
import { calculateSmartBudget } from "@/lib/aiBudgeting";

export default function DashboardPage() {
  const [balance, setBalance] = useState("0");
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [transactionsList, setTransactionsList] = useState<any[]>([]);
  const [predictData, setPredictData] = useState<any>(null);
  const [userName, setUserName] = useState("Teman Finora");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isPredictOpen, setIsPredictOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState({ monthName: "", year: 2026, remainingDays: 30 });

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/transactions");
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance || "0");
        const list = data.transactions || [];
        setTransactionsList(list);

        if (data.userName) {
          setUserName(data.userName);
        } else if (data.email) {
          setUserName(data.email.split("@")[0]);
        }

        let totalInc = 0;
        let totalExp = 0;
        list.forEach((t: any) => {
          const val = parseFloat(t.amount);
          if (t.type === "income") totalInc += val;
          if (t.type === "expense") totalExp += val;
        });

        setIncome(totalInc);
        setExpense(totalExp);

        if (list.length === 0) setIsOnboardingOpen(true);
      }

      const resPredict = await fetch("/api/predict");
      if (resPredict.ok) setPredictData(await resPredict.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const today = new Date();
    setCurrentDate({
      monthName: today.toLocaleDateString("id-ID", { month: "short" }),
      year: today.getFullYear(),
      remainingDays: new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() - today.getDate() + 1
    });
  }, []);

  let actualPrimer = 0, actualSekunder = 0, actualTersier = 0;
  
  const trendData = [
    { name: 'Mg 1', Pemasukan: 0, Pengeluaran: 0 },
    { name: 'Mg 2', Pemasukan: 0, Pengeluaran: 0 },
    { name: 'Mg 3', Pemasukan: 0, Pengeluaran: 0 },
    { name: 'Mg 4', Pemasukan: 0, Pengeluaran: 0 },
  ];

  transactionsList.forEach((t) => {
    const amt = parseFloat(t.amount);
    if (t.type === "expense") {
      const noteLower = (t.notes || "").toLowerCase();
      if (noteLower.includes("makan") || noteLower.includes("kos") || noteLower.includes("ukt")) actualPrimer += amt;
      else if (noteLower.includes("kuota") || noteLower.includes("buku") || noteLower.includes("sewa")) actualSekunder += amt;
      else actualTersier += amt;
    }

    const day = new Date(t.createdAt).getDate();
    const weekIdx = Math.min(Math.floor((day - 1) / 7), 3);
    if (t.type === 'income') trendData[weekIdx].Pemasukan += amt;
    else trendData[weekIdx].Pengeluaran += amt;
  });

  const smartBudget = calculateSmartBudget(income, { primer: actualPrimer, sekunder: actualSekunder, tersier: actualTersier });

  let healthScore = 100, healthStatus = "Kondisi Sehat", healthColor = "border-[#FFBA08] text-[#FFBA08]";
  
  if (income === 0) {
    healthScore = 0; healthStatus = "Belum Ada Data"; healthColor = "border-slate-400 text-slate-400";
  } else {
    if (expense > income) healthScore -= 40;
    if (actualPrimer / income > 0.6) healthScore -= 15;
    if (actualTersier > smartBudget.tersierMax) healthScore -= 15;
    if ((income - expense) / income >= 0.2) healthScore = Math.min(100, healthScore + 10);

    if (healthScore >= 80) { healthStatus = "Sangat Optimal"; healthColor = "border-emerald-400 text-emerald-400"; }
    else if (healthScore >= 60) { healthStatus = "Cukup Stabil"; healthColor = "border-[#FFBA08] text-[#FFBA08]"; }
    else if (healthScore >= 40) { healthStatus = "Perlu Penyesuaian"; healthColor = "border-orange-400 text-orange-400"; }
    else { healthStatus = "Defisit Anggaran"; healthColor = "border-rose-500 text-rose-500"; }
  }

  const safeDailySpend = (income - expense) > 0 ? Math.round((income - expense) / currentDate.remainingDays) : 0;

  const categoryData = [
    { name: 'Primer', value: actualPrimer, color: '#6A040F' },
    { name: 'Sekunder', value: actualSekunder, color: '#DC2F02' },
    { name: 'Tersier', value: actualTersier, color: '#FFBA08' },
  ].filter(d => d.value > 0);

  const userInitials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden text-slate-800 relative">
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchDashboardData} />
      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} onOpenAddTransaction={() => setIsModalOpen(true)} />
      <SpendPredictModal isOpen={isPredictOpen} onClose={() => setIsPredictOpen(false)} />

      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
        setIsPredictOpen={setIsPredictOpen}
        healthScore={healthScore}
        healthStatus={healthStatus}
        healthColor={healthColor}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button className="lg:hidden p-2 -ml-2 text-slate-600 rounded-lg hover:bg-slate-100" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="flex-1 max-w-lg relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Cari transaksi cepat..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <button className="relative text-slate-500 hover:text-slate-700 hidden sm:block"><Bell size={20} /></button>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-[#6A040F] text-white flex items-center justify-center font-bold text-sm shrink-0">
                {userInitials || "TF"}
              </div>
              <div className="hidden sm:block text-sm">
                <p className="font-bold text-slate-900 leading-tight">{userName}</p>
                <p className="text-xs text-slate-500">Pengguna Finora</p>
              </div>
              <ChevronDown size={16} className="text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                  Selamat datang, {userName} ✨
                </h1>
                <p className="text-slate-500 text-sm mt-1">Berikut adalah ringkasan performa finansial Anda bulan ini.</p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm">
                  <Calendar size={16} /> {currentDate.monthName} {currentDate.year}
                </button>
                <button onClick={() => setIsModalOpen(true)} className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 bg-[#6A040F] hover:bg-[#5d0017] transition-colors rounded-xl text-sm font-bold text-white shadow-sm">
                  <Plus size={16} /> Catat Transaksi
                </button>
              </div>
            </div>

            {/* SpendPredict */}
            <div className="bg-[#6A040F] rounded-2xl p-6 sm:p-7 shadow-md text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-bl-full pointer-events-none"></div>
              <div className="space-y-2 relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-full text-[11px] font-bold border border-white/10">
                  <TrendingUp size={14} /> AI SpendPredict Engine
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold">Proyeksi Pengeluaran Bulan Depan</h2>
                <p className="text-xs sm:text-sm text-white/80 max-w-xl">
                  Berdasarkan pola transaksi historis Anda, sistem memproyeksikan estimasi kebutuhan pengeluaran untuk periode berikutnya:
                </p>
              </div>
              <div className="bg-white/10 p-5 rounded-2xl border border-white/20 text-center md:text-right min-w-[220px] relative z-10 w-full md:w-auto">
                <p className="text-xs text-white/70">Estimasi Total</p>
                <p className="text-3xl font-extrabold text-amber-300 mt-1">
                  Rp {predictData ? predictData.predictedNextMonth.toLocaleString("id-ID") : "..."}
                </p>
                <button onClick={() => setIsPredictOpen(true)} className="mt-3 w-full py-2 bg-white text-[#6A040F] hover:bg-slate-100 transition-colors rounded-xl text-xs font-bold shadow-sm">
                  Lihat Detail Analisis →
                </button>
              </div>
            </div>

            {/* 3 Kartu Ringkasan Keuangan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#6A040F] flex items-center justify-center mb-3"><Wallet size={20} /></div>
                <p className="text-xs font-medium text-slate-500">Saldo Dompet Utama</p>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">Rp {parseFloat(balance).toLocaleString("id-ID")}</h3>
              </div>
              
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3"><ArrowDownRight size={20} /></div>
                <p className="text-xs font-medium text-slate-500">Total Pemasukan</p>
                <h3 className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">Rp {income.toLocaleString("id-ID")}</h3>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3"><ArrowUpRight size={20} /></div>
                <p className="text-xs font-medium text-slate-500">Total Pengeluaran</p>
                <h3 className="text-xl sm:text-2xl font-bold text-rose-600 mt-1">Rp {expense.toLocaleString("id-ID")}</h3>
              </div>
            </div>

            {/* Grid Grafik */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm min-w-0">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-bold text-slate-900 flex items-center gap-2"><TrendingUp size={18} className="text-[#6A040F]"/> Tren Keuangan Bulan Ini</h2>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#059669" stopOpacity={0.1}/><stop offset="95%" stopColor="#059669" stopOpacity={0}/></linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6A040F" stopOpacity={0.1}/><stop offset="95%" stopColor="#6A040F" stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `Rp${value/1000}k`} />
                      <Tooltip formatter={(value: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(value))} />
                      <Area type="monotone" dataKey="Pemasukan" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                      <Area type="monotone" dataKey="Pengeluaran" stroke="#6A040F" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col min-w-0">
                <h2 className="font-bold text-slate-900 flex items-center gap-2 mb-2"><PieChartIcon size={18} className="text-[#6A040F]"/> Porsi Kategori</h2>
                {expense === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-sm text-slate-400">Belum ada pengeluaran</div>
                ) : (
                  <div className="h-[200px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip formatter={(value: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(value))} />
                        <Legend layout="vertical" verticalAlign="middle" align="center" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="text-center mt-2">
                  <p className="text-xs text-slate-500">Total Keluar</p>
                  <p className="font-bold text-lg text-slate-900">Rp {expense.toLocaleString("id-ID")}</p>
                </div>
              </div>
            </div>

            {/* Grid Bawah: Wawasan & Alokasi dengan Copywriting Profesional */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
              
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2"><Lightbulb size={16} className="text-amber-500"/> Wawasan Finansial AI</h3>
                </div>
                <div className="space-y-3">
                  {expense > income && income > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-rose-50 rounded-xl border border-rose-100">
                      <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-700 leading-relaxed">Pengeluaran Anda saat ini melebihi total pemasukan. Disarankan untuk meninjau kembali alokasi pengeluaran tersier.</p>
                    </div>
                  )}
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <Target size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Batas aman alokasi pengeluaran harian Anda adalah <span className="font-bold">Rp {safeDailySpend.toLocaleString("id-ID")} / hari</span> selama {currentDate.remainingDays} hari ke depan.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">Rekomendasi Alokasi Budget</h2>
                  <span className="text-[10px] font-bold text-primary bg-rose-50 px-2 py-1 rounded-md">Smart AI</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-slate-600 font-medium">Primer (Kebutuhan Pokok) ({smartBudget.primerPercent}%)</span>
                    <span className="font-bold">Rp {smartBudget.primerMax.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-slate-600 font-medium">Sekunder (Pendukung) ({smartBudget.sekunderPercent}%)</span>
                    <span className="font-bold">Rp {smartBudget.sekunderMax.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-slate-600 font-medium">Tersier (Gaya Hidup/Hobi) ({smartBudget.tersierPercent}%)</span>
                    <span className="font-bold">Rp {smartBudget.tersierMax.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}