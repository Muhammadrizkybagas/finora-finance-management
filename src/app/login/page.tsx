"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Toast from "@/components/ui/Toast";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "pemeriksaan akun gagal");
      }

      setToast({ message: "selamat datang kembali! mengalihkan...", type: "success" });
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6" data-aos="fade-up">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-md">
            F
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Halo Lagi!</h1>
          <p className="text-slate-500 text-sm">Masuk untuk melihat catatan keuangan kamu hari ini</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="mahasiswa@kampus.ac.id"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Kata Sandi</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Masukkan kata sandi"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-all shadow-md disabled:opacity-50"
          >
            {loading ? "Memeriksa data..." : "Masuk Akun"}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Belum punya akun?{" "}
          <Link href="/register" className="text-accent font-bold hover:underline">
            Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
}