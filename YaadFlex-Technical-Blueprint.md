# YaadFlex – Technical Blueprint

**Owner:** Dwayne Ffolkes  
**Product:** YaadFlex Global Vybz (Caribbean super-app)  
**Status:** Jamaica-first demo (rides + delivery + wallet) ready to implement; global-ready roadmap below.  
**Philosophy:** 85% driver/worker earnings, transparent fees, safety-first automation.

---

## 1) Product Overview

YaadFlex is an all-in-one platform for:
- **Mobility:** ride-hailing (red plate urban / curated white plate rural), errands, deliveries.
- **Workforce:** job marketplace (construction + freelancers) with hiring & payouts.
- **Commerce:** shops/malls online, equipment rentals, vehicle marketplace.
- **Communication:** voice UX (accessible), chat/translation, Teen Vybz social layer.
- **Finance:** multi-currency wallet (JMD/USD/YFX), QR pay, cash-in/out, driver/worker payouts.

**Key Differentiators**
- Voice-first + accessibility for the blind.
- Built-in AI translator (chat in your language, others see theirs).
- Self-healing DevRep agent (observability → propose patch → PR → canary → rollback).
- Unified payout tunnel (drivers + workers share the same wallet engine).

---

## 2) Architecture (High Level)

```
[ Web App (React/Vite/Tailwind/shadcn) ]
|
v
[ API Gateway / Express + Zod ]
|
+-- Auth (OIDC/JWT, role-based ACL)
+-- Payments (Wallet + Processor integrations)
+-- Domains: rides, delivery, jobs, marketplace, social
|
v
[ PostgreSQL (Neon/Cloud) + Drizzle ORM ]
|
+-- Queues (BullMQ/Redis) for async jobs
+-- Object Storage (images/docs) (S3/Cloudflare R2)
|
v
[ Observability: logs/metrics/traces (OpenTelemetry + Grafana/Prom)]
|
v
[ DevRep Agent (LLM tool-use) -> Repo/CI/Monitor/Sec scanners ]
```

**Environments**
- `dev` (Replit/local), `staging` (preview deploy + test data), `prod` (locked, approvals required).

---

## 3) Tech Stack

- **Frontend:** React + TypeScript, Vite, shadcn/ui, Tailwind, TanStack Query, React Hook Form + Zod.
- **Backend:** Node/Express + TypeScript, Drizzle ORM, PostgreSQL (Neon), BullMQ + Redis.
- **Auth:** OIDC/JWT (Clerk/Auth0/Replit OIDC), RBAC middleware.
- **Payments:** Internal Wallet (JMD/USD/YFX) + external rails (Stripe/PayPal/Local bank partner).
- **Realtime:** WebSockets or SSE for live jobs/driver location.
- **Maps/Geo:** Mapbox or Google Maps SDK, geofencing + pricing zones.
- **Files:** S3/R2 for images (IDs, vehicle pics, receipts).
- **Infra:** Replit (dev), Fly.io/Vercel/Render (staging/prod) or Replit Teams Deploy.
- **Obs/Sec:** OpenTelemetry, Semgrep, Dependabot/Snyk, GitHub Actions CI.

---

## 4) Core Domains & Minimal Schemas (Drizzle-style)

> Tables are simplified; extend as needed.

### 4.1 Users & Roles
- `users(id, email, displayName, role: "customer|driver|worker|merchant|admin", isActive, createdAt)`
- `profiles(userId, phone, photoUrl, locale, kycStatus)`

### 4.2 Wallet & Payments
- `wallets(id, userId, createdAt)`
- `wallet_balances(walletId, currency, amount, updatedAt)` (PK: walletId+currency)
- `wallet_tx(id, type, currency, amount, fee, fromWalletId?, toWalletId?, externalRef?, meta, status, createdAt)`
- `payment_requests(id, merchantWalletId, currency, amount, description, expiresAt, status)`
- `payout_methods(id, walletId, kind, label, details, isDefault, createdAt)`
- `fx_rates(pair, rate, updatedAt)`
- `coin_denominations(code, value, face, theme, artworkUrl)` // YardFlex coins up to 2000

**Commission Flow (Ride = 2000 JMD, 15% fee)**
1) House → Revenue: 300 JMD  
2) House → Driver: 1700 JMD

