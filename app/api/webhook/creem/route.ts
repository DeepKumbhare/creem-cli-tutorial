// app/api/webhooks/creem/route.ts
import { orderTable, subscriptionTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const db = drizzle(process.env.DATABASE_URL!);

// Helper function to safely parse dates from Creem webhook
function parseDate(value: number | Date): Date {
  if (!value) {
    return new Date();
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "number") {
    // If it's a Unix timestamp in seconds (< 10 billion), convert to milliseconds
    if (value < 10000000000) {
      return new Date(value * 1000);
    }
    return new Date(value);
  }

  // Try parsing as string
  const parsed = new Date(value);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }

  // Fallback to now if parsing fails
  console.warn("Invalid date value:", value);
  return new Date();
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("creem-signature");

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.CREEM_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);

  console.log("Received Creem webhook:", event);

  try {
    // Handle different event types
    switch (event.eventType) {
      // ONE-TIME PURCHASE
      case "checkout.completed":
        console.log("Payment successful!", {
          checkoutId: event.id,
          customerId: event.object.customer.id,
          productId: event.object.product.id,
          billingType: event.object.order.type,
        });

        // Only insert into orders table for ONE-TIME purchases
        // Skip subscriptions as they're handled by subscription lifecycle events
        if (event.object.order.type === "onetime") {
          await db.insert(orderTable).values({
            customerId: event.object.customer.id,
            productId: event.object.product.id,
            amount: event.object.product.price,
            status: "completed",
          });
        } else {
          console.log(
            "Skipping order creation for recurring product. Waiting for subscription events.",
          );
        }
        break;

      // SUBSCRIPTION: New subscription started
      case "subscription.active":
        console.log("Subscription active:", event.object.id);

        // Check if subscription exists
        const existingActive = await db
          .select()
          .from(subscriptionTable)
          .where(eq(subscriptionTable.creemSubscriptionId, event.object.id))
          .limit(1);

        if (existingActive.length > 0) {
          // Update existing subscription
          await db
            .update(subscriptionTable)
            .set({
              status: "active",
              currentPeriodStart: parseDate(event.object.currentPeriodStart),
              currentPeriodEnd: parseDate(event.object.currentPeriodEnd),
              autoRenew: event.object.autoRenew ?? true,
              updatedAt: new Date(),
            })
            .where(eq(subscriptionTable.creemSubscriptionId, event.object.id));
        } else {
          // Create new subscription if not exists
          await db.insert(subscriptionTable).values({
            customerId: event.object.customer.id,
            productId: event.object.product.id,
            creemSubscriptionId: event.object.id,
            status: "active",
            currentPeriodStart: parseDate(event.object.currentPeriodStart),
            currentPeriodEnd: parseDate(event.object.currentPeriodEnd),
            autoRenew: event.object.autoRenew ?? true,
          });
        }
        break;

      // SUBSCRIPTION: Trial started
      case "subscription.trialing":
        console.log("Subscription trialing:", event.object.id);

        // Check if subscription exists
        const existingTrialing = await db
          .select()
          .from(subscriptionTable)
          .where(eq(subscriptionTable.creemSubscriptionId, event.object.id))
          .limit(1);

        if (existingTrialing.length > 0) {
          // Update existing subscription
          await db
            .update(subscriptionTable)
            .set({
              status: "trialing",
              currentPeriodStart: parseDate(event.object.currentPeriodStart),
              currentPeriodEnd: parseDate(event.object.currentPeriodEnd),
              autoRenew: event.object.autoRenew ?? true,
              updatedAt: new Date(),
            })
            .where(eq(subscriptionTable.creemSubscriptionId, event.object.id));
        } else {
          // Create new subscription if not exists
          await db.insert(subscriptionTable).values({
            customerId: event.object.customer.id,
            productId: event.object.product.id,
            creemSubscriptionId: event.object.id,
            status: "trialing",
            currentPeriodStart: parseDate(event.object.currentPeriodStart),
            currentPeriodEnd: parseDate(event.object.currentPeriodEnd),
            autoRenew: event.object.autoRenew ?? true,
          });
        }
        break;

      // SUBSCRIPTION: Recurring payment collected
      case "subscription.paid":
        console.log("Subscription paid:", event.object.id);

        // Check if subscription exists
        const existing = await db
          .select()
          .from(subscriptionTable)
          .where(eq(subscriptionTable.creemSubscriptionId, event.object.id))
          .limit(1);

        if (existing.length > 0) {
          // Update existing subscription
          await db
            .update(subscriptionTable)
            .set({
              status: "active",
              currentPeriodStart: parseDate(event.object.currentPeriodStart),
              currentPeriodEnd: parseDate(event.object.currentPeriodEnd),
              updatedAt: new Date(),
            })
            .where(eq(subscriptionTable.creemSubscriptionId, event.object.id));
        } else {
          // Create new subscription if not exists
          await db.insert(subscriptionTable).values({
            customerId: event.object.customer.id,
            productId: event.object.product.id,
            creemSubscriptionId: event.object.id,
            status: "active",
            currentPeriodStart: parseDate(event.object.currentPeriodStart),
            currentPeriodEnd: parseDate(event.object.currentPeriodEnd),
            autoRenew: event.object.autoRenew ?? true,
          });
        }
        break;

      // SUBSCRIPTION: Subscription cancelled
      case "subscription.canceled":
        console.log("Subscription canceled:", event.object.id);
        await db
          .update(subscriptionTable)
          .set({
            status: "canceled",
            cancelledAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(subscriptionTable.creemSubscriptionId, event.object.id));
        break;

      // SUBSCRIPTION: Cancellation scheduled for period end
      case "subscription.scheduled_cancel":
        console.log(
          "Subscription scheduled for cancellation:",
          event.object.id,
        );
        await db
          .update(subscriptionTable)
          .set({
            status: "scheduled_cancel",
            updatedAt: new Date(),
          })
          .where(eq(subscriptionTable.creemSubscriptionId, event.object.id));
        break;

      // SUBSCRIPTION: Payment failed, retrying
      case "subscription.past_due":
        console.log("Subscription past due:", event.object.id);
        await db
          .update(subscriptionTable)
          .set({
            status: "past_due",
            updatedAt: new Date(),
          })
          .where(eq(subscriptionTable.creemSubscriptionId, event.object.id));
        break;

      // SUBSCRIPTION: Billing period ended without payment
      case "subscription.expired":
        console.log("Subscription expired:", event.object.id);
        await db
          .update(subscriptionTable)
          .set({
            status: "expired",
            updatedAt: new Date(),
          })
          .where(eq(subscriptionTable.creemSubscriptionId, event.object.id));
        break;

      // SUBSCRIPTION: Subscription paused
      case "subscription.paused":
        console.log("Subscription paused:", event.object.id);
        await db
          .update(subscriptionTable)
          .set({
            status: "paused",
            updatedAt: new Date(),
          })
          .where(eq(subscriptionTable.creemSubscriptionId, event.object.id));
        break;

      // SUBSCRIPTION: Subscription modified
      case "subscription.update":
        console.log("Subscription updated:", event.object.id);
        await db
          .update(subscriptionTable)
          .set({
            currentPeriodStart: parseDate(event.object.currentPeriodStart),
            currentPeriodEnd: parseDate(event.object.currentPeriodEnd),
            autoRenew: event.object.autoRenew ?? true,
            updatedAt: new Date(),
          })
          .where(eq(subscriptionTable.creemSubscriptionId, event.object.id));
        break;

      default:
        console.log("Unhandled event type:", event.eventType);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
