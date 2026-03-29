import { orderTable } from "@/db/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { NextResponse } from "next/server";

const db = drizzle(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const orders = await db.select().from(orderTable);
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