### 4.3 Rides & Delivery
- `drivers(id, userId, status, rating, carMake, carModel, plateType:"red|white", plateNo, insuranceExp, fitnessExp, docs)`
- `rides(id, riderId, driverId, pickup, dropoff, distanceKm, eta, priceJMD, status:"requested|accepted|arrived|in_progress|completed|cancelled", createdAt, completedAt)`
- `ride_events(id, rideId, type, payload, ts)` // audit trail
- `delivery_orders(id, senderId, courierId, pickup, dropoff, weight, priceJMD, status, createdAt)`

**Pricing Policy**
- Base fare by zone + per-km + per-minute.
- Addons: waiting time, extra stops, night fee, "party rush" premium (capped).
- JMD primary; FX overlay for USD if needed.

### 4.4 Jobs & Workforce
- `companies(id, name, email, phone, address, industry, isActive)`
- `jobs(id, companyId, title, description, category, location, payRate, payType, skillLevel, equipmentRequired[], status, startDate, endDate)`
- `workers(id, firstName, lastName, email, phone, skills[], experienceLevel, location, hourlyRate, isAvailable, rating, bio)`
- `job_applications(id, jobId, workerId, status, appliedAt, message)`
- `job_assignments(id, jobId, workerId, status, assignedAt, notes)`

### 4.5 Marketplace (Vehicles/Equipment)
- `vehicle_listings(id, sellerId, make, model, year, price, mileage, condition, fuelType, transmission, location, images[], description, isActive)`
- `equipment_hubs(id, name, address, phone, email, operatingHours, equipment[], isActive)`
- `equipment_checkouts(id, workerId, hubId, jobId, equipmentName, checkedOutAt, returnedAt, status, condition, notes)`

### 4.6 Social & Translation
- `posts(id, userId, kind:"photo|short_video|text", mediaUrl?, caption, visibility, createdAt)`
- `comments(id, postId, userId, text, createdAt)`
- `translations(id, sourceText, srcLang, dstLang, translatedText, createdAt)` // caching
- **Teen Vybz**: age-gated communities, mod tools, content filters.

---

## 5) API Surface (Express + Zod)

**Auth**
- `POST /api/auth/login`, `POST /api/auth/refresh`
- `GET /api/me`

**Wallet**
- `POST /api/wallets` (create for user)
- `GET /api/wallets/:id/balances`
- `GET /api/wallets/:id/tx`
- `POST /api/wallets/:id/deposit`
- `POST /api/wallets/transfer`
- `POST /api/payment-requests`
- `POST /api/payment-requests/:id/pay`
- `POST /api/payout-methods`
- `POST /api/payouts` (initiate cash-out; async job)

**Rides**
- `POST /api/rides/request`
- `POST /api/rides/:id/accept` (driver)
- `POST /api/rides/:id/status` (arrived|in_progress|completed|cancelled)
- `GET /api/rides/:id`
- WebSocket: driver location, ETA, live status.

**Delivery**
- `POST /api/deliveries`
- `POST /api/deliveries/:id/assign`
- `POST /api/deliveries/:id/status`
- `GET /api/deliveries/:id`

**Jobs**
- `POST /api/jobs`
- `GET /api/jobs?status=open&skill=...`
- `POST /api/jobs/:id/apply`
- `POST /api/jobs/:id/assign/:workerId`

**Marketplace**
- `POST /api/vehicles`, `GET /api/vehicles`, `GET /api/vehicles/:id`

**Admin/CEO**
- `GET /api/admin/obligations` (insurance/licensing/renewals)
- `POST /api/admin/run-payables` (push-to-pay, requires approval)
- `POST /api/admin/toggles` (feature flags)

---

## 6) Security, Compliance & Roles

**RBAC**
- `admin` (CEO ops, approvals, kill-switch), `devlead`, `merchant`, `driver`, `worker`, `customer`.

**KYC/AML**
- Tiered KYC: Basic (low limits), Plus, Pro (higher limits).
- Sanctions screening via payment partner where required.
- **Logs:** all payments & approvals auditable.

**PII/Sec**
- Secrets vault, key rotation.
- JWT short TTL + refresh.
- Rate limiting + bot protection on wallet routes.

