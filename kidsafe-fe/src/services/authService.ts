// Authentication service with real API calls

export interface User {
  id: number;
  name: string;
  email: string;
  children?: Child[];
  role: 'parent' | 'child';
}

export interface Child {
  id: number;
  name: string;
  deviceId: string;
  avatar: string;
  dailyLimit: number; // In minutes
  blockedWebsites: string[];
  parentId?: number;
}

// API Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// In-memory storage for logged-in user
let currentUser: User | null = null;

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
      
      // In a real app, we'd fetch child details here
      // For now, we'll just store the child ID
      const child = {
        id: data.childId,
        name: 'Child User', // This would be fetched from API
        deviceId: deviceId,
        avatar: '/avatars/neutral1.png',
        dailyLimit: 120,
        blockedWebsites: []
      };
      
      localStorage.setItem('child', JSON.stringify(child));
      return child;
    } catch (error) {
      console.error('Child login error:', error);
      throw error;
    }
  },
  
  // Log out current user/child
  logout: () => {
    currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('child');
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
  
  // Get auth token from localStorage
  getToken: (): string | null => {
    return localStorage.getItem('token');
  }
}; 