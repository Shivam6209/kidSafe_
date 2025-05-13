# KidSafe Frontend

This is the frontend for the KidSafe parental control and usage monitoring application built with Next.js 14 and Shadcn UI.

## Features

- **Parent Authentication**
  - Login/registration with email and password
  - Multi-step registration form for better user experience
  - Secure authentication flow (using mock services for now)

- **Child Profile Management**
  - Create and manage child profiles
  - Set up device IDs for each child
  - Customize avatars and settings

- **Screen Time Controls**
  - Set daily time limits for each child
  - Monitor remaining screen time
  - Block specific websites and app categories

- **Activity Monitoring**
  - Track websites visited and time spent
  - Log app launches and duration
  - View recent activity timelines

- **Usage Reports & Analytics**
  - Daily and weekly usage summaries
  - Category-based content classification
  - Visual charts for easy data interpretation

- **AI-Powered Insights (New!)**
  - Get smart insights about your child's digital habits
  - Pattern recognition for usage behavior
  - Personalized recommendations for healthier digital habits

- **Child-Friendly Dashboard**
  - Simplified interface for children to view their time limits
  - Child login with device ID
  - Visual indication of remaining screen time

- **Responsive Design**
  - Works seamlessly on desktop, tablet, and mobile devices
  - Modern, clean UI with Shadcn components
  - Interactive elements for better user experience

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- TailwindCSS
- Shadcn UI Components

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `src/app`: Next.js app router pages
  - `auth/`: Parent authentication (login/register)
  - `dashboard/`: Parent dashboard and child management
  - `child-login/`: Child login and limited dashboard
- `src/components`: React components
  - `ui/`: Shadcn UI components
  - `layout/`: Layout components
  - `forms/`: Form components
  - `dashboard/`: Dashboard-specific components
- `src/services`: API services for mock data
  - `authService.ts`: Authentication service
  - `profileService.ts`: Child profile management service
  - `dashboardService.ts`: Usage data and statistics service with AI insights

## Mock Data & AI Features

The frontend uses mock services that simulate API calls with predefined data. The AI insights feature is currently implemented with static examples to demonstrate the functionality, but in a real-world scenario, it would use machine learning to analyze usage patterns and provide personalized recommendations.

### Content Classification

The app now classifies content into categories:
- Social Media
- Education
- Entertainment
- Gaming
- Productivity

This classification helps parents understand how their children are spending their screen time.

## Backend Integration

In the future, the mock services will be updated to make real API calls to the NestJS backend, which will be implemented later.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