---

## 7) Pricing & Earnings

- **Driver/Worker earnings:** target **85%** of net, platform takes **≤15%** (transparent).
- Dynamic addons: waiting time, extra passengers, area premium (fair caps).
- Promotions/Rewards: `reward_points` bank (convertible to rides/discounts).

---

## 8) Realtime & Geo

- Driver location updates through WS (throttled, e.g., 1–2s).
- Geofencing for zones (urban/rural policy differences).
- Surge-like multipliers for peak events (cap to protect users).

---

## 9) DevRep Agent (Self-Healing)

**Signals → Plan → PR → Canary → Rollback**
- Watches error rate/p95 latency; proposes patches with citations.
- Auto PR for low-risk; approvals required for high-risk.
- Canary 5% traffic, auto rollback on SLO breach.

**Audits**
- Every change logged with diff, build link, metrics.

---

## 10) Deployment & Environments

- **Dev:** Replit (preview URL), local `.env`.
- **Staging:** seed demo data, QA test runs, Semgrep scan.
- **Prod:** protected branch, approvals; infra as code (Pulumi/Terraform optional).

**Build commands**
```bash
npm i
npm run db:generate && npm run db:migrate
npm run build
npm run start
```

---

## 11) Domain & Email

**Domains:** yardflex.com, yaadflex.com, yardflexglobal.com (buy when ready).
**Email:** Google Workspace; aliases for support, ops, payouts.

---

## 12) Roadmap (90 Days)

**Phase 1 (Weeks 1–3):** Wallet (JMD + YFX), rides MVP, driver onboarding, QR payments.
**Phase 2 (Weeks 4–6):** Delivery MVP, CEO dashboard obligations, payouts (local bank partner).
**Phase 3 (Weeks 7–9):** Jobs marketplace workflows + marketplace listings.
**Phase 4 (Weeks 10–12):** Translator/voice UX, Teen Vybz beta, DevRep agent alpha.

---

## 13) Quickstart Commands

```bash
# backend
npm i express cors zod dotenv pg drizzle-orm drizzle-kit bullmq ioredis
echo 'export default { schema: "./src/db/**/*.ts", out: "./drizzle" }' > drizzle.config.ts
npx drizzle-kit generate && npx drizzle-kit migrate
npm run dev

# frontend
npm create vite@latest yaadflex -- --template react-ts
cd yaadflex && npm i @tanstack/react-query zod react-hook-form tailwindcss
```

---

## 14) Success Criteria

- Sub-10s ride matching in urban zones; <2% failed payments; 99.5% uptime.
- 85% net earnings realized by drivers/workers.
- CEO dashboard shows zero overdue obligations (insurance/taxes/licensing).
- Positive accessibility feedback from blind users (voice-first flows).

---

## 15) Contacts

**Owner:** Dwayne Ffolkes  
**Support:** support@yardflex.com (alias)  
**Ops/Approvals:** ops@yardflex.com

### **Frontend Stack**
- **Framework:** React 18 + TypeScript + Vite
- **UI System:** Ultra-minimal design (black/white/gray + green YF branding only)
- **Components:** Radix UI + shadcn/ui + Tailwind CSS
- **Routing:** Wouter (lightweight client-side routing)
- **State:** TanStack Query v5 + React hooks
- **Voice:** Speech recognition + text-to-speech integration
- **3D:** React Three Fiber for world emblems

### **Backend Stack**
- **Runtime:** Node.js + Express.js + TypeScript (ESM)
- **Database:** PostgreSQL (Neon serverless) + Drizzle ORM
- **Auth:** Replit Auth (OIDC) + Passport.js + session management
- **Real-time:** WebSocket server for CB Radio & live tracking
- **Payments:** Stripe integration for cards/wallets
- **Communication:** SendGrid for email, voice APIs for accessibility

### **Core Services Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Voice Layer   │    │  Frontend App   │    │  Admin Portal   │
│  (Accessibility)│    │   (Customer)    │    │   (Business)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
              ┌─────────────────────────────────────┐
              │           API Gateway               │
              │      (Express.js Routes)            │
              └─────────────────────────────────────┘
                                 │
    ┌────────────┬────────────────┼────────────────┬────────────┐
    │            │                │                │            │
