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