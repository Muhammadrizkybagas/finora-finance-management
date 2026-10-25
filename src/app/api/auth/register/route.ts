import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db/index";
import { users, roles, userRoles, wallets } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { eq } from "drizzle-orm";

// skema validasi registrasi
const registerSchema = z.object({
  name: z.string().min(2, "nama minimal 2 karakter"),
  email: z.string().email("format email tidak valid"),
  password: z.string().min(6, "kata sandi minimal 6 karakter"),
  analyticsConsent: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, analyticsConsent } = validation.data;

    // cek email terdaftar
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: "email sudah terdaftar" },
        { status: 400 }
      );
    }

    // hash kata sandi
    const passwordHash = await hashPassword(password);

    // simpan pengguna baru
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email: email.toLowerCase(),
        passwordHash,
        analyticsConsent: analyticsConsent || false,
      })
      .returning();

    // ambil role user
    const [userRole] = await db
      .select()
      .from(roles)
      .where(eq(roles.name, "user"))
      .limit(1);

    if (userRole) {
      await db.insert(userRoles).values({
        userId: newUser.id,
        roleId: userRole.id,
      });
    }

    // buat dompet utama
    await db.insert(wallets).values({
      userId: newUser.id,
      name: "Dompet Utama",
      balance: "0",
    });

    return NextResponse.json(
      { message: "registrasi berhasil", userId: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "terjadi kesalahan server" },
      { status: 500 }
    );
  }
}