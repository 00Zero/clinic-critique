# Healthcare Complaint Portal

## Overview

This is a healthcare complaint submission system that allows patients to report issues with medical practices' booking systems, communication, and back office operations. The application features a multi-step form for collecting complaint details, patient information, and clinic information, then forwards the data to an n8n automation workflow for processing.

The system is built as a full-stack web application with React frontend and Express backend, designed to help improve patient experiences by providing a structured way to report and address healthcare service issues.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system using CSS variables
- **State Management**: React Hook Form for form state, TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **Form Validation**: Zod schemas with React Hook Form resolvers

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful API with structured error handling
- **Data Validation**: Zod schemas shared between frontend and backend
- **Storage**: In-memory storage with interface design for easy database migration
- **Development**: Hot reload with Vite integration in development mode

### Data Storage Solutions
- **Current**: In-memory storage using Map structures for rapid prototyping
- **Database Ready**: Drizzle ORM configured for PostgreSQL with migration support
- **Schema**: Comprehensive complaint data model including patient info, clinic details, and consent tracking

### External Dependencies
- **Automation Workflow**: n8n webhook integration for complaint processing
- **Database**: Neon Database (PostgreSQL) configured via Drizzle
- **UI Components**: Extensive shadcn/ui component library
- **Icons**: Lucide React icon library
- **Fonts**: Google Fonts integration (Inter, DM Sans, Fira Code, Geist Mono, Architects Daughter)

### Key Architectural Decisions

**Multi-Step Form Design**: Implemented a progressive disclosure pattern with three distinct steps (complaint details, clinic information, patient information) to reduce cognitive load and improve completion rates. The form uses React Hook Form for efficient state management and Zod for comprehensive validation.

**Shared Schema Architecture**: Zod schemas are defined in a shared directory and used across both frontend and backend to ensure type safety and consistent validation rules. This reduces duplication and prevents validation drift between client and server.

**Webhook Integration Pattern**: After storing complaints locally, the system immediately forwards data to an n8n webhook endpoint for automated processing. This decouples the complaint submission from the business logic processing, allowing for flexible workflow automation.

**Storage Abstraction Layer**: The storage interface abstracts data persistence concerns, allowing for easy transition from in-memory storage to database-backed storage without changing business logic. The interface supports both user management and complaint tracking.

**Component-Based UI System**: Built on shadcn/ui for consistent design patterns and accessibility compliance. The component system uses Tailwind CSS with CSS custom properties for themeable design tokens.

**Development Experience**: Configured with Vite for fast development builds, TypeScript for type safety, and automatic error overlay for debugging. The build process handles both client and server bundling for production deployment.