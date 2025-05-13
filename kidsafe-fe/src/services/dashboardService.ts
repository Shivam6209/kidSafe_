// Dashboard service for retrieving child activity data from the API

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
}

export interface ChildStats {
  totalTimeToday: number; // In minutes
  remainingTime: number; // In minutes
  weeklyAverage: number; // In minutes
  mostVisitedSites: { name: string; duration: number; category?: string }[];
  recentActivities: Activity[];
  categoryBreakdown: { category: string; duration: number; percentage: number }[];
  aiInsights: string[];
}

// API Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const dashboardService = {
  // Get child usage statistics
  getChildStats: async (childId: number): Promise<ChildStats> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_URL}/dashboard/stats/${childId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching child stats:', error);
      throw error;
    }
  },
  
  // Get daily usage for the past week
  getWeeklyData: async (childId: number): Promise<DailyUsage[]> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_URL}/dashboard/weekly/${childId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch weekly data');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching weekly data:', error);
      return [];
    }
  },
  
  // Log new activity (would be called from device monitoring in real app)
  logActivity: async (activity: Omit<Activity, 'id' | 'timestamp'>): Promise<Activity> => {
    try {
      const response = await fetch(`${API_URL}/dashboard/activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(activity)
      });
      
      if (!response.ok) {
        throw new Error('Failed to log activity');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error logging activity:', error);
      throw error;
    }
  }
}; 