import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing from .env.local");
}

const sql = neon(databaseUrl);

const filePath = path.join(
  process.cwd(),
  "data",
  "orders.json"
);

const orders = JSON.parse(
  await readFile(filePath, "utf8")
);

if (!Array.isArray(orders)) {
  throw new Error("orders.json must contain an array.");
}

let imported = 0;
let skipped = 0;

for (const order of orders) {
  if (
    !order.id ||
    !order.userId ||
    !Array.isArray(order.items) ||
    !order.createdAt
  ) {
    throw new Error(
      `Invalid order record: ${order.id ?? "(missing ID)"}`
    );
  }

  const result = await sql`
    INSERT INTO orders (
      id,
      user_id,
      status,
      items,
      total,
      neighbourhood,
      created_at
    )
    VALUES (
      ${order.id},
      ${order.userId},
      ${order.status || "pending"},
      ${JSON.stringify(order.items)}::jsonb,
      ${Number(order.total || 0)},
      ${order.neighbourhood ?? null},
      ${order.createdAt}
    )
    ON CONFLICT (id) DO NOTHING
    RETURNING id
  `;

  if (result.length) {
    imported++;
  } else {
    skipped++;
  }
}

console.log("Order migration finished.");
console.log(`Imported: ${imported}`);
console.log(`Already existed: ${skipped}`);
console.log(`JSON records checked: ${orders.length}`);