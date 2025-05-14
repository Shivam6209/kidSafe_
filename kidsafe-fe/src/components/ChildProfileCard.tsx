import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authService } from "@/services/authService";
import { useEffect, useState } from "react";

interface ChildProfileCardProps {
  name: string;
  avatar: string;
  timeUsed: string;
  timeLimit: string;
  deviceId: string;
  selected: boolean;
  onSelect: () => void;
  id: string | number;
}

export function ChildProfileCard({ 
  name, 
  avatar,
  timeUsed, 
  timeLimit, 
  deviceId,
  selected,
  onSelect,
  id
}: ChildProfileCardProps) {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOnline(authService.isChildOnline(id));

    // Set up interval to check online status
    const intervalId = setInterval(() => {
      setIsOnline(authService.isChildOnline(id));
    }, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, [id]);

  // Parse the timeUsed and timeLimit values
  // Handle the case where these might be formatted strings like "0 min"
  const extractMinutes = (timeStr: string) => {
    const minutes = parseInt(timeStr);
    if (!isNaN(minutes)) return minutes;
    // Try to extract from a formatted string like "2h 30m" or "45 min"
    const regex = /(\d+)\s*h|\s*(\d+)\s*m/g;
    let match;
    let totalMinutes = 0;
    while ((match = regex.exec(timeStr)) !== null) {
      if (match[1]) totalMinutes += parseInt(match[1]) * 60; // hours
      if (match[2]) totalMinutes += parseInt(match[2]); // minutes
    }
    // If that fails, just try to find any number
    if (totalMinutes === 0) {
      const anyNumber = /(\d+)/.exec(timeStr);
      if (anyNumber) return parseInt(anyNumber[1]);
    }
    return totalMinutes || 0;
  };
  
  const timeParts = {
    used: extractMinutes(timeUsed),
    limit: extractMinutes(timeLimit)
  };
  
  const percentUsed = timeParts.limit > 0 
    ? Math.min(100, Math.round((timeParts.used / timeParts.limit) * 100)) 
    : 0;
  
  let statusColor = 'bg-green-500';
  if (percentUsed > 75) statusColor = 'bg-yellow-500';
  if (percentUsed > 90) statusColor = 'bg-red-500';
  
  // Prevent the onClick handler from firing when clicking buttons
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <Card 
      className={`cursor-pointer transition-all duration-150 ${
        selected 
          ? 'border-primary bg-primary/5 shadow-md' 
          : 'hover:border-primary/30 hover:bg-accent/5'
      }`} 
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription>Device ID: {deviceId}</CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className={`h-3 w-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-xs text-muted-foreground">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Screen Time Today</span>
            <span className="text-sm font-medium">{timeUsed} / {timeLimit}</span>
          </div>
          <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
            <div 
              className={`h-full ${percentUsed > 90 ? 'bg-red-500' : percentUsed > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
          <div className="flex space-x-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              asChild
              onClick={handleButtonClick}
            >
              <Link href={`/dashboard?child=${id}`}>View Details</Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              asChild
              onClick={handleButtonClick}
            >
              <Link href={`/profile/edit-limits/${id}`}>Edit Limits</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 