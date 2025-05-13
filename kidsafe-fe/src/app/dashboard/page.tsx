"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { dashboardService } from "@/services/dashboardService";
import { profileService } from "@/services/profileService";
import { DashboardPanel } from "@/components/ui/dashboard-panel";

// Placeholder for chart components - in a real app, would use chart libraries
const DummyBarChart = ({ data }: { data: any[] }) => (
  <div className="h-40 w-full bg-accent/30 rounded-md flex items-end justify-around p-2">
    {data.map((item, i) => (
      <div key={i} className="flex flex-col items-center">
        <div
          className="w-8 bg-primary hover:bg-primary/80 rounded-t-sm transition-all duration-300"
          style={{ height: `${(item.value / 180) * 100}%` }}
        ></div>
        <span className="text-xs mt-1">{item.label}</span>
      </div>
    ))}
  </div>
);

const DummyPieChart = ({ data }: { data: { category: string; percentage: number }[] }) => (
  <div className="relative h-40 w-40 mx-auto">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-32 w-32 rounded-full bg-background flex items-center justify-center border-8 border-accent">
        <span className="text-sm font-medium">Categories</span>
      </div>
    </div>
    <div className="absolute top-0 right-0">
      <div className="space-y-1">
        {data.map((item, i) => (
          <div key={i} className="flex items-center text-xs">
            <div className={`w-3 h-3 mr-1 rounded-full ${getCategoryColorClass(item.category)}`}></div>
            <span>{formatCategoryName(item.category)}: {item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const getCategoryColorClass = (category: string) => {
  const colors: Record<string, string> = {
    'social-media': 'bg-blue-500',
    'education': 'bg-green-500',
    'entertainment': 'bg-yellow-500',
    'gaming': 'bg-red-500',
    'productivity': 'bg-purple-500',
    'other': 'bg-gray-500'
  };
  return colors[category] || 'bg-gray-500';
};

const formatCategoryName = (category: string) => {
  return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const formatMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours > 0 ? `${hours}h ` : ''}${mins}m`;
};

export default function DashboardPage() {
  const [childData, setChildData] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>('1');
  const [childStats, setChildStats] = useState<any>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  useEffect(() => {
    const fetchChildProfiles = async () => {
      try {
        const children = await profileService.getChildren('1'); // Using parent ID 1 for demo
        setChildData(children);
      } catch (error) {
        console.error('Error fetching child profiles:', error);
      }
    };
    
    fetchChildProfiles();
  }, []);
  
  useEffect(() => {
    const fetchChildStats = async () => {
      if (!selectedChild) return;
      
      setLoading(true);
      try {
        const child = childData.find(c => c.id === selectedChild);
        if (child) {
          const stats = await dashboardService.getChildStats(selectedChild, child.dailyLimit);
          setChildStats(stats);
          
          const weekly = await dashboardService.getWeeklyData(selectedChild);
          
          // Format weekly data for chart
          const chartData = daysOfWeek.map((day, i) => {
            const today = new Date();
            const dayIndex = (today.getDay() - i + 7) % 7;
            const dayData = weekly.find(d => {
              const date = new Date(d.date);
              return date.getDay() === dayIndex;
            });
            
            return {
              label: daysOfWeek[dayIndex],
              value: dayData?.totalTime || 0
            };
          }).reverse();
          
          setWeeklyData(chartData);
        }
      } catch (error) {
        console.error('Error fetching child stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChildStats();
  }, [selectedChild, childData]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Blurred shapes */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl z-0"></div>
      <div className="pointer-events-none absolute top-1/2 right-0 w-80 h-80 rounded-full bg-purple-400/20 blur-3xl z-0"></div>
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-pink-400/20 blur-3xl z-0"></div>
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">KidSafe Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center">
              <span className="text-sm mr-2">Hi, John Doe</span>
              <Avatar>
                <AvatarImage src="/avatars/parent.png" alt="Parent" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
            <Button variant="outline" asChild>
              <Link href="/">Logout</Link>
            </Button>
          </div>
        </div>
        
        {childData.length > 0 && (
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Select Child:</label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {childData.map(child => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child.id)}
                  className={`flex items-center p-2 rounded-lg ${
                    selectedChild === child.id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                  } transition-colors`}
                >
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={child.avatar} alt={child.name} />
                    <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{child.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading child data...</p>
            </div>
          </div>
        ) : childStats ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="overview" className="px-4 py-2">Overview</TabsTrigger>
                  <TabsTrigger value="insights" className="px-4 py-2">AI Insights</TabsTrigger>
                  <TabsTrigger value="children" className="px-4 py-2">Children</TabsTrigger>
                  <TabsTrigger value="settings" className="px-4 py-2">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <DashboardCard 
                      title="Today's Screen Time" 
                      value={formatMinutes(childStats.totalTimeToday)}
                      description={`${formatMinutes(childStats.remainingTime)} remaining today`}
                      highlight={childStats.remainingTime < 30}
                    />
                    <DashboardCard 
                      title="Most Used App" 
                      value={childStats.mostVisitedSites[0]?.name || "None"}
                      description={childStats.mostVisitedSites[0] ? `${formatMinutes(childStats.mostVisitedSites[0].duration)} total usage` : "No usage recorded"}
                    />
                    <DashboardCard 
                      title="Weekly Average" 
                      value={formatMinutes(childStats.weeklyAverage)}
                      description="Daily screen time"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle>Weekly Usage</CardTitle>
                        <CardDescription>Screen time over the past week</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <DummyBarChart data={weeklyData} />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Content Categories</CardTitle>
                        <CardDescription>Usage by category</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <DummyPieChart data={childStats.categoryBreakdown.slice(0, 4)} />
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest activities from {childData.find(c => c.id === selectedChild)?.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {childStats.recentActivities.slice(0, 5).map((activity: any) => (
                          <ActivityItem 
                            key={activity.id}
                            activity={activity.name} 
                            category={formatCategoryName(activity.category || 'other')}
                            time={formatTimeAgo(activity.timestamp)} 
                            duration={formatMinutes(activity.duration)} 
                          />
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">View All Activity</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="insights" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>AI-Powered Insights</CardTitle>
                      <CardDescription>Smart analysis of {childData.find(c => c.id === selectedChild)?.name}'s usage patterns</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {childStats.aiInsights.map((insight: string, i: number) => (
                          <div key={i} className="p-4 border rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors">
                            <p className="flex gap-2 items-start">
                              <span className="text-primary text-lg mt-0.5">💡</span>
                              <span>{insight}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <p className="text-sm text-muted-foreground">Insights are generated based on usage patterns and may not be 100% accurate.</p>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Classification</CardTitle>
                      <CardDescription>Breakdown of content by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {childStats.categoryBreakdown.map((category: any, i: number) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between items-center text-sm">
                              <span className="font-medium">{formatCategoryName(category.category)}</span>
                              <span>{formatMinutes(category.duration)} ({category.percentage}%)</span>
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
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">Set Category Limits</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="children" className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Child Profiles</h2>
                    <Button>Add Child</Button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {childData.map(child => (
                      <ChildProfileCard 
                        key={child.id}
                        name={child.name} 
                        avatar={child.avatar}
                        timeUsed={formatMinutes(childStats?.totalTimeToday || 0)} 
                        timeLimit={formatMinutes(child.dailyLimit)} 
                        deviceId={child.deviceId} 
                        selected={selectedChild === child.id}
                        onSelect={() => setSelectedChild(child.id)}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>Manage your account settings and preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">john@example.com</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Name</p>
                        <p className="text-sm text-muted-foreground">John Doe</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Notification Preferences</p>
                        <div className="flex items-center mt-1">
                          <input type="checkbox" id="emailNotif" className="mr-2 h-4 w-4" defaultChecked />
                          <label htmlFor="emailNotif" className="text-sm">Email notifications</label>
                        </div>
                        <div className="flex items-center mt-1">
                          <input type="checkbox" id="limitNotif" className="mr-2 h-4 w-4" defaultChecked />
                          <label htmlFor="limitNotif" className="text-sm">Screen time limit alerts</label>
                        </div>
                      </div>
                      <Button variant="outline">Edit Profile</Button>
                    </CardContent>
                  </Card>
                  
                  {selectedChild && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Child Settings</CardTitle>
                        <CardDescription>Manage settings for {childData.find(c => c.id === selectedChild)?.name}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm font-medium">Daily Time Limit</p>
                          <div className="flex items-center gap-2 mt-1">
                            <input 
                              type="range" 
                              min="30" 
                              max="240" 
                              step="15" 
                              defaultValue={childData.find(c => c.id === selectedChild)?.dailyLimit} 
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-sm">{formatMinutes(childData.find(c => c.id === selectedChild)?.dailyLimit)}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Blocked Websites</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {childData.find(c => c.id === selectedChild)?.blockedWebsites.map((site: string, i: number) => (
                              <div key={i} className="bg-muted rounded-full px-3 py-1 text-xs flex items-center">
                                {site}
                                <button className="ml-1 h-4 w-4 rounded-full bg-muted-foreground/30 text-foreground flex items-center justify-center hover:bg-muted-foreground/50">×</button>
                              </div>
                            ))}
                            <button className="bg-muted rounded-full px-3 py-1 text-xs flex items-center hover:bg-muted/80">
                              + Add
                            </button>
                          </div>
                        </div>
                        <Button>Save Changes</Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right-hand KidSafe dashboard panel */}
            <div className="lg:w-80">
              <DashboardPanel 
                childName={childData.find(c => c.id === selectedChild)?.name || "Child"}
                usageData={{
                  totalTimeToday: childStats.totalTimeToday,
                  remainingTime: childStats.remainingTime,
                  dailyLimit: childData.find(c => c.id === selectedChild)?.dailyLimit || 120
                }}
                recentActivities={childStats.recentActivities.slice(0, 3)}
              />
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No child selected</h2>
            <p className="text-muted-foreground mb-4">Please select a child to view their dashboard</p>
            <Button>Add Your First Child</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardCard({ 
  title, 
  value, 
  description,
  highlight = false
}: { 
  title: string; 
  value: string; 
  description: string;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? 'border-yellow-500' : ''}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ 
  activity, 
  category,
  time, 
  duration 
}: { 
  activity: string; 
  category: string;
  time: string; 
  duration: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 hover:bg-muted/50 p-2 rounded-md transition-colors">
      <div>
        <p className="font-medium">{activity}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{category}</span>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </div>
      <div className="text-sm font-medium">{duration}</div>
    </div>
  );
}

function ChildProfileCard({ 
  name, 
  avatar,
  timeUsed, 
  timeLimit, 
  deviceId,
  selected,
  onSelect
}: { 
  name: string; 
  avatar: string;
  timeUsed: string; 
  timeLimit: string; 
  deviceId: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const timeParts = {
    used: parseInt(timeUsed),
    limit: parseInt(timeLimit)
  };
  
  const percentUsed = Math.min(100, Math.round((timeParts.used / timeParts.limit) * 100));
  
  let statusColor = 'bg-green-500';
  if (percentUsed > 75) statusColor = 'bg-yellow-500';
  if (percentUsed > 90) statusColor = 'bg-red-500';
  
  return (
    <Card className={`cursor-pointer hover:border-primary transition-colors ${selected ? 'border-primary' : ''}`} onClick={onSelect}>
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
          <div className={`h-3 w-3 rounded-full ${statusColor}`}></div>
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
            <Button variant="outline" size="sm" className="flex-1">View Details</Button>
            <Button variant="outline" size="sm" className="flex-1">Edit Limits</Button>
          </div>
        </div>
      </CardContent>
    </Card>
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