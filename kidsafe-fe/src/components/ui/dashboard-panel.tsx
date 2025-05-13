import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

interface DashboardPanelProps {
  childName?: string;
  usageData?: {
    totalTimeToday: number;
    remainingTime: number;
    dailyLimit: number;
  };
  recentActivities?: Array<{
    id: string;
    name: string;
    timestamp: string;
    duration: number;
  }>;
}

const formatMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours > 0 ? `${hours}h ` : ''}${mins}m`;
};

export function DashboardPanel({
  childName = "Child",
  usageData = { totalTimeToday: 60, remainingTime: 120, dailyLimit: 180 },
  recentActivities = []
}: DashboardPanelProps) {
  
  const percentUsed = Math.min(100, Math.round(((usageData.dailyLimit - usageData.remainingTime) / usageData.dailyLimit) * 100));
  
  return (
    <div className="w-full max-w-sm md:max-w-md bg-background border rounded-lg shadow-md overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 mx-2"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 ml-2"></div>
        </div>
        <div className="text-sm font-medium">KidSafe Dashboard</div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-4">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src="/avatars/boy1.png" alt={childName} />
            <AvatarFallback>{childName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{childName}</h3>
            <p className="text-xs text-muted-foreground">Online now</p>
          </div>
          <div className="ml-auto flex items-center">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
            <span className="text-xs text-muted-foreground">Active</span>
          </div>
        </div>
        
        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-sm">
            <span>Screen Time Today</span>
            <span>{formatMinutes(usageData.dailyLimit - usageData.remainingTime)} / {formatMinutes(usageData.dailyLimit)}</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                percentUsed > 90 ? 'bg-red-500' : 
                percentUsed > 75 ? 'bg-yellow-500' : 
                'bg-blue-500'
              } ${percentUsed < 100 ? 'animate-pulse' : ''}`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
          <p className="text-xs mt-1 text-muted-foreground text-right">
            {formatMinutes(usageData.remainingTime)} remaining
          </p>
        </div>
        
        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-medium">Recent Activity</h4>
          <div className="space-y-2">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="rounded-md p-2 bg-muted/50 hover:bg-muted/80 transition-colors">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{activity.name}</span>
                    <span className="text-xs">{formatMinutes(activity.duration)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </div>
        </div>
        
        <div className="rounded-md border p-3 mt-2">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Live Alerts</h4>
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
          </div>
          <div className="text-xs text-muted-foreground">
            {recentActivities.length > 0 ? (
              <>
                <p className="mb-1">• {childName} just opened {recentActivities[0].name} ({formatTimeAgo(recentActivities[0].timestamp)})</p>
                <p>• Screen time limit approaching ({formatMinutes(usageData.remainingTime)} left)</p>
              </>
            ) : (
              <p>No recent alerts</p>
            )}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-dashed">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Quick Actions</h4>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button className="bg-muted/70 hover:bg-muted text-xs py-2 px-3 rounded flex items-center justify-center transition-colors">
              <span>Pause Screen Time</span>
            </button>
            <button className="bg-muted/70 hover:bg-muted text-xs py-2 px-3 rounded flex items-center justify-center transition-colors">
              <span>Add Time (15m)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
} 