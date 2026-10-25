import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db/index";
import { users, userRoles, roles } from "@/db/schema";
import { verifyPassword, signJWT } from "@/lib/auth";
import { eq } from "drizzle-orm";

// skema validasi login
const loginSchema = z.object({
  email: z.string().email("format email tidak valid"),
  password: z.string().min(1, "kata sandi wajib diisi"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // cari akun pengguna
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { message: "email atau kata sandi salah" },
        { status: 401 }
      );
    }

    // verifikasi kata sandi
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: "email atau kata sandi salah" },
        { status: 401 }
      );
    }

    // ambil peran pengguna
    const [userRoleData] = await db
      .select({ roleName: roles.name })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, user.id))
      .limit(1);

    const userRole = userRoleData?.roleName || "user";

    // buat token jwt
    const token = await signJWT({
      userId: user.id,
      email: user.email,
      role: userRole,
    });

    const response = NextResponse.json(
      {
        message: "login berhasil",
        user: { id: user.id, name: user.name, email: user.email, role: userRole },
      },
      { status: 200 }
    );

    // simpan token ke cookie
    response.cookies.set({
      name: "finora_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "terjadi kesalahan server" },
      { status: 500 }
    );
  }
}