# AI Insights Service Documentation

This document explains how to use the AI Insights service in the KidSafe application, which is implemented using OpenAI's GPT models.

## Setup

1. Create an OpenAI account at [https://openai.com/](https://openai.com/)
2. Obtain your API key from the OpenAI dashboard
3. Configure your environment variables:

```
OPENAI_API_KEY=your_openai_api_key
```

## Usage

The AI Insights service analyzes a child's activity data and generates insights about their digital habits, including patterns, potential concerns, positive behaviors, and recommendations for parents.

### Backend Implementation

The service is implemented in `src/shared/ai-insights.service.ts` and provides the following functionality:

```typescript
// Inject the service
constructor(private readonly aiInsightsService: AiInsightsService) {}

// Generate insights
const insights = await this.aiInsightsService.generateInsights(childName, activityData);
```

The dashboard service handles collecting and formatting the child activity data before passing it to the AI service. The endpoint to access this functionality is:

```
GET /dashboard/child/:id/ai-insights
```

### Frontend Implementation

The frontend component `AiInsightsComponent` provides a user-friendly interface to display the AI-generated insights. It includes tabs for:

1. Summary - Overall digital habits summary and screen time analysis
2. Patterns - Key usage patterns, areas of concern, and positive behaviors
3. Recommendations - Actionable recommendations for parents

To use this component:

```tsx
import { AiInsightsComponent } from "@/components/AiInsights";

// Then in your component:
<AiInsightsComponent childId={childId} childName={childName} />
```

## Fallback Mechanism

The service includes a fallback mechanism that generates mock insights when:
- The OpenAI API key is not provided
- There's an error connecting to the OpenAI API
- There's insufficient activity data

This ensures parents always receive some form of insights even when the AI service is unavailable.

## Data Privacy

The service is designed with privacy in mind:
- No personally identifiable information is sent to OpenAI beyond the child's first name
- Activity data is anonymized before being processed
- All API calls are made server-side, not from the client

## Cost Management

To manage API costs:
- The service uses completion tokens efficiently
- Response format is specified as JSON to minimize token usage
- Caching mechanisms can be implemented to reduce API calls 