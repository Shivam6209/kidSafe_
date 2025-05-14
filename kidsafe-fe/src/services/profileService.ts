// Profile service for managing child profiles with real API calls
import { Child, authService } from './authService';

// API Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Avatar options
export const avatarOptions = [
  '/avatars/boy1.png',
  '/avatars/boy2.png',
  '/avatars/girl1.png',
  '/avatars/girl2.png',
  '/avatars/neutral1.png',
  '/avatars/neutral2.png'
];

export const profileService = {
  // Get a list of all children for a parent
  getChildren: async (): Promise<Child[]> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_URL}/profile/children`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch children');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching children:', error);
      return [];
    }
  },
  
  // Get a single child by ID
  getChild: async (childId: number): Promise<Child | null> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_URL}/profile/children/${childId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch child profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching child:', error);
      return null;
    }
  },
  
  // Add a new child profile
  addChild: async (childData: Omit<Child, 'id'>): Promise<Child> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_URL}/profile/children`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(childData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create child profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating child:', error);
      throw error;
    }
  },
  
  // Update a child's profile
  updateChild: async (childId: number, updates: Partial<Child>): Promise<Child> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      
      console.log("ProfileService updateChild - Request data:", updates);
      
      const response = await fetch(`${API_URL}/profile/children/${childId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("ProfileService updateChild - Error response:", errorData);
        throw new Error(errorData.message || 'Failed to update child profile');
      }
      
      const responseData = await response.json();
      console.log("ProfileService updateChild - Success response:", responseData);
      return responseData;
    } catch (error) {
      console.error('Error updating child:', error);
      throw error;
    }
  },
  
  // Delete a child profile
  deleteChild: async (childId: number): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${API_URL}/profile/children/${childId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete child profile');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting child:', error);
      return false;
    }
  },
  
  // Update time limits
  updateTimeLimit: async (childId: number, dailyLimit: number): Promise<Child> => {
    return profileService.updateChild(childId, { dailyLimit });
  },
  
  // Update blocked websites
  updateBlockedWebsites: async (childId: number, blockedWebsites: string[]): Promise<Child> => {
    return profileService.updateChild(childId, { blockedWebsites });
  }
}; 