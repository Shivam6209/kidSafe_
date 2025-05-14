// Navigation utility to ensure consistent page redirections

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface SafeNavigateOptions {
  delay?: number;
  callback?: () => void;
}

/**
 * A utility function to handle navigation across the application
 * This makes navigation more reliable by providing fallbacks
 */
export const safeNavigate = (
  router: AppRouterInstance, 
  path: string, 
  options?: SafeNavigateOptions
) => {
  const { delay = 0, callback } = options || {};
  
  try {
    // Execute callback if provided
    if (callback) {
      callback();
    }
    
    // Add delay if specified
    if (delay && delay > 0) {
      setTimeout(() => {
        window.location.href = path;
      }, delay);
    } else {
      // Use window.location for more reliable navigation
      window.location.href = path;
    }
  } catch (error) {
    console.error("Navigation error:", error);
    // Fallback to router.push if window.location fails
    router.push(path);
  }
}; 