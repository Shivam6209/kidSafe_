import React, { useState, useEffect } from 'react';
import { formatMinutes } from "@/lib/utils";
import { toast } from "sonner";
import { authService } from "@/services/authService";

interface DashboardPanelProps {
  childName: string;
  usageData: {
    totalTimeToday: number;
    remainingTime: number;
    dailyLimit: number;
  };
  recentActivities: any[];
  childId: number;  // Add childId as a required prop
}

export function DashboardPanel({
  childName,
  usageData,
  recentActivities = [],
  childId
}: DashboardPanelProps) {
  const [isOnline, setIsOnline] = useState(false);
  // We'll track the displayed remaining time separately from the prop
  const [displayedRemainingTime, setDisplayedRemainingTime] = useState(usageData.remainingTime);
  const [displayedTotalTime, setDisplayedTotalTime] = useState(usageData.totalTimeToday);
  
  // Check if the child is online
  useEffect(() => {
    // Initial check
    setIsOnline(authService.isChildOnline(childId));
    
    // Set interval to check periodically
    const intervalId = setInterval(() => {
      setIsOnline(authService.isChildOnline(childId));
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [childId]);
  
  // Reset displayed time when props change
  useEffect(() => {
    setDisplayedRemainingTime(usageData.remainingTime);
    setDisplayedTotalTime(usageData.totalTimeToday);
  }, [usageData.remainingTime, usageData.totalTimeToday]);
  
  // Timer effect to simulate time passing
  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setDisplayedRemainingTime(prev => {
        // Don't go below zero
        const newValue = Math.max(0, prev - 1);
        // If we've reached zero, show an alert
        if (prev > 0 && newValue === 0) {
          toast.warning(`${childName} has reached their screen time limit!`);
        }
        return newValue;
      });
      
      setDisplayedTotalTime(prev => prev + 1);
    }, 60000); // Update every 1 minute (60000ms)
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [childName]);
  
  // Calculate percentage of time used based on displayed values
  const percentageUsed = Math.min(100, Math.round((displayedTotalTime / usageData.dailyLimit) * 100));
  
  // Calculate hours and minutes for display - formatted exactly as in mockup
  const hoursUsed = Math.floor(displayedTotalTime / 60);
  const minutesUsed = displayedTotalTime % 60;
  const hoursTotal = Math.floor(usageData.dailyLimit / 60);
  const minutesTotal = usageData.dailyLimit % 60;
  
  // Format the time correctly to match the mockup: "2h 0m / 2h 0m"
  const formattedTime = `${hoursUsed}h ${minutesUsed}m / ${hoursTotal}h ${minutesTotal}m`;
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-border">
      {/* Header with child info */}
      <div className="p-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center font-medium">
            {childName.substring(0, 1).toUpperCase()}
          </div>
          <div>
            <h3 className="font-medium text-lg">{childName}</h3>
            <div className="flex items-center text-xs text-gray-500">
              <div className={`w-2 h-2 rounded-full mr-1.5 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span>{isOnline ? 'Online now' : 'Offline'}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Screen time progress bar */}
      <div className="px-4 py-3">
        <h4 className="text-sm font-medium mb-1">Screen Time Today</h4>
        <div className="text-sm mb-2">{formattedTime}</div>
        <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
          <div 
            className={`h-2 rounded-full ${
              percentageUsed > 90 ? 'bg-red-500' : 
              percentageUsed > 75 ? 'bg-yellow-500' : 
              'bg-blue-500'
            }`}
            style={{ 
              width: `${percentageUsed}%`,
              transition: 'width 0.5s ease, background-color 0.3s ease' 
            }}
          ></div>
        </div>
        <div className="text-xs text-right">
          <span>{formatMinutes(displayedRemainingTime)} remaining</span>
        </div>
      </div>
      
      {/* Recent activity */}
      <div className="px-4 py-3 border-t border-gray-100">
        <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
        <div className="space-y-3">
          {recentActivities && recentActivities.length > 0 ? (
            recentActivities.map((activity, i) => (
              <div key={i} className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm">{activity.name}</div>
                  <div className="text-xs text-gray-500">Just now</div>
                </div>
                <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  {formatMinutes(activity.duration)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-gray-500 py-2">
              No recent activity
            </div>
          )}
        </div>
      </div>
      
      {/* Live alerts */}
      <div className="px-4 py-3 border-t border-gray-100">
        <h4 className="text-sm font-medium mb-2">Live Alerts</h4>
        <div className="space-y-2">
          {isOnline ? (
            <>
              <div className="rounded-md bg-gray-50 p-2 text-xs">
                • {childName} just opened Candy Crush (Just now)
              </div>
              <div className="rounded-md bg-gray-50 p-2 text-xs">
                • Screen time limit approaching ({formatMinutes(displayedRemainingTime)} left)
              </div>
            </>
          ) : (
            <div className="text-center text-sm text-gray-500 py-2">
              No alerts while child is offline
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 