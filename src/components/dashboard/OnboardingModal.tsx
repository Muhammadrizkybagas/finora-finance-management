"use client";

import { useState } from "react";
import { Sparkles, Wallet, PlusCircle, ArrowRight, X } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddTransaction: () => void;
}

export default function OnboardingModal({
  isOpen,
  onClose,
  onOpenAddTransaction,
}: OnboardingModalProps) {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-up relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-all"
        >
          <X size={20} />
        </button>

        {step === 1 && (
          <div className="space-y-5 text-center pt-2">
            <div className="w-14 h-14 bg-amber-100 text-primary rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Sparkles size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-slate-900">
                Selamat Datang di Finora!
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-sm mx-auto">
                Asisten finansial cerdas yang bakal bantu kamu mengelola uang saku mahasiswa tanpa pusing.
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              Lanjut Panduan <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 text-center pt-2">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Wallet size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                Langkah Pertama: Catat Pemasukan
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Supaya AI Finora bisa meracik rekomendasi budget yang pas buat kamu, yuk masukkan dulu uang saku atau pemasukan pertamamu!
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenAddTransaction();
                }}
                className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <PlusCircle size={18} /> Catat Pemasukan Sekarang
              </button>
              <button
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-slate-600 py-2"
              >
                Nanti saja, mau lihat-lihat dulu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}