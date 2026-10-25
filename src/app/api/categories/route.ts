import { NextResponse } from "next/server";
import { db } from "../../../db/index";
import { categories } from "../../../db/schema";

export async function GET() {
  try {
    const allCategories = await db.select().from(categories);
    return NextResponse.json({ categories: allCategories });
  } catch (error) {
    return NextResponse.json(
      { message: "gagal mengambil data kategori" },
      { status: 500 }
    );
  }
}