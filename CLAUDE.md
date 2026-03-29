# Creem NextJS Demo - Project Guidelines

## Project Overview
A Next.js application integrated with Creem (Merchant of Record) for handling subscriptions and one-time purchases with webhook support.

## Database Schema

### Tables
- **`order`**: One-time purchases
  - Fields: `id`, `customerId`, `productId`, `amount`, `status`, `createdAt`, `updatedAt`
  
- **`subscription`**: Recurring subscriptions
  - Fields: `id`, `customerId`, `productId`, `creemSubscriptionId`, `status`, `currentPeriodStart`, `currentPeriodEnd`, `autoRenew`, `createdAt`, `updatedAt`, `cancelledAt`

## API Endpoints

### Subscriptions
- `GET /api/subscriptions` - Fetch all subscriptions

### Orders
- `GET /api/orders` - Fetch all orders

## Pages

### Subscriptions Page (`/subscriptions`)
- Displays all subscriptions with timestamps (created & updated)
- Shows: ID, Customer ID, Product ID, Status, Auto-Renew, Created, Updated
- Date format: `MMM DD, YYYY, HH:MM:SS AM/PM`

### Orders Page (`/orders`)
- Displays all orders with timestamps
- Shows: ID, Customer ID, Product ID, Amount, Status, Created, Updated
- Same date format as subscriptions

### Success Page (`/success`)
- Shown after successful checkout/payment

### Portal (`/portal`)
- Customer portal route

## Webhook Handling

The Creem webhook (`/api/webhook/creem`) handles:
- **One-time purchases**: `checkout.completed`
- **Subscriptions**: 
  - `subscription.active` - Updates or creates subscription
  - `subscription.trialing` - Updates or creates subscription in trial
  - `subscription.paid` - Recurring payment collected
  - `subscription.canceled` - Subscription cancelled
  - `subscription.paused` - Subscription paused
  - `subscription.expired` - Subscription expired
  - `subscription.past_due` - Payment failed
  - `subscription.update` - Subscription modified
  - `subscription.scheduled_cancel` - Cancellation scheduled

**Important**: Active and trialing events now check for existing subscriptions to avoid duplicate rows.

## Key Implementation Details

1. All subscription updates are tied to `creemSubscriptionId` (unique identifier from Creem)
2. Timestamps automatically set via `defaultNow()` on creation
3. `updatedAt` is manually updated on webhook events
4. Date formatting includes both date and time for better tracking