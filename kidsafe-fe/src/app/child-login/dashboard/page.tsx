"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { dashboardService } from "@/services/dashboardService";

export default function ChildDashboardPage() {
  const [childData, setChildData] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  // Mock child ID - in a real app would be retrieved from login
  const childId = "1";
  const childDailyLimit = 120; // 2 hours
  
  useEffect(() => {
    const fetchChildData = async () => {
      setLoading(true);
      try {
        const stats = await dashboardService.getChildStats(childId, childDailyLimit);
        setChildData(stats);
        setTimeRemaining(stats.remainingTime);
      } catch (error) {
        console.error('Error fetching child data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChildData();
    
    // Update time remaining every minute
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${mins}m`;
  };
  
  const getProgressColor = () => {
    const percentRemaining = (timeRemaining / childDailyLimit) * 100;
    if (percentRemaining > 50) return "bg-green-500";
    if (percentRemaining > 25) return "bg-yellow-500";
    return "bg-red-500";
  };
  
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
        ) : (
          <div className="max-w-md w-full space-y-6">
            <div className="text-center">
              <Avatar className="h-20 w-20 mx-auto">
                <AvatarImage src="/avatars/boy1.png" alt="Billy" />
                <AvatarFallback>B</AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold mt-4">Hi, Billy!</h1>
              <p className="text-muted-foreground">Here's your screen time for today</p>
            </div>
            
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-0">
                <CardTitle className="text-center text-3xl">
                  {formatTime(timeRemaining)}
                </CardTitle>
                <CardDescription className="text-center">
                  Screen time remaining today
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 pb-8">
                <div className="h-4 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getProgressColor()} transition-all duration-500 ease-in-out`}
                    style={{ width: `${(timeRemaining / childDailyLimit) * 100}%` }}
                  />
                </div>
                <p className="text-center mt-4 text-sm">
                  You've used {formatTime(childDailyLimit - timeRemaining)} of your {formatTime(childDailyLimit)} total screen time
                </p>
              </CardContent>
              {timeRemaining === 0 && (
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
              </CardHeader>
              <CardContent className="space-y-2">
                {childData?.recentActivities.slice(0, 3).map((activity: any) => (
                  <div key={activity.id} className="flex justify-between items-center p-2 rounded-md hover:bg-accent">
                    <div>
                      <p className="font-medium">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                    <div className="text-sm">{formatTime(activity.duration)}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/child-login">Logout</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

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