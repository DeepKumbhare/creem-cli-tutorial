import { subscriptionTable } from "@/db/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { NextResponse } from "next/server";

const db = drizzle(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const subscriptions = await db.select().from(subscriptionTable);
    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Failed to fetch subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 },
    );
  }
}
