import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "../../../db/index";
import { transactions, wallets } from "../../../db/schema";
import { verifyJWT } from "../../../lib/auth";
import { eq, sql } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("finora_session")?.value;

    if (!token) {
      return NextResponse.json({ message: "Sesi tidak ditemukan, silakan login ulang" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ message: "Sesi tidak valid, silakan login ulang" }, { status: 401 });
    }

    const body = await req.json();
    const { type, amount, notes, categoryId } = body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ message: "Nominal harus berupa angka valid" }, { status: 400 });
    }

    // cari atau buat dompet utama pengguna jika belum ada
    let [userWallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, payload.userId as string))
      .limit(1);

    if (!userWallet) {
      const [newWallet] = await db
        .insert(wallets)
        .values({
          userId: payload.userId as string,
          name: "Dompet Utama",
          balance: "0",
        })
        .returning();
      userWallet = newWallet;
    }

    // catat transaksi baru
    await db.insert(transactions).values({
    userId: payload.userId as string,
    walletId: userWallet.id,
    categoryId: type === "expense" ? categoryId : null,
    type,
    amount: amount.toString(),
    notes: notes || "Tanpa catatan",
    });

    // perbarui saldo dompet
    const adjustment = type === "income" ? amount : -amount;
    await db
      .update(wallets)
      .set({
        balance: sql`${wallets.balance} + ${adjustment}`,
      })
      .where(eq(wallets.id, userWallet.id));

    return NextResponse.json({ message: "Transaksi berhasil disimpan" }, { status: 201 });
  } catch (error: any) {
    console.error("Error Simpan Transaksi:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server", error: error.message }, { status: 500 });
  }
}

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

    // ambil dompet pengguna
    const [userWallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, payload.userId as string))
      .limit(1);

    // ambil daftar transaksi
    const userTransactions = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, payload.userId as string))
      .orderBy(sql`${transactions.createdAt} desc`)
      .limit(10);

    return NextResponse.json({
      balance: userWallet?.balance || "0",
      transactions: userTransactions || [],
    });
  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}