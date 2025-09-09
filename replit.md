# YaadFlex - Global Total Economy Super-App

## Overview

YaadFlex is a comprehensive super-app born in Jamaica with global ambitions. It's a total economy platform that combines ride-sharing, P2P wallet services, marketplace functionality, and more into a single unified application. The project features an innovative multi-currency system, voice-first accessibility, real-time translation capabilities, and cultural authenticity across different countries. The architecture supports everything from basic ride booking to complex business registration, workforce management, and global commerce.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React and TypeScript, utilizing Vite as the build tool. The application follows a component-driven architecture with:
- **UI Framework**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with CSS variables for dynamic theming
- **State Management**: TanStack Query for server state and React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **3D Graphics**: React Three Fiber for 3D world emblems and animations
- **PWA Support**: Service worker implementation for offline functionality

### Backend Architecture
The backend uses Express.js with TypeScript in an ESM environment:
- **API Design**: RESTful endpoints with consistent error handling
- **Database Layer**: Drizzle ORM for type-safe database operations
- **Real-time Communication**: WebSocket integration for CB Radio functionality
- **Authentication**: Replit Auth with session management
- **File Structure**: Modular route organization with shared schema definitions

### Multi-Currency & Payment System
A sophisticated financial architecture supporting:
- **KWD/YFD**: Primary wallet currencies with global exchange
- **Payment Methods**: Stripe integration for cards, digital wallets, mobile money
- **Real-time Rates**: Dynamic currency conversion with multiple providers
- **Transaction Security**: Multi-factor authentication and security logging

### Translation & Accessibility Core
Voice-first design with comprehensive accessibility:
- **AI Translation**: Real-time text and voice translation across languages
- **Cultural Adaptation**: Country-specific themes, languages, and dialects
- **Accessibility Features**: Screen reader support, haptic feedback, live captions
- **Voice Commands**: Complete voice-driven interface capabilities

### Real-time Systems
- **CB Radio Network**: WebSocket-based communication for drivers
- **Live Tracking**: Real-time location updates and trip monitoring
- **Chat Translation**: Multi-language chat with automatic translation
- **Notifications**: Real-time updates across all platform features

### Workforce Management
Enterprise-grade workforce solutions:
- **Job Management**: Posting, applications, and assignments
- **Equipment Tracking**: Inventory management with check-in/out systems
- **Company Profiles**: Multi-company support with role-based access
- **Immigration Services**: Document management and legal case tracking

### Timeless AI Learning System
Continuous improvement architecture:
- **Learning Signals**: User feedback collection for AI improvement
- **Safety-First Design**: Privacy protection with consent requirements
- **Adaptive Optimization**: System self-improvement based on usage patterns
- **Version Control**: Model versioning with rollback capabilities

## External Dependencies

### Database & Storage
- **PostgreSQL**: Primary database via Neon serverless
- **Drizzle ORM**: Type-safe database operations and migrations
- **Session Storage**: PostgreSQL-based session management for Replit Auth

### Payment & Financial Services
- **Stripe**: Payment processing for cards and digital wallets
- **Neon Database**: Serverless PostgreSQL for financial data
- **Multi-currency APIs**: Exchange rate providers for real-time conversion

### Communication & Translation
- **SendGrid**: Email communication system
- **WebSocket Server**: Real-time chat and CB Radio functionality
- **Voice APIs**: Speech recognition and text-to-speech services
- **Translation Services**: AI-powered language translation

### Authentication & Security
- **Replit Auth**: OIDC-based authentication system
- **Passport.js**: Authentication middleware
- **Session Management**: Secure session handling with PostgreSQL storage

### Development & Deployment
- **Vite**: Frontend build tool and development server
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Backend bundling for production
- **Service Workers**: PWA functionality for offline support

### UI & Experience
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **React Three Fiber**: 3D graphics and animations
- **Lucide Icons**: Consistent iconography throughout the app