┌───▼───┐   ┌───▼───┐        ┌───▼───┐        ┌───▼───┐   ┌───▼───┐
│ Rides │   │Wallet │        │Social │        │ Jobs  │   │Logistics│
│Service│   │Service│        │Service│        │Service│   │ Service │
└───────┘   └───────┘        └───────┘        └───────┘   └─────────┘
    │            │                │                │            │
    └────────────┴────────────────┼────────────────┴────────────┘
                                  │
              ┌─────────────────────────────────────┐
              │         PostgreSQL Database         │
              │       (Neon Serverless)             │
              └─────────────────────────────────────┘
```

---

## 3) Core Features & Implementation

### **A) Mobility System**
- **Ride Booking:** Customer app → driver matching → GPS tracking → payment
- **Red Plate (Urban):** Licensed taxis with professional drivers
- **White Plate (Curated):** Vetted rural drivers for community transport
- **Delivery:** Food, packages, errands with real-time tracking
- **Smart Dispatch:** AI-powered ride assignment based on earnings optimization

### **B) YaadWallet Financial Engine**
```typescript
// Multi-currency wallet schema
interface WalletAccount {
  userId: string;
  currencies: {
    JMD: { balance: number; pending: number };
    USD: { balance: number; pending: number };
    YFX: { balance: number; pending: number }; // YaadFlex loyalty currency
  };
  transactions: Transaction[];
  payoutMethods: PayoutMethod[];
}
```

**Features:**
- Real-time currency conversion (JMD ↔ USD ↔ YFX)
- QR code payments for merchants
- Cash-in/cash-out at partner locations
- 85% driver earnings auto-deposit
- Worker payouts for construction/freelance jobs

### **C) Voice-First Accessibility**
- **Complete Voice Control:** "Book ride to Half Way Tree"
- **Screen Reader Integration:** Full accessibility compliance
- **Hands-Free Operation:** Critical for drivers while driving
- **Multi-Language:** Voice commands in English, Patois, Spanish

### **D) Social Platform (Teen Vybz)**
- **Real-time Translation:** Post in Patois, others see English/Spanish
- **Heritage Delivery:** Cultural food/items with social sharing
- **Community Features:** Local events, ride sharing, marketplace
- **Safety:** Moderation tools, reporting system

### **E) Workforce Management**
- **Job Marketplace:** Construction, freelance, gig work
- **Skills Verification:** Portfolio, reviews, certifications
- **Equipment Rental:** Tools, vehicles, machinery
- **Unified Payouts:** Same wallet system as drivers

---

## 4) Database Schema (Core Tables)

```sql
-- Users & Authentication
users (id, replit_user_id, profile_data, created_at)
user_profiles (user_id, type, skills, verification_status)

-- Mobility
rides (id, customer_id, driver_id, pickup, destination, fare, status)
vehicles (id, driver_id, plate_type, verification_docs)
drivers (user_id, license, background_check, earnings_total)

-- Financial
wallet_accounts (user_id, currency_balances, payout_methods)
transactions (id, from_user, to_user, amount, currency, type)
exchange_rates (from_currency, to_currency, rate, timestamp)

-- Social & Communication
posts (id, user_id, content, translations, media_urls)
messages (id, from_user, to_user, content, translated_content)

-- Jobs & Workforce
job_postings (id, company_id, title, requirements, pay_rate)
job_applications (job_id, worker_id, status, portfolio)
equipment_rentals (id, owner_id, item_type, rate, availability)

