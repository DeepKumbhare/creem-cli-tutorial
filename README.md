# Creem + Next.js Demo

A comprehensive Next.js demo showcasing how to accept one-time payments and subscriptions using [Creem](https://www.creem.io), with full order and subscription management.

## Features

- **One-time Purchases**: Product checkout for lifetime access
- **Subscription Management**: Monthly billing with automatic renewal tracking
- **Order Tracking**: View and manage all completed orders with timestamps
- **Subscription Tracking**: Monitor subscription status, billing cycles, and auto-renewal settings
- **Webhook Handler**: Complete Creem webhook signature verification and event processing
- **Database Persistence**: Orders and subscriptions stored in Neon PostgreSQL via Drizzle ORM
- **Payment Success Page**: Confirmation page after successful checkout
- **Customer Portal**: Customer self-service portal access
- **Duplicate Prevention**: Intelligent subscription duplicate detection to ensure data integrity

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Framework  | [Next.js 16](https://nextjs.org)    |
| Payments   | [Creem](https://www.creem.io) (`@creem_io/nextjs`) |
| Database   | [Neon](https://neon.tech) (serverless PostgreSQL) |
| ORM        | [Drizzle ORM](https://orm.drizzle.team) |
| Styling    | [Tailwind CSS v4](https://tailwindcss.com) |
| Language   | TypeScript                          |

## Project Structure

```
app/
├── page.tsx                      # Landing page with checkout buttons
├── success/page.tsx              # Post-payment success page
├── orders/page.tsx               # View all orders with timestamps
├── subscriptions/page.tsx         # View all subscriptions with timestamps
├── portal/route.ts               # Customer portal route
└── api/
    ├── checkout/route.ts         # Creem checkout handler
    ├── webhook/creem/route.ts    # Creem webhook receiver & event processor
    ├── orders/route.ts           # GET /api/orders endpoint
    └── subscriptions/route.ts    # GET /api/subscriptions endpoint
db/
└── schema.ts                     # Drizzle ORM schema (orders & subscriptions tables)
drizzle.config.ts                 # Drizzle Kit configuration
CLAUDE.md                          # Detailed project guidelines & specifications
```

## Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org)
- [pnpm](https://pnpm.io) (`npm i -g pnpm`)
- A [Creem](https://www.creem.io) account with at least one product created
- A [Neon](https://neon.tech) project (free tier works)

### 1. Clone and install dependencies

```bash
git clone https://github.com/your-username/creem-nextjs-demo.git
cd creem-nextjs-demo
pnpm install
```

### 2. Configure environment variables

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env
```

| Variable               | Description                                                                     |
|------------------------|---------------------------------------------------------------------------------|
| `CREEM_API_KEY`        | Your Creem API key (test or live). Found in Creem dashboard → API Keys.         |
| `CREEM_WEBHOOK_SECRET` | Webhook signing secret. Found in Creem dashboard → Webhooks.                    |
| `DATABASE_URL`         | Neon PostgreSQL connection string. Found in Neon console → Connection Details.  |

### 3. Push the database schema

```bash
pnpm drizzle-kit push
```

### 4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Webhook Setup (Local Development)

Creem needs a publicly accessible URL to deliver webhook events. Use [ngrok](https://ngrok.com) to expose your local server:

```bash
ngrok http 3000
```

Then register the forwarding URL as a webhook endpoint in your Creem dashboard:

```
https://<your-ngrok-id>.ngrok-free.app/api/webhook/creem
```

### Supported Webhook Events

The webhook handler (`/api/webhook/creem`) processes the following events with intelligent duplicate prevention:

**One-Time Purchases:**
| Event                | Action                                                |
|----------------------|-------------------------------------------------------|
| `checkout.completed` | Creates order record with payment details             |

**Subscriptions:**
| Event                       | Action                                                        |
|-----------------------------|---------------------------------------------------------------|
| `subscription.active`       | Creates or updates subscription (checks for existing record)  |
| `subscription.trialing`     | Creates or updates trial subscription                         |
| `subscription.paid`         | Records recurring payment collection                          |
| `subscription.canceled`     | Updates subscription status as cancelled                      |
| `subscription.paused`       | Updates subscription status as paused                         |
| `subscription.expired`      | Updates subscription status as expired                        |
| `subscription.past_due`     | Marks subscription with payment failure                       |
| `subscription.update`       | Applies subscription modifications                            |
| `subscription.scheduled_cancel` | Records scheduled cancellation                           |

**Key Implementation**: Active and trialing events check for existing subscriptions by `creemSubscriptionId` to prevent duplicate rows.

## Database Schema

### Orders Table

```sql
CREATE TABLE "order" (
  id         SERIAL PRIMARY KEY,
  customerId VARCHAR(255) NOT NULL,
  productId  VARCHAR(255) NOT NULL,
  amount     INTEGER NOT NULL,
  status     VARCHAR(50) NOT NULL,
  createdAt  TIMESTAMP DEFAULT now(),
  updatedAt  TIMESTAMP DEFAULT now()
);
```

### Subscriptions Table

```sql
CREATE TABLE "subscription" (
  id                   SERIAL PRIMARY KEY,
  customerId           VARCHAR(255) NOT NULL,
  productId            VARCHAR(255) NOT NULL,
  creemSubscriptionId  VARCHAR(255),
  status               VARCHAR(50) NOT NULL,
  currentPeriodStart   TIMESTAMP NOT NULL,
  currentPeriodEnd     TIMESTAMP NOT NULL,
  autoRenew            BOOLEAN DEFAULT true NOT NULL,
  createdAt            TIMESTAMP DEFAULT now() NOT NULL,
  updatedAt            TIMESTAMP DEFAULT now() NOT NULL,
  cancelledAt          TIMESTAMP
);
```

## API Endpoints

### Data Retrieval

| Endpoint              | Method | Description                                      |
|-----------------------|--------|--------------------------------------------------|
| `/api/orders`         | GET    | Fetch all orders with customer and product info |
| `/api/subscriptions`  | GET    | Fetch all subscriptions with status details      |

### Checkout & Webhooks

| Endpoint                  | Method | Description                         |
|---------------------------|--------|-------------------------------------|
| `/api/checkout`           | POST   | Initiate checkout session           |
| `/api/webhook/creem`      | POST   | Receive and process Creem events    |

## Pages & User Interface

| Page               | Route           | Description                                              |
|--------------------|-----------------|----------------------------------------------------------|
| Landing            | `/`             | Checkout options for one-time and subscription products |
| Orders             | `/orders`       | View all orders with formatted timestamps               |
| Subscriptions      | `/subscriptions`| View all subscriptions with status and billing info     |
| Success            | `/success`      | Post-payment confirmation page                          |
| Portal             | `/portal`       | Customer self-service portal access                     |

**Timestamp Format**: All dates displayed as `MMM DD, YYYY, HH:MM:SS AM/PM` (e.g., "Mar 31, 2026, 03:45:30 PM")

## Development Workflow

### Available Scripts

| Command            | Description                                  |
|--------------------|----------------------------------------------|
| `pnpm dev`         | Start development server (http://localhost:3000) |
| `pnpm build`       | Build for production                         |
| `pnpm start`       | Start production server                      |
| `pnpm lint`        | Run ESLint code quality checks                |
| `pnpm drizzle-kit push` | Push database schema changes            |
| `pnpm drizzle-kit studio` | Open Drizzle Studio for database management |

### Database Migrations

When making schema changes:

```bash
# Make changes to db/schema.ts
nano db/schema.ts

# Push changes to database
pnpm drizzle-kit push

# (Optional) Open interactive database studio
pnpm drizzle-kit studio
```

## Deployment

Deploy to production with proper environment variables:

```bash
# On your hosting provider (Vercel, Render, etc.), set:
CREEM_API_KEY=<your-live-api-key>
CREEM_WEBHOOK_SECRET=<your-webhook-secret>
DATABASE_URL=<your-neon-database-url>

# Then deploy
pnpm build
pnpm start
```

## Project Documentation

For detailed project guidelines, database specifications, and webhook handling logic, see [CLAUDE.md](./CLAUDE.md).


## License

MIT
