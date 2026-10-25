import { config } from "dotenv";
import { resolve } from "path";

// muat env local
config({ path: resolve(process.cwd(), ".env.local") });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// inisialisasi koneksi db
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  console.log("menanam data awal...");

  // seed role
  const defaultRoles = [
    { name: "user", description: "Pengguna reguler pencatat keuangan" },
    { name: "data_scientist", description: "Akses dataset anonim dan evaluasi model ML" },
    { name: "admin", description: "Pengelola akun, kategori, dan operasional" },
    { name: "super_admin", description: "Akses penuh sistem dan manajemen admin" },
  ];

  for (const role of defaultRoles) {
    await db.insert(schema.roles).values(role).onConflictDoNothing();
  }

  // seed kategori master
  const defaultCategories: (typeof schema.categories.$inferInsert)[] = [
    // kategori primer
    { name: "Makanan & Minuman Pokok", type: "expense", level: "primer", icon: "utensils", isMaster: true },
    { name: "Sewa Kos / Tempat Tinggal", type: "expense", level: "primer", icon: "home", isMaster: true },
    { name: "Listrik & Air", type: "expense", level: "primer", icon: "zap", isMaster: true },
    { name: "Biaya Kuliah & UKT", type: "expense", level: "primer", icon: "graduation-cap", isMaster: true },
    { name: "Transportasi Harian", type: "expense", level: "primer", icon: "bus", isMaster: true },
    { name: "Kesehatan & Obat", type: "expense", level: "primer", icon: "heart-pulse", isMaster: true },

    // kategori sekunder
    { name: "Internet & Kuota Data", type: "expense", level: "sekunder", icon: "wifi", isMaster: true },
    { name: "Buku & Alat Tulis", type: "expense", level: "sekunder", icon: "book-open", isMaster: true },
    { name: "Belanja Bulanan", type: "expense", level: "sekunder", icon: "shopping-bag", isMaster: true },
    { name: "Pakaian & Perawatan", type: "expense", level: "sekunder", icon: "shirt", isMaster: true },

    // kategori tersier
    { name: "Hiburan & Nongkrong", type: "expense", level: "tersier", icon: "coffee", isMaster: true },
    { name: "Langganan Digital", type: "expense", level: "tersier", icon: "film", isMaster: true },
    { name: "Hobi & Game", type: "expense", level: "tersier", icon: "gamepad-2", isMaster: true },

    // kategori pemasukan
    { name: "Uang Saku Orang Tua", type: "income", level: null, icon: "hand-coins", isMaster: true },
    { name: "Gaji / Part-Time", type: "income", level: null, icon: "briefcase", isMaster: true },
    { name: "Beasiswa", type: "income", level: null, icon: "award", isMaster: true },
    { name: "Freelance", type: "income", level: null, icon: "laptop", isMaster: true },
  ];

  for (const category of defaultCategories) {
    await db.insert(schema.categories).values(category).onConflictDoNothing();
  }

  console.log("seed data selesai!");
  process.exit(0);
}

main().catch((err) => {
  console.error("gagal seed data:", err);
  process.exit(1);
});