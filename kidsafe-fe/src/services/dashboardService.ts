// Dashboard service for retrieving child activity data from the API
import { getAuthToken } from '@/lib/auth';

export interface Activity {
  id: number;
  childId: number;
  name: string;
  url?: string;
  category?: 'social-media' | 'education' | 'entertainment' | 'gaming' | 'productivity' | 'other';
  duration: number; // In minutes
  timestamp: Date;
}

export interface DailyUsage {
  date: string;
  totalTime: number; // In minutes
  appCount: number;
}

export interface CategoryUsage {
  category: string;
  duration: number;
  percentage: number;
}

export interface ChildStats {
  totalTimeToday: number; // In minutes
  remainingTime: number; // In minutes
  weeklyAverage: number; // In minutes
  mostVisitedSites: { name: string; duration: number; category?: string }[];
  recentActivities: Activity[];
  categoryBreakdown: CategoryUsage[];
  aiInsights: string[];
}

export interface AiInsights {
  summary: string;
  patterns: string[];
  concerns: string[];
  positives: string[];
  recommendations: string[];
  screenTimeAnalysis: string;
  contentCategoriesAnalysis: string;
}

// API Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const dashboardService = {
  // Get child usage statistics
  getChildStats: async (childId: number): Promise<ChildStats> => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch(`${API_URL}/dashboard/child/${childId}/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch child stats');
    }
    
    return response.json();
  },
  
  // Get daily usage for the past week
  getWeeklyData: async (childId: number): Promise<DailyUsage[]> => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch(`${API_URL}/dashboard/child/${childId}/weekly`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch weekly data');
    }
    
    return response.json();
  },
  
  // Log new activity (would be called from device monitoring in real app)
  logActivity: async (activity: Omit<Activity, 'id' | 'timestamp'>): Promise<Activity> => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch(`${API_URL}/dashboard/activity`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activity)
    });
    
    if (!response.ok) {
      throw new Error('Failed to log activity');
    }
    
    return response.json();
  },

  // Generate mock data for testing
  generateMockData: async (childId: number): Promise<{ success: boolean; message: string }> => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch(`${API_URL}/dashboard/child/${childId}/generate-mock-data`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate mock data');
    }
    
    return response.json();
  },

  // Get AI-generated insights for child
  getAiInsights: async (childId: number): Promise<AiInsights> => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch(`${API_URL}/dashboard/child/${childId}/ai-insights`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch AI insights');
    }
    
    return response.json();
  }
}; 