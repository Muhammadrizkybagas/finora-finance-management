"use client";

import Link from "next/link";
import { 
  Moon, PlayCircle, TrendingUp, PieChart, AlertTriangle, 
  Star, Target, CheckCircle2, UserPlus, BarChart3, Trophy, 
  Home, Sparkles, ArrowRight
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

export default function LandingPage() {

  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 overflow-x-hidden selection:bg-[#6A040F] selection:text-white">
      
      {/* navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-[#6A040F] flex items-center justify-center font-bold text-white text-lg shadow-sm">
              F
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#6A040F]">Finora</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="/" className="text-[#6A040F] flex items-center gap-2 relative group">
              <Home size={16} /> Beranda
              <span className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-[#6A040F] rounded-full"></span>
            </Link>
            <Link href="#fitur" className="hover:text-[#6A040F] transition-colors">Fitur</Link>
            <Link href="#tentang" className="hover:text-[#6A040F] transition-colors">Tentang</Link>
            <Link href="#faq" className="hover:text-[#6A040F] transition-colors">FAQ</Link>
            <Link href="#kontak" className="hover:text-[#6A040F] transition-colors">Kontak</Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:flex text-slate-400 hover:text-amber-500 transition-colors">
              <Moon size={20} />
            </button>
            <Link href="/login" className="text-sm font-bold text-slate-700 hover:text-[#6A040F] transition-colors hidden sm:block">
              Masuk
            </Link>
            <Link href="/register" className="bg-[#6A040F] hover:bg-[#5d0017] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-rose-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
              Daftar Gratis <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* hero section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-8 min-h-[90vh]">
        
        {/* left content */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex-1 space-y-6 text-center lg:text-left z-10"
        >
          <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-[#6A040F] text-xs font-bold tracking-wide">
            <Sparkles size={14} className="text-amber-500" /> Personal Finance Assistant for Students
          </motion.div>
          
          <motion.h1 variants={fadeUpVariant} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight text-slate-900">
            Kelola Keuanganmu <br className="hidden lg:block"/> Lebih Cerdas dengan <br className="hidden lg:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6A040F] to-rose-600">Finora</span>
          </motion.h1>
          
          <motion.p variants={fadeUpVariant} className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Catat pengeluaran, pahami pola, dan prediksi keuanganmu dengan bantuan teknologi AI. Karena masa depan finansial berawal dari keputusan yang tepat hari ini.
          </motion.p>
          
          <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
            <Link href="/register" className="w-full sm:w-auto bg-[#6A040F] hover:bg-[#5d0017] text-white px-7 py-3.5 rounded-full text-sm font-bold shadow-xl shadow-rose-900/30 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              Mulai Sekarang <ArrowRight size={16} />
            </Link>
            <button className="w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2">
              <PlayCircle size={18} className="text-[#6A040F]" /> Lihat Demo
            </button>
          </motion.div>
          
          <motion.div variants={fadeUpVariant} className="pt-8 flex items-center justify-center lg:justify-start gap-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 shadow-sm"></div>
              <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-300 shadow-sm"></div>
              <div className="w-10 h-10 rounded-full border-2 border-white bg-rose-200 shadow-sm"></div>
            </div>
            <div className="text-xs text-slate-500 leading-tight">
              Dipercaya oleh <br/><span className="font-bold text-slate-800 text-sm">10+ mahasiswa</span>
            </div>
          </motion.div>
        </motion.div>

        {/* right content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 relative w-full max-w-lg lg:max-w-none"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-200 to-amber-100 rounded-full blur-[80px] opacity-40 -z-10 transform translate-x-10 translate-y-10"></div>
          
          {/* floating animation */}
          <motion.div 
            animate={{ y: [0, -15, 0] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/60 p-4 transform rotate-2 lg:rotate-3"
          >
            <div className="bg-slate-50 rounded-2xl h-full p-4 flex gap-4 border border-slate-100/50">
              <div className="w-16 bg-gradient-to-b from-[#6A040F] to-rose-900 rounded-xl hidden sm:block shadow-inner"></div>
              <div className="flex-1 space-y-4">
                <div className="h-8 w-1/3 bg-slate-200/80 rounded-md"></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-24 bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col justify-between">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600"><TrendingUp size={16}/></div>
                    <div className="h-2 w-1/2 bg-slate-100 rounded-full"></div>
                  </div>
                  <div className="h-24 bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col justify-between">
                    <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center text-[#6A040F]"><PieChart size={16}/></div>
                    <div className="h-2 w-1/2 bg-slate-100 rounded-full"></div>
                  </div>
                </div>
                <div className="h-32 bg-white rounded-xl border border-slate-100 shadow-sm"></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* grud fitur */}
      <section id="fitur" className="py-24 bg-white">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="max-w-7xl mx-auto px-6 text-center space-y-4 mb-16"
        >
          <span className="text-[#6A040F] text-xs font-bold tracking-widest uppercase bg-rose-50 px-4 py-1.5 rounded-full">Fitur Unggulan</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Semua yang Kamu Butuhkan,<br/> Dalam Satu Aplikasi</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm">Finora hadir dengan ekosistem fitur lengkap berbasis data untuk membantu kamu mengelola keuangan secara lebih bijak.</p>
        </motion.div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {[
            { icon: <TrendingUp size={24} className="text-[#6A040F]" />, title: "Prediksi Cerdas", desc: "Ketahui estimasi pengeluaran bulan depan dengan akurat." },
            { icon: <PieChart size={24} className="text-[#6A040F]" />, title: "Kategori Otomatis", desc: "Transaksi langsung terkelompok oleh AI." },
            { icon: <AlertTriangle size={24} className="text-[#6A040F]" />, title: "Deteksi Anomali", desc: "Peringatan otomatis saat kamu boros/overspend." },
            { icon: <Star size={24} className="text-[#6A040F]" />, title: "Rekomendasi", desc: "Tips penyesuaian gaya hidup dan finansial." },
            { icon: <Target size={24} className="text-[#6A040F]" />, title: "Target Tabungan", desc: "Wujudkan impianmu dengan pos tabungan virtual." },
          ].map((feature, idx) => (
            <motion.div 
              variants={fadeUpVariant}
              key={idx} 
              className="bg-slate-50 border border-slate-100/60 rounded-3xl p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 hover:bg-white text-center sm:text-left group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-5 mx-auto sm:mx-0 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-2.5">{feature.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* dashboard ux */}
      <section className="py-24 bg-[#FAFAFA] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-16">
          
          {/* left */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full relative"
          >
            <div className="absolute inset-0 bg-rose-200 rounded-full blur-[100px] opacity-30"></div>
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 transform -rotate-2 hover:rotate-0 transition-transform duration-700 relative z-10">
              <div className="bg-slate-900 rounded-2xl h-[420px] flex overflow-hidden border border-slate-800">
                <div className="w-1/4 bg-[#6A040F] p-5 flex flex-col gap-4">
                  <div className="w-8 h-8 bg-white/20 rounded-xl mb-6"></div>
                  <div className="h-2 w-3/4 bg-white/20 rounded-full"></div>
                  <div className="h-2 w-1/2 bg-white/20 rounded-full"></div>
                  <div className="h-2 w-2/3 bg-white/20 rounded-full"></div>
                </div>
                <div className="flex-1 bg-slate-50 p-6 flex flex-col gap-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-4 w-1/3 bg-slate-200 rounded-full"></div>
                    <div className="h-8 w-28 bg-white border border-slate-200 rounded-full shadow-sm"></div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 h-24 bg-white rounded-xl shadow-sm border border-slate-100"></div>
                    <div className="flex-1 h-24 bg-white rounded-xl shadow-sm border border-slate-100"></div>
                  </div>
                  <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 mt-2"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* right: teks */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-6"
          >
            <span className="text-rose-600 text-xs font-bold tracking-widest uppercase bg-rose-50 border border-rose-100 px-4 py-1.5 rounded-full">
              Analisis Real-Time
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Pantau Keuanganmu Secara Menyeluruh
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              Dapatkan insight mendalam tentang kondisi keuanganmu melalui antarmuka interaktif yang indah, rapi, dan mudah dipahami dalam satu halaman utama.
            </p>
            
            <ul className="space-y-4 pt-4">
              {[
                "Ringkasan arus kas yang terpusat",
                "Visualisasi grafik interaktif",
                "Skor kesehatan finansial harian",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm font-semibold text-slate-700 bg-white p-3 rounded-xl border border-slate-100 shadow-sm w-fit">
                  <CheckCircle2 size={18} className="text-emerald-500" /> {item}
                </li>
              ))}
            </ul>

            <div className="pt-6">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#6A040F] hover:bg-[#5d0017] text-white px-7 py-3.5 rounded-full text-sm font-bold shadow-lg shadow-rose-900/20 hover:-translate-y-1 transition-all">
                Jelajahi Sekarang <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

        </div>
      </section>

      {/* cara kerja */}
      <section className="py-24 bg-white relative overflow-hidden">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
          className="max-w-7xl mx-auto px-6 text-center space-y-4 mb-16 relative z-10"
        >
          <span className="text-[#6A040F] text-xs font-bold tracking-widest uppercase bg-rose-50 px-4 py-1.5 rounded-full">Cara Kerja Sederhana</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">3 Langkah Menuju <br/> Kebebasan Finansial</h2>
        </motion.div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10"
        >
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-rose-100 via-rose-300 to-rose-100 -z-10 -translate-y-1/2"></div>

          {[
            { step: 1, icon: <UserPlus size={24}/>, title: "Daftar & Hubungkan", desc: "Buat akun gratis dan mulai catat uang sakumu." },
            { step: 2, icon: <BarChart3 size={24}/>, title: "AI Analisis Polamu", desc: "Sistem cerdas memetakan kebiasaan belanjamu." },
            { step: 3, icon: <Trophy size={24}/>, title: "Capai Targetmu", desc: "Terapkan rekomendasi dan penuhi target tabungan." },
          ].map((item, idx) => (
            <motion.div variants={fadeUpVariant} key={idx} className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 text-center max-w-[260px] relative w-full group hover:-translate-y-2 transition-transform duration-300">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-[#6A040F] text-white flex items-center justify-center font-extrabold text-sm shadow-lg border-4 border-white">
                {item.step}
              </div>
              <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto text-[#6A040F] mb-5 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mb-2">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* testimonial */}
      <section className="py-24 bg-[#FAFAFA]">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
          className="max-w-7xl mx-auto px-6 text-center space-y-4 mb-16"
        >
          <span className="text-[#6A040F] text-xs font-bold tracking-widest uppercase bg-rose-50 px-4 py-1.5 rounded-full">Testimoni Pengguna</span>
          <h2 className="text-3xl font-extrabold text-slate-900">Dipercaya oleh Mahasiswa</h2>
        </motion.div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { quote: "Awalnya selalu kehabisan uang di akhir bulan, sejak pakai Finora pengeluaranku jadi jauh lebih tertata. AI Prediksinya juara!", name: "Aurora", univ: "Mahasiswa ITB" },
            { quote: "Desainnya memanjakan mata, nggak kaku kayak aplikasi keuangan lain. Fitur target tabungannya ngebantu banget buat beli laptop baru.", name: "Raihania", univ: "Mahasiswa UI" },
            { quote: "Fitur wawasan otomatis ngasih tau kalau aku udah mau overspend. Sangat direkomendasikan buat mahasiswa rantau!", name: "Lulu Najla", univ: "Mahasiswa ITSB" },
          ].map((testi, idx) => (
            <motion.div variants={fadeUpVariant} key={idx} className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm relative hover:shadow-lg transition-shadow">
              <span className="text-6xl text-rose-100 absolute top-4 right-6 font-serif opacity-50">"</span>
              <p className="text-sm text-slate-600 leading-relaxed mb-8 relative z-10 font-medium">"{testi.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-200 to-slate-200 border-2 border-white shadow-sm"></div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{testi.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">{testi.univ}</p>
                </div>
              </div> 
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* bottom cta */}
      <section className="pb-24 pt-12 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto bg-gradient-to-br from-[#6A040F] to-[#9d0208] rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-2xl shadow-rose-900/30"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500 opacity-20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>

          <div className="space-y-6 max-w-xl relative z-10 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Siap Mengelola Keuanganmu Lebih Baik?
            </h2>
            <p className="text-rose-100 text-sm md:text-base font-medium">
              Bergabung bersama ribuan mahasiswa lainnya dan mulai langkah cerdas mengatur finansial dengan Finora.
            </p>
            <div className="pt-4 flex justify-center md:justify-start">
              <Link href="/register" className="bg-white hover:bg-slate-50 text-[#6A040F] px-8 py-4 rounded-full text-sm font-extrabold shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2">
                Daftar Gratis Sekarang <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="relative z-10 hidden md:flex items-center justify-center">
            <div className="w-56 h-56 bg-rose-800/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
              <div className="w-40 h-40 bg-white/10 rounded-full flex items-center justify-center">
                <Target size={80} className="text-white drop-shadow-md" />
              </div>
            </div>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} className="absolute inset-0">
              <Star size={24} className="text-amber-300 absolute top-4 left-4 drop-shadow-md" />
              <Star size={32} className="text-amber-300 absolute bottom-8 right-0 drop-shadow-md" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* footer */}


    </div>
  );
}