-- Business Management
companies (id, owner_id, business_type, verification_status)
company_vehicles (company_id, vehicle_id, gps_tracking)
```

---

## 5) Real-Time Systems

### **GPS Tracking & Live Updates**
- **WebSocket Connection:** Live ride tracking, driver locations
- **Geofencing:** Pickup/dropoff notifications
- **Route Optimization:** Traffic-aware routing
- **Safety Features:** Emergency button, trip sharing

### **CB Radio Network**
- **Driver Communication:** Channel-based chat for drivers
- **Translation Layer:** Multi-language driver coordination
- **Emergency Broadcast:** System-wide alerts

### **Autonomous Operations**
- **Self-Healing:** Auto-detection and fixing of system issues
- **Smart Dispatch:** AI-powered ride assignment
- **Load Balancing:** Dynamic resource allocation
- **Monitoring:** Real-time system health dashboard

---

## 6) Payment & Financial Infrastructure

### **Stripe Integration**
- **Payment Methods:** Cards, digital wallets, mobile money
- **Payout System:** Instant driver/worker payments
- **Fee Structure:** Transparent 15% platform fee (driver keeps 85%)
- **Multi-Currency:** Support for JMD, USD, YFX conversion

### **Cash Economy Integration**
- **Cash-In Points:** Partner locations for wallet top-ups
- **Cash-Out Network:** ATM-like withdrawal system
- **QR Payments:** Merchant payments without cards
- **Remittance:** International money transfers

---

## 7) Security & Compliance

### **Authentication & Authorization**
- **Replit Auth:** OIDC-based secure authentication
- **Role-Based Access:** Driver, customer, business, admin roles
- **Session Management:** PostgreSQL-backed secure sessions
- **API Security:** Request validation with Zod schemas

### **Data Protection**
- **Privacy Controls:** GDPR-compliant data handling
- **Encryption:** End-to-end for sensitive communications
- **Audit Trails:** Complete transaction and action logging
- **Backup & Recovery:** Automated data protection

---

## 8) Scalability & Performance

### **Infrastructure**
- **Serverless Database:** Neon PostgreSQL auto-scaling
- **CDN Integration:** Global asset delivery
- **Load Balancing:** Automatic traffic distribution
- **Caching Strategy:** Redis for session and frequently accessed data

### **Monitoring & Observability**
- **Real-time Metrics:** System performance tracking
- **Error Tracking:** Automated issue detection and reporting
- **User Analytics:** Usage patterns and optimization insights
- **DevRep Agent:** AI-powered system maintenance

---

## 9) Deployment & DevOps

### **Current Environment**
- **Platform:** Replit infrastructure
- **CI/CD:** Automated testing and deployment
- **Environment Management:** Development, staging, production
- **Monitoring:** Real-time system health and performance

### **Scaling Strategy**
- **Geographic Expansion:** Caribbean → North America → Global
- **Feature Rollout:** Core features → advanced features → AI enhancements
- **Infrastructure:** Auto-scaling based on demand

---

## 10) Business Model & Economics

### **Revenue Streams**
- **Ride Commissions:** 15% of ride fares (driver keeps 85%)
- **Delivery Fees:** Service fees for package/food delivery
- **Marketplace Commissions:** Vehicle sales, equipment rentals
- **Premium Features:** Advanced business analytics, priority support
- **Currency Exchange:** Small spread on multi-currency transactions

### **Unit Economics**
- **Driver Earnings:** 85% of gross fare (industry-leading)
- **Platform Fee:** 15% covers operations, support, technology
- **Customer Acquisition:** Organic growth through driver/worker network
- **Retention:** High due to superior earnings and user experience

---

## 11) Roadmap & Expansion

### **Phase 1: Jamaica Launch (Current)**
- Core ride-hailing with red/white plate system
- Basic wallet with JMD/USD support
- Heritage delivery service
- Voice accessibility features

### **Phase 2: Caribbean Expansion**
- Multi-country deployment (Barbados, Trinidad, Cayman)
- Local currency integration
- Regional logistics network
- Cross-border remittance

### **Phase 3: Global Platform**
- North American markets
- Advanced AI features
- Corporate fleet management
- International freight coordination

---

## 12) Technical Specifications

### **Performance Requirements**
- **Response Time:** < 200ms for core API calls
- **Uptime:** 99.9% availability target
- **Scalability:** Support 100K+ concurrent users
- **Real-time:** < 100ms latency for live tracking

### **Compatibility**
- **Mobile:** iOS 14+, Android 8+
- **Web:** Modern browsers (Chrome, Firefox, Safari, Edge)
- **Accessibility:** WCAG 2.1 AA compliance
- **Languages:** English, Patois, Spanish (expandable)

---

**YaadFlex represents the next evolution of super-apps: culturally rooted, globally scalable, voice-first, and fundamentally fair to all participants.**

*Built with React/TypeScript + Express/Node.js + PostgreSQL + Stripe on Replit infrastructure*