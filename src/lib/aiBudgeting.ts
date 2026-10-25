export interface BudgetAllocation {
  primerMax: number;
  sekunderMax: number;
  tersierMax: number;
  primerPercent: number;
  sekunderPercent: number;
  tersierPercent: number;
  aiNote: string;
}

export function calculateSmartBudget(
  income: number,
  actualExpenses: { primer: number; sekunder: number; tersier: number }
): BudgetAllocation {
  if (income <= 0) {
    return {
      primerMax: 0,
      sekunderMax: 0,
      tersierMax: 0,
      primerPercent: 0,
      sekunderPercent: 0,
      tersierPercent: 0,
      aiNote: "Belum ada pemasukan yang dicatat.",
    };
  }

  let pRatio = 0.5;
  let sRatio = 0.3;
  let tRatio = 0.2;
  let note = "";

  if (income >= 5000000) {
    pRatio = 0.35;
    sRatio = 0.35;
    tRatio = 0.30;
    note = "Pemasukan kamu tergolong tinggi! Alokasi hobi & pengembangan diri dibuat lebih fleksibel.";
  } else if (income >= 3000000) {
    pRatio = 0.40;
    sRatio = 0.35;
    tRatio = 0.25;
    note = "Alokasi disesuaikan secara seimbang untuk kebutuhan harian, tabungan, dan hobi.";
  } else if (income < 1500000) {
    pRatio = 0.60;
    sRatio = 0.25;
    tRatio = 0.15;
    note = "Pemasukan terbatas. AI memprioritaskan porsi Primer agar kebutuhan dasar aman.";
  } else {
    note = "Alokasi berada di tingkat ideal 50-30-20 untuk mahasiswa.";
  }

  if (actualExpenses.tersier > income * tRatio && income >= 2500000) {
    note += " Terdeteksi pengeluaran hobi/nongkrong cukup aktif bulan ini.";
  }

  return {
    primerMax: Math.round(income * pRatio),
    sekunderMax: Math.round(income * sRatio),
    tersierMax: Math.round(income * tRatio),
    primerPercent: Math.round(pRatio * 100),
    sekunderPercent: Math.round(sRatio * 100),
    tersierPercent: Math.round(tRatio * 100),
    aiNote: note,
  };
}