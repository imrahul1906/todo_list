import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import { connectDB } from "../config/DatabaseConfig.js";
import { User } from "../model/UserSchema.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { file: "users.csv" };
  for (let i = 0; i < args.length; i++) {
    if ((args[i] === "--file" || args[i] === "-f") && args[i + 1]) {
      opts.file = args[i + 1];
      i++;
    }
  }
  return opts;
}

function normalizeCsvValue(v) {
  if (v == null) return "";
  let out = String(v).trim();
  if ((out.startsWith("\"") && out.endsWith("\"")) || (out.startsWith("'") && out.endsWith("'"))) {
    out = out.slice(1, -1);
  }
  return out.trim();
}

function parseCsv(contents) {
  const lines = contents.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];

  const first = lines[0].toLowerCase();
  const hasHeader = first.includes("email") && first.includes("name") && first.includes("password");

  const startIdx = hasHeader ? 1 : 0;
  const rows = [];

  for (let i = startIdx; i < lines.length; i++) {
    const raw = lines[i];
    const parts = raw.split(",");
    if (parts.length < 3) continue;
    const name = normalizeCsvValue(parts[0]);
    const email = normalizeCsvValue(parts[1]);
    const password = normalizeCsvValue(parts[2]);
    if (!email || !password) continue;
    rows.push({ name, email, password });
  }
  return rows;
}

async function hashPassword(plain) {
  const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
  const salt = await bcrypt.genSalt(rounds);
  return bcrypt.hash(plain, salt);
}

async function seedUsers(filePath) {
  const abs = path.isAbsolute(filePath) ? filePath : path.join(__dirname, "..", filePath);
  if (!fs.existsSync(abs)) {
    throw new Error(`CSV file not found at: ${abs}`);
  }

  const csv = fs.readFileSync(abs, "utf-8");
  const users = parseCsv(csv);
  console.log(`Parsed ${users.length} users from ${filePath}`);

  await connectDB();

  let upserts = 0;
  let updates = 0;
  let errors = 0;

  for (const u of users) {
    try {
      const hashed = await hashPassword(u.password);
      const res = await User.updateOne(
        { email: u.email },
        { $set: { name: u.name || u.email.split("@")[0], email: u.email, password: hashed } },
        { upsert: true }
      );
      if (res.upsertedCount && res.upsertedCount > 0) upserts += res.upsertedCount;
      else if (res.modifiedCount && res.modifiedCount > 0) updates += res.modifiedCount;
      else {
        // matched but no change
      }
    } catch (e) {
      errors += 1;
      console.error(`Failed to upsert ${u.email}:`, e?.message || e);
    }
  }

  console.log(`\nDone. Upserted: ${upserts}, Updated: ${updates}, Errors: ${errors}`);
}

seedUsers(parseArgs().file)
  .then(() => {
    console.log("\n✅ Seeding complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seeding failed:", err?.message || err);
    process.exit(1);
  }); 