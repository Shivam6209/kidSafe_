// Authentication service with real API calls

import { getAuthToken } from '@/lib/auth';

export interface User {
  id: number;
  name: string;
  email: string;
  children?: Child[];
  role: 'parent' | 'child';
  isVerified?: boolean;
}

export interface Child {
  id: number;
  name: string;
  deviceId: string;
  avatar: string;
  dailyLimit: number; // In minutes
  blockedWebsites?: string[];
}

// API Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// In-memory storage for logged-in user
let currentUser: User | null = null;

// Track online children
let onlineChildren: { [key: string]: number } = {}; // Map childId -> timestamp

export const authService = {
  // Login with email and password
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      const data = await response.json();
      const user: User = {
        ...data.user,
        role: 'parent'
      };
      
      // Store token and user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(user));
      currentUser = user;
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Register a new parent account
  register: async (name: string, email: string, password: string): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const data = await response.json();
      const user: User = {
        ...data.user,
        role: 'parent'
      };
      
      // Store token and user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(user));
      currentUser = user;
      
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Track online status of children
  setChildOnline: (childId: number | string): void => {
    onlineChildren[childId.toString()] = Date.now();
  },

  // Clear online status when a child logs out
  setChildOffline: (childId: number | string): void => {
    delete onlineChildren[childId.toString()];
  },

  // Check if a child is currently online (active in last 5 minutes)
  isChildOnline: (childId: number | string): boolean => {
    const lastActiveTime = onlineChildren[childId.toString()];
    if (!lastActiveTime) return false;
    
    // Consider online if active in the last 5 minutes
    return Date.now() - lastActiveTime < 5 * 60 * 1000;
  },

  // Child login with device ID
  childLogin: async (deviceId: string): Promise<Child | null> => {
    try {
      const response = await fetch(`${API_URL}/auth/child-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deviceId }),
      });
      
      if (!response.ok) {
        throw new Error('Invalid device ID');
      }
      
      const data = await response.json();
      
      // Store the child token for authentication
      if (data.token) {
        localStorage.setItem('childToken', data.token);
      }
      
      // Store the child data directly from the response
      if (data.child) {
        localStorage.setItem('child', JSON.stringify(data.child));
        authService.setChildOnline(data.child.id); // Mark child as online
        return data.child;
      } else if (data.childId) {
        // Fallback if child data isn't directly provided
        const child = {
          id: data.childId,
          deviceId: deviceId,
          // Set default values
          name: 'Child User',
          avatar: '/avatars/neutral1.png',
          dailyLimit: 120,
          blockedWebsites: []
        };
        localStorage.setItem('child', JSON.stringify(child));
        authService.setChildOnline(data.childId); // Mark child as online
        return child;
      }
      
      return null;
    } catch (error) {
      console.error('Child login error:', error);
      throw error;
    }
  },
  
  // Log out current user/child
  logout: () => {
    const storedChild = localStorage.getItem('child');
    if (storedChild) {
      try {
        const childInfo = JSON.parse(storedChild);
        if (childInfo && childInfo.id) {
          authService.setChildOffline(childInfo.id);
        }
      } catch (e) {
        console.error('Error parsing child data when logging out:', e);
      }
    }

    currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('child');
    localStorage.removeItem('childToken');
  },
  
  // Get current user from local storage or state
  getCurrentUser: (): User | null => {
    if (currentUser) return currentUser;
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      currentUser = user;
      return user;
    }
    
    return null;
  },
  
  // Get children for a parent
  getChildren: async (): Promise<Child[]> => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    try {
      const response = await fetch(`${API_URL}/profile/children`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch children');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching children:', error);
      return []; // Return an empty array on error
    }
  },
  
  // Get auth token from localStorage
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  getProfile: async (): Promise<{ user: User }> => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return response.json();
  },

  // Send OTP for email verification
  sendOtp: async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send verification code');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error sending OTP:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to send verification code');
    }
  },
  
  // Verify OTP for email verification
  verifyOtp: async (email: string, otp: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to verify code');
      }
      
      const data = await response.json();
      
      // Update user verification status in local storage if successful
      if (data.success) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          user.isVerified = true;
          localStorage.setItem('user', JSON.stringify(user));
          currentUser = user;
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to verify code');
    }
  },
}; 