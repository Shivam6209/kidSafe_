"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { dashboardService } from "@/services/dashboardService";
import { authService } from "@/services/authService";
import { safeNavigate } from "@/lib/navigation";
import { toast } from "sonner";
import { formatMinutes } from "@/lib/utils";
import { NavigationButton } from "@/components/ui/navigation-button";

export default function ChildDashboardPage() {
  const router = useRouter();
  const [childData, setChildData] = useState<any>(null);
  const [child, setChild] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get child data from localStorage
    const storedChild = localStorage.getItem('child');
    if (!storedChild) {
      // If no child data in localStorage, redirect to login
      safeNavigate(router, '/child-login');
      return;
    }
    
    const childInfo = JSON.parse(storedChild);
    setChild(childInfo);
    
    const fetchChildData = async () => {
      setLoading(true);
      try {
        if (childInfo && childInfo.id) {
          // Use custom fetchChildStats function that uses childToken instead of parent token
          const stats = await fetchChildStats(childInfo.id);
          setChildData(stats);
          setTimeRemaining(stats.remainingTime);
        }
      } catch (error) {
        console.error('Error fetching child data:', error);
        toast.error("Couldn't load your screen time data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchChildData();
    
    // Update time remaining every minute
    const timer = setInterval(() => {
      // Decrement by 1 minute each interval
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 60000); // 60000 ms = 1 minute
    
    return () => clearInterval(timer);
  }, [router]);
  
  const getProgressColor = () => {
    if (!child) return "bg-primary";
    const percentRemaining = (timeRemaining / child.dailyLimit) * 100;
    
    // Using the same color scheme as the parent dashboard
    if (percentRemaining > 50) return "bg-primary";
    if (percentRemaining > 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleLogout = () => {
    if (child && child.id) {
      authService.setChildOffline(child.id);
    }
    localStorage.removeItem('child');
    localStorage.removeItem('childToken');
    window.location.href = '/child-login';
  };
  
  if (!child) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <p>No child data available. Please log in.</p>
        <NavigationButton href="/child-login" className="mt-4">Go to Login</NavigationButton>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Blurred shapes */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl z-0"></div>
      <div className="pointer-events-none absolute top-1/2 right-0 w-80 h-80 rounded-full bg-purple-400/20 blur-3xl z-0"></div>
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-pink-400/20 blur-3xl z-0"></div>
      <div className="w-full max-w-md relative z-10">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading your screen time...</p>
          </div>
        ) :
          <div className="max-w-md w-full space-y-6">
            <div className="text-center">
              <Avatar className="h-20 w-20 mx-auto">
                <AvatarImage src={child.avatar} alt={child.name} />
                <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold mt-4">Hi, {child.name}!</h1>
              <p className="text-muted-foreground">Here's your screen time for today</p>
            </div>
            
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-0">
                <CardTitle className="text-center text-3xl">
                  {formatMinutes(timeRemaining)}
                </CardTitle>
                <CardDescription className="text-center">
                  Screen time remaining today
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 pb-8">
                <div className="h-4 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getProgressColor()} transition-all duration-500 ease-in-out`}
                    style={{ width: `${(timeRemaining / child.dailyLimit) * 100}%` }}
                  />
                </div>
                <p className="text-center mt-4 text-sm">
                  You've used {formatMinutes(child.dailyLimit - timeRemaining)} of your {formatMinutes(child.dailyLimit)} total screen time
                </p>
              </CardContent>
              
              {timeRemaining <= 0 && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="text-4xl mb-2">⏱️</div>
                    <h2 className="text-xl font-bold mb-2">Time's Up!</h2>
                    <p className="mb-4">You've reached your screen time limit for today.</p>
                    <Button variant="outline" size="sm">Request More Time</Button>
                  </div>
                </div>
              )}
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>What you've been doing today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {childData?.recentActivities?.slice(0, 3).map((activity: any, index: number) => (
                  <div key={activity.id || index} className="flex justify-between items-center p-2 rounded-md hover:bg-accent border-b border-border pb-2">
                    <div>
                      <p className="font-medium">{activity.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                          {activity.category ? formatCategoryName(activity.category) : 'Other'}
                        </span>
                        <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium">{formatMinutes(activity.duration)}</div>
                  </div>
                ))}
                {(!childData?.recentActivities || childData.recentActivities.length === 0) && (
                  <p className="text-center text-muted-foreground py-6">No recent activities</p>
                )}
              </CardContent>
            </Card>

            {childData?.categoryBreakdown && childData.categoryBreakdown.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Content Categories</CardTitle>
                  <CardDescription>What you've been spending time on</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {childData.categoryBreakdown.slice(0, 3).map((category: any, i: number) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">{formatCategoryName(category.category)}</span>
                          <span>{formatMinutes(category.duration)}</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getCategoryColorClass(category.category)}`} 
                            style={{ width: `${category.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <NavigationButton variant="outline" className="w-full" href="/child-login" onClick={(e) => {
              e.preventDefault();
              if (child && child.id) {
                authService.setChildOffline(child.id);
              }
              localStorage.removeItem('child');
              localStorage.removeItem('childToken');
              window.location.href = '/child-login';
            }}>
              Logout
            </NavigationButton>
          </div>
        }
      </div>
    </div>
  );
}

// Helper functions for consistent formatting
function formatTimeAgo(timestamp: string | Date) {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
  if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }
  if (diffMins > 0) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  }
  
  return 'Just now';
}

// Format category names consistently
function formatCategoryName(category: string) {
  return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Get category color class consistent with parent dashboard
function getCategoryColorClass(category: string) {
  const colors: Record<string, string> = {
    'social-media': 'bg-blue-500',
    'education': 'bg-green-500',
    'entertainment': 'bg-yellow-500',
    'gaming': 'bg-red-500',
    'productivity': 'bg-purple-500',
    'other': 'bg-gray-500'
  };
  return colors[category.toLowerCase()] || 'bg-primary';
}

// Custom function to fetch child stats using childToken
const fetchChildStats = async (childId: number) => {
  const childToken = localStorage.getItem('childToken');
  if (!childToken) {
    throw new Error('Child authentication required');
  }
  
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/dashboard/child/${childId}/stats`;
  
  // Log the request details for debugging
  console.log("Fetching child stats with:");
  console.log("URL:", apiUrl);
  console.log("Token:", childToken.substring(0, 15) + "...");
  
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${childToken}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", response.status, response.statusText, errorText);
      throw new Error(`Failed to fetch child stats: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}; 