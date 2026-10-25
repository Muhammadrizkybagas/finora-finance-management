import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { db } from "../../../db/index";
import { savingsGoals, transactions, wallets } from "../../../db/schema";
import { verifyJWT } from "../../../lib/auth";
import { eq, and } from "drizzle-orm";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("finora_session")?.value;
    if (!token) return NextResponse.json({ message: "Sesi tidak ditemukan" }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload || !payload.userId) return NextResponse.json({ message: "Sesi tidak valid" }, { status: 401 });

    const goals = await db
      .select()
      .from(savingsGoals)
      .where(eq(savingsGoals.userId, payload.userId as string));

    return NextResponse.json({ goals });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("finora_session")?.value;
    if (!token) return NextResponse.json({ message: "Sesi tidak ditemukan" }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload || !payload.userId) return NextResponse.json({ message: "Sesi tidak valid" }, { status: 401 });

    const body = await req.json();
    const { title, targetAmount, categoryIcon } = body;

    if (!title || !targetAmount) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    const [newGoal] = await db
      .insert(savingsGoals)
      .values({
        userId: payload.userId as string,
        title,
        targetAmount: targetAmount.toString(),
        currentAmount: "0",
        categoryIcon: categoryIcon || "🛡️",
      })
      .returning();

    return NextResponse.json({ message: "Target dibuat", goal: newGoal });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("finora_session")?.value;
    if (!token) return NextResponse.json({ message: "Sesi tidak ditemukan" }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload || !payload.userId) return NextResponse.json({ message: "Sesi tidak valid" }, { status: 401 });

    const body = await req.json();
    const { id, addAmount, type } = body;

    if (!id || !addAmount) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    // Cek target tabungan
    const [existing] = await db
      .select()
      .from(savingsGoals)
      .where(and(eq(savingsGoals.id, id), eq(savingsGoals.userId, payload.userId as string)));

    if (!existing) {
      return NextResponse.json({ message: "Target tidak ditemukan" }, { status: 404 });
    }

    const updatedAmount = parseFloat(existing.currentAmount) + parseFloat(addAmount);

    // Update saldo tabungan
    const [updated] = await db
      .update(savingsGoals)
      .set({ currentAmount: updatedAmount.toString() })
      .where(eq(savingsGoals.id, id))
      .returning();

    // Potong saldo utama
    if (type === "finora") {
      const [userWallet] = await db
        .select()
        .from(wallets)
        .where(eq(wallets.userId, payload.userId as string))
        .limit(1);

      if (userWallet) {
        // Catat pengeluaran
        await db.insert(transactions).values({
          userId: payload.userId as string,
          walletId: userWallet.id,
          type: "expense",
          amount: addAmount.toString(),
          notes: `Alokasi Tabungan: ${existing.title}`,
          transactionDate: new Date(),
        });

        // Kurangi saldo
        const newBalance = parseFloat(userWallet.balance) - parseFloat(addAmount);
        await db.update(wallets)
          .set({ balance: newBalance.toString() })
          .where(eq(wallets.id, userWallet.id));
      }
    }

    return NextResponse.json({ message: "Setoran berhasil", goal: updated });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}