/**
 * Authentication utility functions
 */

/**
 * Get the auth token from localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return localStorage.getItem('token');
};

/**
 * Set the auth token in localStorage
 */
export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.setItem('token', token);
};

/**
 * Remove the auth token from localStorage
 */
export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.removeItem('token');
};

/**
 * Check if user is authenticated (has token)
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
}; 