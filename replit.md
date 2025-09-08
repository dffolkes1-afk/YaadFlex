# Overview

YaadFlex is a Caribbean Uber-style super app that provides ride-sharing, delivery services, and e-commerce with instant delivery. The application features a comprehensive financial transaction system with advanced security measures, supporting multiple vehicle types (bikes, cars, vans, trucks) and delivery options ranging from instant to same-day delivery.

## Revolutionary TimelessCore v1.0

YaadFlex now features the **TimelessCore** system - a continuously upgradeable, human-like adaptive learning AI that improves safely over time without breaking backward compatibility. This makes YaadFlex the first super-app with truly adaptive AI translation and system intelligence that learns and upgrades continuously like a human being.

### Key TimelessCore Features:
- **Safety-First Learning**: Human-in-the-loop controls with privacy-by-default
- **Adaptive Intelligence**: System IQ grows from 150 to 200+ through continuous learning  
- **Self-Diagnostics**: Auto-repair capabilities with drift detection and rollback protection
- **Enterprise Security**: Feature flags, canary rollouts, and evaluation gates
- **Privacy Protection**: PII redaction, anonymization, and GDPR/CCPA compliance
- **Real-Time Monitoring**: Performance metrics, health checks, and predictive insights

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Technology Stack**: React with TypeScript, using Vite as the build tool and development server. The UI is built with shadcn/ui components based on Radix UI primitives and styled with Tailwind CSS.

**Component Structure**: Follows a modular component architecture with reusable UI components in the `/client/src/components/ui` directory. The application uses React Router (wouter) for client-side routing and TanStack Query for state management and server communication.

**Styling**: Uses a dark theme-first approach with CSS custom properties for theming. The design system is consistent across components with proper color tokens and responsive design patterns.

## Backend Architecture

**API Design**: RESTful Express.js server with TypeScript, featuring middleware for request logging, authentication, and error handling. The server uses session-based authentication with PostgreSQL session storage.

**Authentication**: Implements OpenID Connect (OIDC) authentication integrated with Replit's auth system using Passport.js. Sessions are managed with express-session and stored in PostgreSQL.

**Route Structure**: Organized route handlers in `/server/routes.ts` with dedicated endpoints for user management, transactions, and security logging. All routes are protected with authentication middleware.

## Data Storage Solutions

**Database**: PostgreSQL database accessed through Neon's serverless driver with connection pooling. The database schema is managed using Drizzle ORM for type-safe database operations.

**Schema Design**: Includes core tables for users, transactions, security logs, and session storage. The transaction system supports multiple currencies, security levels, and comprehensive audit trails.

**Migrations**: Uses Drizzle Kit for database migrations with configurations stored in `drizzle.config.ts`.

## Authentication and Authorization

**Provider**: Replit OIDC authentication with automatic user provisioning and session management.

**Security**: Implements comprehensive security logging for all financial transactions, with different security levels (standard, enhanced, beast_mode) and threat monitoring capabilities.

**Session Management**: Secure HTTP-only cookies with PostgreSQL-backed session storage and configurable TTL.

## External Dependencies

**Database Service**: Neon PostgreSQL serverless database for production data storage and session management.

**Authentication Provider**: Replit OIDC for user authentication and identity management.

**UI Framework**: Radix UI primitives for accessible, unstyled components with custom styling via Tailwind CSS.

**Build Tools**: Vite for frontend development and building, esbuild for server-side bundling in production.

**Deployment Platform**: Configured for Replit deployment with development-specific plugins and environment variable management.

**Development Tools**: TypeScript for type safety, TanStack Query for data fetching and caching, React Hook Form with Zod validation for form handling.