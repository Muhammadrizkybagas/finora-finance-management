import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "../../../db/index";
import { transactions } from "../../../db/schema";
import { verifyJWT } from "../../../lib/auth";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("finora_session")?.value;

    if (!token) {
      return NextResponse.json({ message: "Sesi tidak ditemukan" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ message: "Sesi tidak valid" }, { status: 401 });
    }

    // get transactions
    const userExpenses = await db
      .select()
      .from(transactions)
      .where(
        sql`${transactions.userId} = ${payload.userId as string} AND ${transactions.type} = 'expense'`
      );

    const now = new Date();
    // tanggal kalender
    const currentDay = now.getDate() || 1;
    const daysInNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0).getDate();

    let totalExpenseThisMonth = 0;
    userExpenses.forEach((t) => {
      totalExpenseThisMonth += parseFloat(t.amount);
    });

    // match logic
    const dailyRate = totalExpenseThisMonth / currentDay;

    const predictedNextMonth = Math.round(dailyRate * daysInNextMonth);

    return NextResponse.json({
      method: "Baseline Laju Harian",
      statusLabel: "Data Terbatas (< 1 Bulan)",
      totalExpenseThisMonth,
      dailyRate,
      predictedNextMonth,
      currentDay,
      daysInNextMonth,
      hasRange: false,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal menghitung prediksi", error: error.message },
      { status: 500 }
    );
  }
}