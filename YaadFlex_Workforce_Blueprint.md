# YaadFlex Global Vybz - Workforce Management System Blueprint

## System Overview

YaadFlex Global Vybz is an elite Caribbean workforce management super-app that handles comprehensive job creation, worker/supervisor hiring and management, equipment rental hubs, email-based coordination, talent acquisition, and global vehicle marketplace integration.

## Database Schema

### Core Tables

#### Companies
```sql
companies {
  id: string (primary key)
  name: string
  email: string (unique)
  phone: string
  address: string
  industry: string
  isActive: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Jobs
```sql
jobs {
  id: string (primary key)
  companyId: string (foreign key)
  title: string
  description: text
  category: enum ('maintenance', 'cleanup', 'construction', 'other')
  location: string
  payRate: decimal
  payType: enum ('hourly', 'daily', 'project', 'weekly')
  skillLevel: enum ('beginner', 'intermediate', 'advanced', 'expert')
  equipmentRequired: string[]
  isUrgent: boolean
  status: enum ('open', 'filled', 'in_progress', 'completed', 'cancelled')
  startDate: timestamp
  endDate: timestamp
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Workers
```sql
workers {
  id: string (primary key)
  firstName: string
  lastName: string
  email: string (unique)
  phone: string
  skills: string[]
  experienceLevel: enum ('beginner', 'intermediate', 'advanced', 'expert')
  location: string
  hourlyRate: decimal
  isAvailable: boolean
  rating: decimal (0-5)
  profilePicture: string
  bio: text
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Supervisors
```sql
supervisors {
  id: string (primary key)
  companyId: string (foreign key)
  firstName: string
  lastName: string
  email: string (unique)
  phone: string
  department: string
  isActive: boolean
  hiredDate: timestamp
  salary: decimal
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Equipment Hubs
```sql
equipmentHubs {
  id: string (primary key)
  name: string
  address: string
  phone: string
  email: string
  operatingHours: string
  equipment: string[]
  isActive: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Equipment Checkouts
```sql
equipmentCheckouts {
  id: string (primary key)
  workerId: string (foreign key)
  hubId: string (foreign key)
  jobId: string (foreign key)
  equipmentName: string
  checkedOutAt: timestamp
  returnedAt: timestamp
  status: enum ('checked_out', 'returned', 'overdue')
  condition: enum ('excellent', 'good', 'fair', 'poor')
  notes: text
}
```

#### Job Applications
```sql
jobApplications {
  id: string (primary key)
  jobId: string (foreign key)
  workerId: string (foreign key)
  status: enum ('pending', 'accepted', 'rejected')
  appliedAt: timestamp
  message: text
}
```

#### Job Assignments
```sql
jobAssignments {
  id: string (primary key)
  jobId: string (foreign key)
  workerId: string (foreign key)
  assignedAt: timestamp
  status: enum ('assigned', 'in_progress', 'completed', 'cancelled')
  notes: text
}
```

#### Vehicle Listings
```sql
vehicleListings {
  id: string (primary key)
  sellerId: string (foreign key -> users)
  make: string
  model: string
  year: integer
  price: decimal
  mileage: integer
  condition: enum ('excellent', 'good', 'fair', 'poor')
  fuelType: enum ('gasoline', 'diesel', 'electric', 'hybrid')
  transmission: enum ('manual', 'automatic')
  location: string
  images: string[]
  description: text
  isActive: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Email Communications
```sql
emailCommunications {
  id: string (primary key)
  fromUserId: string (foreign key)
  toUserId: string (foreign key)
  jobId: string (foreign key)
  subject: string
  body: text
  sentAt: timestamp
  isRead: boolean
}
```

## API Endpoints

### Company Management
- `POST /api/companies` - Create company
- `GET /api/companies` - List all companies
- `GET /api/companies/:id` - Get company details
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company

### Job Management
- `POST /api/jobs` - Create job posting
- `GET /api/jobs` - List all jobs (with filters)
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `POST /api/jobs/:id/apply` - Apply for job

### Worker Management
- `POST /api/workers` - Register worker
- `GET /api/workers` - List all workers (with filters)
- `GET /api/workers/:id` - Get worker profile
- `PUT /api/workers/:id` - Update worker profile
- `DELETE /api/workers/:id` - Remove worker
- `POST /api/workers/:id/hire` - Hire worker for job
- `POST /api/workers/:id/fire` - Fire worker from job

### Supervisor Management
- `POST /api/supervisors` - Hire supervisor
- `GET /api/supervisors` - List company supervisors
- `GET /api/supervisors/:id` - Get supervisor details
- `PUT /api/supervisors/:id` - Update supervisor
- `DELETE /api/supervisors/:id` - Fire supervisor

### Equipment Hub Management
- `POST /api/equipment-hubs` - Create equipment hub
- `GET /api/equipment-hubs` - List all hubs
- `GET /api/equipment-hubs/:id` - Get hub details
- `PUT /api/equipment-hubs/:id` - Update hub
- `POST /api/equipment-hubs/:hubId/checkout` - Checkout equipment
- `POST /api/equipment-hubs/:hubId/return` - Return equipment
- `GET /api/equipment-checkouts` - List checkouts

### Vehicle Marketplace
- `POST /api/vehicles` - List vehicle for sale
- `GET /api/vehicles` - Browse vehicles (with filters)
- `GET /api/vehicles/:id` - Get vehicle details
- `PUT /api/vehicles/:id` - Update vehicle listing
- `DELETE /api/vehicles/:id` - Remove vehicle listing

### Email System
- `POST /api/emails/send` - Send email
- `GET /api/emails` - Get user's emails
- `GET /api/emails/:id` - Get email details
- `PUT /api/emails/:id/read` - Mark email as read

### Analytics
- `GET /api/analytics/company/:id` - Company performance metrics
- `GET /api/analytics/jobs` - Job market statistics
- `GET /api/analytics/workers` - Worker performance data

## Frontend Pages

### Main Navigation
- `/` - Home page with workforce management section
- `/workforce` - Workforce Dashboard (main command center)
- `/post-job` - Job Posting form

### Key Components

#### Workforce Dashboard (`/workforce`)
- **Company Management Panel** - View and manage companies
- **Active Jobs Overview** - Real-time job status tracking
- **Worker Management** - Hire/fire workers, view profiles
- **Supervisor Control** - Manage supervisors by company
- **Equipment Hub Monitor** - Track equipment checkouts/returns
- **Vehicle Marketplace** - Browse and manage vehicle listings
- **Analytics Dashboard** - Performance metrics and insights

#### Job Posting Form (`/post-job`)
- **Job Details Form** - Title, description, category
- **Requirements Section** - Skills, experience level
- **Location & Pay** - Work location, pay rate/type
- **Equipment Needs** - Required tools/equipment
- **Urgency Settings** - Mark as urgent if needed

## Key Features

### 1. **Comprehensive Job Management**
- Create maintenance, cleanup, construction jobs
- Set pay rates (hourly, daily, project, weekly)
- Specify skill levels and equipment requirements
- Mark jobs as urgent for priority handling

### 2. **Advanced Worker System**
- Worker profiles with skills and experience levels
- Rating system (0-5 stars)
- Availability tracking
- Hire/fire functionality with full control

### 3. **Supervisor Management**
- Company-based supervisor assignment
- Department-specific organization
- Salary tracking and active status

### 4. **Equipment Hub Network**
- Multiple rental locations
- Operating hours management
- Equipment checkout/return tracking
- Condition monitoring and notes

### 5. **Email Coordination System**
- Built-in messaging for job assignments
- Worker-company communication
- Job-specific email threads

### 6. **Talent Acquisition**
- Skill-based worker search
- Location and experience filtering
- Application and assignment workflow

### 7. **Vehicle Marketplace**
- Global car and truck listings
- Detailed vehicle specifications
- Image galleries and descriptions
- Location-based browsing

### 8. **Analytics & Reporting**
- Company performance metrics
- Job completion rates
- Worker productivity tracking
- Equipment utilization statistics

## System Architecture

### Backend
- **Express.js** server with TypeScript
- **PostgreSQL** database with Drizzle ORM
- **Neon** serverless database hosting
- **Replit Authentication** with OpenID Connect
- **RESTful API** design with proper error handling

### Frontend
- **React** with TypeScript
- **Vite** for build tooling and development
- **TanStack Query** for data fetching and caching
- **Wouter** for client-side routing
- **shadcn/ui** components with Tailwind CSS
- **Responsive design** with mobile-first approach

### Key Integrations
- **Authentication**: Replit OIDC with session management
- **Database**: PostgreSQL with connection pooling
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: React Query for server state
- **Form Handling**: React Hook Form with Zod validation

## User Workflows

### 1. **Post a Job**
1. Navigate to `/post-job`
2. Fill out job details form
3. Set requirements and pay rate
4. Submit and job becomes available for applications

### 2. **Hire a Worker**
1. Browse available workers on dashboard
2. Review profiles, skills, and ratings
3. Send job offer or direct assignment
4. Track worker progress and performance

### 3. **Manage Equipment**
1. Set up equipment hubs with inventory
2. Workers checkout required tools for jobs
3. Track equipment usage and condition
4. Process returns and maintenance

### 4. **Vehicle Marketplace**
1. List vehicles with detailed specifications
2. Browse by make, model, price, location
3. View detailed listings with images
4. Contact sellers directly

This comprehensive system makes YaadFlex Global Vybz the most elite Caribbean workforce management platform, handling everything from job creation to equipment management to vehicle sales in one integrated super-app.