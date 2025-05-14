# KidSafe - Parental Control & Usage Monitor

This project contains both frontend and backend for the KidSafe parental control and usage monitoring application.

## Project Structure

- `/kidsafe-fe` - Next.js frontend application with interactive UI
- `/kidsafe-be` - NestJS backend application (placeholder for future implementation)

## Features

### Core Features

- Parent login/registration with email and password
- Child login with device ID
- Dashboard for monitoring children's screen time and app usage
- Add and manage child profiles
- Set time limits and blocked websites for each child
- View usage reports and statistics

### AI-Powered Features

- Smart insights about your child's digital habits
- Content classification by category (social media, education, gaming, etc.)
- Usage pattern recognition for providing customized recommendations

### Enhanced UI

- Modern, responsive design using TailwindCSS and Shadcn UI
- Interactive dashboard with visual representations of data
- Multi-step forms for improved user experience
- Child-friendly interface for the child dashboard
- Visually engaging home page with feature highlights

## Getting Started

### Frontend

1. Navigate to the frontend directory:

```bash
cd kidsafe-fe
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend

The backend will be implemented in a future phase using NestJS. Currently, the frontend uses mock services that simulate API calls but return predefined data.

## Demo Credentials

For demonstration purposes, you can use any email that includes @ with any password to login to the parent dashboard.

For child login, you can use the following device IDs:
- `device-123` for Billy Doe
- `device-456` for Sally Doe

## AI Features Implementation

The AI features are currently simulated with static data, but in a real-world scenario, they would:

1. Analyze usage patterns over time
2. Identify trends in screen time and content consumption
3. Provide personalized recommendations for healthier digital habits
4. Automatically categorize applications and websites
5. Alert parents to potentially concerning usage patterns

These features showcase how AI can enhance the parental control experience by providing more meaningful insights rather than just raw data.