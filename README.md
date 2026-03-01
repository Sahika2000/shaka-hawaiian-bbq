# Shaka Hawaiian BBQ — Online Ordering System

A production-ready Next.js restaurant website and ordering system for Shaka Hawaiian BBQ in The Colony, TX. Customers can browse the menu, add items to a cart, check out via Stripe, and receive confirmation. Admins can manage menu availability and view/update orders.

---

## Tech Stack

- **Frontend/Backend:** Next.js 14 (App Router) + TypeScript
- **Database:** PostgreSQL via Prisma ORM
- **Payments:** Stripe Checkout
- **State:** Zustand (cart persistence in localStorage)
- **Styling:** CSS Modules + Google Fonts

---

## Project Structure

```
shaka-hawaiian-bbq/
├── prisma/
│   ├── schema.prisma          # Prisma schema
│   └── seed.ts                # Seeds menu data
├── schema.sql                 # Raw SQL schema reference
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (header/footer)
│   │   ├── page.tsx           # Homepage
│   │   ├── menu/              # Menu browse + cart
│   │   ├── checkout/          # Checkout form
│   │   ├── confirmation/      # Post-payment confirmation
│   │   ├── admin/
│   │   │   ├── login/         # Admin login
│   │   │   ├── orders/        # View + update orders
│   │   │   └── menu/          # Edit menu items
│   │   └── api/
│   │       ├── checkout/      # Creates Stripe Checkout Session
│   │       ├── webhook/       # Stripe webhook (marks order paid)
│   │       └── admin/
│   │           ├── login/     # Cookie-based auth
│   │           ├── orders/    # Order CRUD
│   │           └── menu/      # Menu CRUD
│   ├── components/            # Header, Footer, CartDrawer
│   └── lib/                   # prisma, stripe, auth, cart store, utils
└── README.md
```

---

## Local Setup

### 1. Prerequisites

- Node.js 18+
- PostgreSQL 14+ running locally (or a cloud Postgres URL)
- A Stripe account (free to create)

### 2. Install dependencies

```bash
cd shaka-hawaiian-bbq
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/shaka_bbq"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."        # fill in after Stripe setup below
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ADMIN_PASSWORD="your-strong-admin-password"
```

### 4. Set up the database

Create the database first:

```bash
psql -U postgres -c "CREATE DATABASE shaka_bbq;"
```

Then push the Prisma schema:

```bash
npm run db:push
```

Or run migrations:

```bash
npm run db:migrate
```

### 5. Seed the menu

```bash
npm run db:seed
```

This populates all menu categories and items from the provided MENU.json data.

### 6. Start the dev server

```bash
npm run dev
```

Visit:
- **Site:** http://localhost:3000
- **Admin:** http://localhost:3000/admin/login

---

## Stripe Setup

### 1. Create a Stripe account

Go to [stripe.com](https://stripe.com) and create a free account.

### 2. Get your API keys

In the [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys):
- Copy the **Secret key** (`sk_test_...`) → set as `STRIPE_SECRET_KEY` in `.env`

### 3. Set up the webhook (local development)

Install the Stripe CLI:

```bash
# macOS
brew install stripe/stripe-cli/stripe

# or download from https://stripe.com/docs/stripe-cli
```

Login and forward webhooks to your local server:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```

The CLI will print a webhook signing secret (`whsec_...`). Set it as `STRIPE_WEBHOOK_SECRET` in `.env`.

### 4. Test the payment flow

Use Stripe test card:
- Card: `4242 4242 4242 4242`
- Expiry: any future date
- CVC: any 3 digits

### 5. Go live (production)

1. Switch to live mode in the Stripe Dashboard
2. Replace test keys with live keys (`sk_live_...`)
3. Create a new webhook endpoint in the Dashboard:
   - URL: `https://your-domain.com/api/webhook`
   - Events: `checkout.session.completed`
4. Copy the live webhook signing secret → `STRIPE_WEBHOOK_SECRET`

---

## Admin Usage

1. Visit `/admin/login` and enter your `ADMIN_PASSWORD`
2. **Orders tab:** View all orders, expand rows to see items, update order status (pending → paid → ready → completed)
3. **Menu tab:** Toggle item availability (hide/show items), edit names, prices, and descriptions

---

## Deployment

### Option A: Vercel (Recommended — full Next.js support)

1. Push code to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Use a hosted Postgres (Vercel Postgres, Neon, Supabase, Railway)
5. Set `NEXT_PUBLIC_SITE_URL` to your Vercel domain
6. Register Stripe webhook URL: `https://your-vercel-app.vercel.app/api/webhook`

### Option B: Cloudflare Pages + Workers (with caveats)

> **Important:** Next.js App Router on Cloudflare requires the `@cloudflare/next-on-pages` adapter and has limitations:
> - Server Actions and some Node.js APIs are not supported
> - Prisma requires Prisma Accelerate or PgBouncer with edge-compatible drivers
> - Stripe webhooks work fine as Edge functions
>
> **Recommended setup for Cloudflare:**

1. Install the adapter:
```bash
npm install @cloudflare/next-on-pages
npm install -D wrangler
```

2. Update `next.config.js`:
```js
const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev');
if (process.env.NODE_ENV === 'development') setupDevPlatform();
module.exports = { /* your config */ };
```

3. Create `wrangler.toml`:
```toml
name = "shaka-hawaiian-bbq"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"
```

4. Switch Prisma to Prisma Accelerate (edge-compatible):
   - Sign up at [prisma.io/accelerate](https://www.prisma.io/data-platform/accelerate)
   - Get a connection string and replace `DATABASE_URL`

5. Build and deploy:
```bash
npx @cloudflare/next-on-pages
npx wrangler pages deploy .vercel/output/static
```

6. Set environment variables in Cloudflare Pages dashboard

7. Register your webhook at:
   `https://your-project.pages.dev/api/webhook`

### Option C: Docker + VPS (most control)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t shaka-bbq .
docker run -p 3000:3000 --env-file .env shaka-bbq
```

---

## Customer Flow

```
Homepage → Browse Menu → Add to Cart → Checkout Form
→ Stripe Checkout (hosted) → Payment → Stripe Webhook
→ Order marked PAID → Confirmation Page
```

## Environment Variables Reference

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...` or `sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) |
| `NEXT_PUBLIC_SITE_URL` | Full URL of site (no trailing slash), e.g. `https://yourdomain.com` |
| `ADMIN_PASSWORD` | Admin dashboard password |

---

## Notes

- **Hours** are not displayed as they were not provided — the UI shows "Ask in store"
- All prices are sourced exclusively from the provided MENU.json
- No external images are used
- The cart persists across page reloads via Zustand + localStorage
