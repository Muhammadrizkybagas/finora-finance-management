"use client";

import { useEffect, useState } from "react";
import { X, TrendingUp, AlertCircle, Sparkles } from "lucide-react";

interface SpendPredictModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SpendPredictModal({ isOpen, onClose }: SpendPredictModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch("/api/predict")
        .then((res) => res.json())
        .then((resData) => {
          setData(resData);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-up relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header Modal */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-accent flex items-center justify-center font-bold text-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-slate-900">SpendPredict Engine</h3>
            <p className="text-xs text-slate-500">Estimasi Prediksi Pengeluaran Bulan Depan</p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm animate-pulse">
            Menghitung estimasi laju pengeluaran kamu...
          </div>
        ) : (
          <div className="space-y-5">
            {/* badge method */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-amber-50 rounded-xl border border-amber-100/80">
              <span className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                <Sparkles size={14} className="text-accent" /> Metode: {data?.method}
              </span>
              <span className="text-[11px] bg-amber-200/60 text-amber-900 font-bold px-2 py-0.5 rounded-md">
                {data?.statusLabel}
              </span>
            </div>

            {/* main card predict */}
            <div className="p-5 rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 text-white space-y-2 shadow-lg">
              <p className="text-xs text-slate-300">Estimasi Pengeluaran Bulan Depan ({data?.daysInNextMonth} Hari)</p>
              <div className="text-3xl font-extrabold text-amber-400">
                Rp {data?.predictedNextMonth?.toLocaleString("id-ID") || 0}
              </div>
            
              {data?.hasRange ? (
                <p className="text-xs text-slate-400">
                  Rentang estimasi: Rp {data?.lowerBound?.toLocaleString("id-ID")} – Rp {data?.upperBound?.toLocaleString("id-ID")}
                </p>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  *Estimasi titik awal. Rentang ketidakpastian belum ditampilkan karena riwayat transaksi masih terbatas.
                </p>
              )}
            </div>

            {/* bukti */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between font-medium">
                <span>Pengeluaran Bulan Ini (s.d. Hari ke-{data?.currentDay}):</span>
                <span className="font-bold text-slate-900">
                  Rp {data?.totalExpenseThisMonth?.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Laju Pengeluaran Rata-Rata:</span>
                <span className="font-bold text-slate-900">
                  Rp {Math.round(data?.dailyRate || 0).toLocaleString("id-ID")} / hari
                </span>
              </div>
            </div>

            {/* note */}
            <div className="flex gap-2.5 text-xs text-slate-500 bg-slate-100/70 p-3.5 rounded-xl">
              <AlertCircle size={18} className="shrink-0 text-slate-400 mt-0.5" />
              <p className="leading-relaxed">
                Pengujian model Lanjutan (ETS/SARIMA) baru dievaluasi setelah riwayat mencukupi.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}