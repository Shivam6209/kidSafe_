"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { dashboardService } from "@/services/dashboardService";
import { profileService } from "@/services/profileService";
import { DashboardPanel } from "@/components/ui/dashboard-panel";
import { ChildProfileCard } from "@/components/ChildProfileCard";
import { formatMinutes } from "@/lib/utils";
import { authService } from "@/services/authService";
import { toast } from "sonner";
import { safeNavigate } from "@/lib/navigation";
import { Bell as BellIcon, Clock as ClockIcon } from "lucide-react";
import { NavigationButton } from "@/components/ui/navigation-button";
import { LinkButton } from "@/components/ui/link-button";
import { AiInsightsComponent } from "@/components/AiInsights";

// First, let's define the helper functions at the top of the file

// Helper function to process category data
const processCategoryData = (categories: any[] = []) => {
  // Define our main categories
  const mainCategories = ['gaming', 'entertainment', 'education', 'social-media'];
  
  // Create a new array for the processed categories
  const processedCategories = [];
  
  // Calculate total duration across all categories
  const totalDuration = categories.reduce((total, cat) => total + cat.duration, 0);
  
  // First, add the main categories that exist in the data
  for (const mainCat of mainCategories) {
    const existingCat = categories.find(c => c.category.toLowerCase() === mainCat);
    if (existingCat) {
      processedCategories.push({
        ...existingCat,
        percentage: totalDuration > 0 ? Math.round((existingCat.duration / totalDuration) * 100) : 0
      });
    }
  }
  
  // Calculate "other" as everything that's not in main categories
  const otherCategories = categories.filter(c => !mainCategories.includes(c.category.toLowerCase()));
  const otherDuration = otherCategories.reduce((total, cat) => total + cat.duration, 0);
  
  if (otherDuration > 0) {
    processedCategories.push({
      category: 'other',
      duration: otherDuration,
      percentage: totalDuration > 0 ? Math.round((otherDuration / totalDuration) * 100) : 0
    });
  }
  
  // Sort by duration (highest first)
  return processedCategories.sort((a, b) => b.duration - a.duration);
};

// Create a proper DonutChart component
const DonutChart = ({ data }: { data: { category: string; percentage: number }[] }) => {
  // Define standard colors for the categories
  const categoryColors = {
    'gaming': '#FF5757', // Red
    'entertainment': '#FFB648', // Orange 
    'education': '#4CAF50', // Green
    'social-media': '#29B6F6', // Blue
    'other': '#9E9E9E', // Gray
  };

  // Calculate the circumference
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  
  // Keep track of the current offset
  let currentOffset = 0;
  
  return (
    <div className="flex flex-col items-center">
      {/* SVG Donut Chart */}
      <div className="relative h-[180px] w-[180px]">
        <svg width="180" height="180" viewBox="0 0 200 200">
          <g transform="translate(100, 100)">
            {/* Create the colored segments */}
            {data.map((item, i) => {
              // Calculate the segment size
              const segmentSize = (item.percentage / 100) * circumference;
              // Create the arc for the segment
              const segment = (
                <circle
                  key={item.category}
                  r={radius}
                  cx="0"
                  cy="0"
                  fill="transparent"
                  stroke={categoryColors[item.category as keyof typeof categoryColors] || '#9E9E9E'}
                  strokeWidth="24"
                  strokeDasharray={`${segmentSize} ${circumference - segmentSize}`}
                  strokeDashoffset={-currentOffset}
                  transform="rotate(-90)"
                />
              );
              // Update the offset for the next segment
              currentOffset += segmentSize;
              return segment;
            })}
            {/* Inner white circle */}
            <circle r="48" cx="0" cy="0" fill="white" />
          </g>
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-sm font-medium">Categories</div>
        </div>
      </div>
      
      {/* Legend - moved below the chart to prevent overflow */}
      <div className="w-full mt-2">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {data.map((item, i) => (
            <div key={i} className="flex items-center text-xs">
              <div 
                className="w-3 h-3 mr-1.5 rounded-full" 
                style={{ backgroundColor: categoryColors[item.category as keyof typeof categoryColors] || '#9E9E9E' }}
              />
              <span>{formatCategoryName(item.category)}: {item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Improved bar chart component with better styling
const BarChart = ({ data }: { data: any[] }) => (
  <div className="h-40 w-full rounded-md flex items-end justify-around p-2">
    {data.map((item, i) => (
      <div key={i} className="flex flex-col items-center">
        <div
          className="w-10 bg-primary hover:bg-primary/80 rounded-t-sm transition-all duration-300"
          style={{ height: `${Math.max(5, (item.value / 180) * 100)}%` }}
        ></div>
        <span className="text-xs mt-1">{item.label}</span>
      </div>
    ))}
  </div>
);

// Add back the missing helper functions
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

// Helper function to calculate week-over-week trend percentage
const calculateTrend = (weeklyData: any[]): number => {
  if (weeklyData.length < 7) return 0;
  
  // Get current and previous week's data
  const thisWeek = weeklyData.slice(-4);
  const lastWeek = weeklyData.slice(0, 3);
  
  // Calculate totals
  const thisWeekTotal = thisWeek.reduce((sum, day) => sum + day.value, 0);
  const lastWeekTotal = lastWeek.reduce((sum, day) => sum + day.value, 0);
  
  // Calculate percentage change
  if (lastWeekTotal === 0) return thisWeekTotal > 0 ? 100 : 0;
  
  return Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100);
};

// Component for the weekly comparison chart
const WeeklyComparisonChart = ({ data }: { data: any[] }) => {
  // Split data into this week and last week
  // Assuming data has 7 days
  const thisWeek = data.slice(-4); 
  const lastWeek = data.slice(0, 3);

  const maxValue = Math.max(...data.map(day => day.value)) * 1.2;
  
  return (
    <div className="w-full h-full flex items-end">
      <div className="w-full grid grid-cols-7 h-full">
        {/* Chart columns */}
        {data.map((day, i) => (
          <div key={i} className="flex flex-col items-center h-full">
            <div className="w-full flex-1 flex items-end justify-center px-1">
              <div 
                className={`w-full ${i < 3 ? 'bg-gray-300/60' : 'bg-primary/60'} rounded-t`}
                style={{ height: `${(day.value / maxValue) * 100}%` }}
              />
            </div>
            <div className="text-xs mt-2 text-center">
              {day.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const [childData, setChildData] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [childStats, setChildStats] = useState<any>(null);
  const [allChildrenStats, setAllChildrenStats] = useState<{[key: string]: any}>({});
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [parent, setParent] = useState<{ name: string; email: string } | null>(null);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [allActivities, setAllActivities] = useState<any[]>([]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await authService.getProfile();
        setParent(userData.user);
        
        const children = await authService.getChildren();
        setChildData(children);
        
        if (children.length > 0) {
          // Check if there's a child ID in the URL query
          const urlParams = new URLSearchParams(window.location.search);
          const childParam = urlParams.get('child');
          
          let childToSelect;
          if (childParam && children.some(c => c.id.toString() === childParam)) {
            childToSelect = childParam;
          } else {
            childToSelect = children[0].id.toString();
          }
          
          setSelectedChild(childToSelect);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  useEffect(() => {
    if (selectedChild) {
      fetchChildStats(parseInt(selectedChild), true);
    }
  }, [selectedChild]);
  
  useEffect(() => {
    if (childData.length > 0) {
      fetchAllChildrenStats();
    }
  }, [childData]);
  
  // Add a useEffect to check for dashboard refresh flag
  useEffect(() => {
    const checkForRefresh = () => {
      if (typeof window !== 'undefined') {
        const shouldRefresh = localStorage.getItem('refreshDashboard');
        if (shouldRefresh === 'true') {
          // Clear the flag
          localStorage.removeItem('refreshDashboard');
          
          // Refresh data for all children
          if (childData.length > 0) {
            fetchAllChildrenStats();
            if (selectedChild) {
              fetchChildStats(parseInt(selectedChild), false);
            }
          }
        }
      }
    };
    
    // Check when component mounts
    checkForRefresh();
    
    // Also check when window gains focus (user returns to the tab)
    const handleFocus = () => {
      checkForRefresh();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [childData, selectedChild]);
  
  const fetchAllChildrenStats = async () => {
    const statsObj: {[key: string]: any} = {};
    
    // Fetch stats for all children
    for (const child of childData) {
      try {
        const stats = await dashboardService.getChildStats(child.id);
        if (stats) {
          // Process stats for this child
          const processedStats = {
            ...stats,
            totalTimeToday: stats.totalTimeToday || 0,
            remainingTime: stats.remainingTime || 0,
            weeklyAverage: Math.round(stats.weeklyAverage || 0),
            mostUsedApp: stats.recentActivities && stats.recentActivities.length > 0 
              ? { name: stats.recentActivities[0].name, duration: stats.recentActivities[0].duration }
              : { name: 'None', duration: 0 },
            categoryBreakdown: processCategoryData(stats.categoryBreakdown || [])
          };
          
          statsObj[child.id.toString()] = processedStats;
        }
      } catch (error) {
        console.error(`Error fetching stats for child ID ${child.id}:`, error);
      }
    }
    
    setAllChildrenStats(statsObj);
  };
  
  const fetchChildStats = async (childId: number, updateUrl = false) => {
    try {
      if (childId) {
        setLoading(true);
        
        // Try to get stats from API
        const stats = await dashboardService.getChildStats(childId);
        
        // Check if we got any activities back
        if (!stats || !stats.recentActivities || stats.recentActivities.length === 0) {
          // No activities - show empty state
          setChildStats(null);
          setAllActivities([]);
        } else {
          // Process the data for proper display
          const processedStats = {
            ...stats,
            // Ensure we have proper values for display
            totalTimeToday: stats.totalTimeToday || 0,
            remainingTime: stats.remainingTime || 0,
            // Round the weekly average to a whole number to avoid decimals
            weeklyAverage: Math.round(stats.weeklyAverage || 0),
            // Find the most used app from recent activities instead of mostVisitedSites
            mostUsedApp: stats.recentActivities && stats.recentActivities.length > 0 
              ? { name: stats.recentActivities[0].name, duration: stats.recentActivities[0].duration }
              : { name: 'None', duration: 0 },
            // Reorganize categories to only have the 5 we want
            categoryBreakdown: processCategoryData(stats.categoryBreakdown || [])
          };
          
          setChildStats(processedStats);
          
          // Set all activities for the full activity view
          setAllActivities(stats.recentActivities);
          
          // Fetch weekly data
          const weekly = await dashboardService.getWeeklyData(childId);
          
          if (weekly && weekly.length > 0) {
            // Map weekly data to chart format with appropriate labels
            // Get the current day of week (0 = Sunday, 1 = Monday, etc.)
            const today = new Date();
            const currentDayIndex = today.getDay();
            
            // Create an array of the 7 days of the week leading up to today
            const dayLabels = [];
            for (let i = 6; i >= 0; i--) {
              // Calculate the day index (0-6) for this position
              const dayIndex = (currentDayIndex - i + 7) % 7; 
              dayLabels.push(daysOfWeek[dayIndex]);
            }
            
            // Map the data to match the chart format
            const chartData = dayLabels.map((label, i) => {
              // Find matching data for this day
              const dayData = weekly.find(d => {
                const date = new Date(d.date);
                return date.getDay() === (currentDayIndex - (6 - i) + 7) % 7;
              });
              
              return {
                label,
                value: dayData?.totalTime || 0
              };
            });
            
            setWeeklyData(chartData);
          } else {
            // No weekly data, create empty chart
            const emptyChartData = daysOfWeek.slice(0, 7).map(day => ({ 
              label: day, 
              value: 0 
            }));
            setWeeklyData(emptyChartData);
          }
        }
        
        // Update URL if requested
        if (updateUrl) {
          const url = new URL(window.location.href);
          url.searchParams.set('child', childId.toString());
          window.history.pushState({}, '', url.toString());
        }
      }
    } catch (error) {
      console.error('Error fetching child stats:', error);
      setChildStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = () => {
    safeNavigate(router, '/profile/add-child');
  };

  const handleViewAllActivity = () => {
    setShowAllActivities(true);
  };

  const handleBackToOverview = () => {
    setShowAllActivities(false);
  };

  // Navigation handlers
  const handleSettingsClick = (page: string) => {
    safeNavigate(router, page);
  };

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
              <span className="text-sm mr-2">Hi, {parent?.name || "Parent"}</span>
              <Avatar>
                <AvatarImage src="/avatars/parent.png" alt="Parent" />
                <AvatarFallback>{parent?.name ? parent.name.split(' ').map(n => n[0]).join('').toUpperCase() : "P"}</AvatarFallback>
              </Avatar>
            </div>
            <LinkButton variant="outline" href="/profile">
              Profile Dashboard
            </LinkButton>
            <LinkButton variant="outline" href="/">
              Logout
            </LinkButton>
          </div>
        </div>
        
        {childData.length > 0 ? (
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Select Child:</label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {childData.map(child => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child.id.toString())}
                  className={`flex items-center p-2 rounded-lg transition-colors ${
                    selectedChild === child.id.toString() 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
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
        ) : null}
        
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading child data...</p>
            </div>
          </div>
        ) : childData.length === 0 ? (
          <div className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No child profiles yet</h2>
            <p className="text-muted-foreground mb-4">Add your first child to start monitoring their screen time</p>
            <Button onClick={handleAddChild}>Add Your First Child</Button>
          </div>
        ) : !childStats ? (
          <div className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No data yet for this child</h2>
            <p className="text-muted-foreground mb-4">This child has no activity or stats yet. You can wait for real activity data.</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              {showAllActivities ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>All Activities</CardTitle>
                        <CardDescription>Complete activity history for {childData.find(c => c.id.toString() === selectedChild)?.name}</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleBackToOverview}>
                        Back to Overview
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {allActivities.length > 0 ? (
                      <div className="space-y-3">
                        {allActivities.map((activity: any, index: number) => (
                          <ActivityItem 
                            key={`${activity.id}-${index}`}
                            activity={activity.name} 
                            category={formatCategoryName(activity.category || 'other')}
                            time={formatTimeAgo(activity.timestamp)} 
                            duration={formatMinutes(activity.duration)} 
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="py-4 text-center text-muted-foreground">
                        No activities recorded
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="overview" className="px-4 py-2">Overview</TabsTrigger>
                    <TabsTrigger value="insights" className="px-4 py-2">AI Insights</TabsTrigger>
                    <TabsTrigger value="children" className="px-4 py-2">Children</TabsTrigger>
                    <TabsTrigger value="settings" className="px-4 py-2">Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <DashboardCard
                        title="Daily Screen Time"
                        value={formatMinutes(childStats?.totalTimeToday || 0)}
                        description="Time spent today"
                      />
                      <DashboardCard
                        title="Weekly Average"
                        value={formatMinutes(childStats?.weeklyAverage || 0)}
                        description="Average time per day"
                      />
                      <DashboardCard
                        title="Remaining Today"
                        value={formatMinutes(childStats?.remainingTime || 0)}
                        description={`${childData.find(c => c.id.toString() === selectedChild)?.name}'s daily limit: ${formatMinutes(childData.find(c => c.id.toString() === selectedChild)?.dailyLimit || 0)}`}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <AiInsightsComponent 
                        childId={parseInt(selectedChild || "0")} 
                        childName={childData.find(c => c.id.toString() === selectedChild)?.name || "Child"} 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle>Content Categories</CardTitle>
                          <CardDescription>Usage by category</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                          {childStats && childStats.categoryBreakdown && childStats.categoryBreakdown.length > 0 ? (
                            <div className="w-full max-w-xs relative">
                              <DonutChart data={childStats.categoryBreakdown} />
                            </div>
                          ) : (
                            <div className="h-40 flex items-center justify-center text-muted-foreground">
                              No category data available
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Top Apps</CardTitle>
                          <CardDescription>Most used applications</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {childStats && childStats.recentActivities && childStats.recentActivities.length > 0 ? (
                            <div className="space-y-4">
                              {childStats.recentActivities
                                .slice(0, 4)
                                .map((activity: any, index: number) => (
                                  <div key={index} className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-3 h-3 rounded-full ${
                                        index === 0 ? 'bg-red-500' : 
                                        index === 1 ? 'bg-yellow-500' : 
                                        index === 2 ? 'bg-green-500' : 
                                        'bg-blue-500'
                                      }`}></div>
                                      <span>{activity.name}</span>
                                    </div>
                                    <span className="text-sm">{formatMinutes(activity.duration)}</span>
                                  </div>
                              ))}
                            </div>
                          ) : (
                            <div className="h-40 flex items-center justify-center text-muted-foreground">
                              No app usage data available
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Latest activities from {childData.find(c => c.id.toString() === selectedChild)?.name}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {childStats && childStats.recentActivities && childStats.recentActivities.length > 0 ? (
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
                        ) : (
                          <div className="py-4 text-center text-muted-foreground">
                            No recent activities recorded
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={handleViewAllActivity}
                        >
                          View All Activity
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="insights" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>AI-Powered Insights</CardTitle>
                        <CardDescription>Smart analysis of {childData.find(c => c.id.toString() === selectedChild)?.name}'s usage patterns</CardDescription>
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
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Weekly Comparison</CardTitle>
                        <CardDescription>Week-over-week screen time usage</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {weeklyData.length > 0 ? (
                          <div className="space-y-4">
                            <div className="h-60">
                              <WeeklyComparisonChart data={weeklyData} />
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="p-3 bg-accent rounded-lg">
                                <div className="font-medium">Weekly Average</div>
                                <div className="text-2xl mt-1">{formatMinutes(childStats.weeklyAverage)}</div>
                                <div className="text-muted-foreground text-xs mt-1">
                                  {childStats.weeklyAverage > childData.find(c => c.id.toString() === selectedChild)?.dailyLimit ? '↑' : '↓'} 
                                  {Math.abs(Math.round(((childStats.weeklyAverage - (childData.find(c => c.id.toString() === selectedChild)?.dailyLimit || 120)) / (childData.find(c => c.id.toString() === selectedChild)?.dailyLimit || 120)) * 100))}% 
                                  from daily limit
                                </div>
                              </div>
                              <div className="p-3 bg-accent rounded-lg">
                                <div className="font-medium">Week Trend</div>
                                <div className="text-2xl mt-1">{calculateTrend(weeklyData) > 0 ? '↑' : calculateTrend(weeklyData) < 0 ? '↓' : '→'}</div>
                                <div className="text-muted-foreground text-xs mt-1">
                                  {Math.abs(calculateTrend(weeklyData))}% {calculateTrend(weeklyData) > 0 ? 'increase' : calculateTrend(weeklyData) < 0 ? 'decrease' : 'no change'} from last week
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-40 flex items-center justify-center text-muted-foreground">
                            No weekly data available
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="children" className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Child Profiles</h2>
                      <Button onClick={handleAddChild}>Add Child</Button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {childData.map(child => {
                        // Get child stats from the allChildrenStats object
                        const childStat = allChildrenStats[child.id.toString()];
                        const timeUsed = childStat ? formatMinutes(childStat.totalTimeToday || 0) : "0 min";
                        
                        return (
                          <ChildProfileCard 
                            key={child.id}
                            id={child.id}
                            name={child.name} 
                            avatar={child.avatar}
                            timeUsed={timeUsed} 
                            timeLimit={formatMinutes(child.dailyLimit)} 
                            deviceId={child.deviceId} 
                            selected={selectedChild === child.id.toString()}
                            onSelect={() => setSelectedChild(child.id.toString())}
                          />
                        );
                      })}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>Manage settings for your KidSafe account</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="text-center p-6">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-muted-foreground"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                          <h3 className="text-lg font-medium mb-2">Account Management</h3>
                          <p className="text-muted-foreground mb-4">
                            Manage your profile, account settings, children profiles, and subscription in the dedicated User Profile dashboard.
                          </p>
                          <Button asChild>
                            <Link href="/profile">Go to Profile Dashboard</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Settings</CardTitle>
                        <CardDescription>Frequently used settings</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Notifications</h3>
                            <p className="text-sm text-muted-foreground">Receive email alerts</p>
                          </div>
                          <Button
                            variant="outline"
                            className="flex items-center rounded-full"
                            onClick={() => handleSettingsClick('/settings/notifications')}
                          >
                            <BellIcon className="mr-2 h-4 w-4" />
                            <span>Notifications</span>
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Time Limits</h3>
                            <p className="text-sm text-muted-foreground">Set default time limits</p>
                          </div>
                          <Button
                            variant="outline"
                            className="flex items-center rounded-full"
                            onClick={() => handleSettingsClick('/settings/time-limits')}
                          >
                            <ClockIcon className="mr-2 h-4 w-4" />
                            <span>Time Limits</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </div>
            
            {/* Right-hand KidSafe dashboard panel */}
            <div className="lg:w-80">
              {childStats && (
                <DashboardPanel 
                  childName={childData.find(c => c.id.toString() === selectedChild)?.name || "Child"}
                  usageData={{
                    totalTimeToday: childStats.totalTimeToday,
                    remainingTime: childStats.remainingTime,
                    dailyLimit: childData.find(c => c.id.toString() === selectedChild)?.dailyLimit || 120
                  }}
                  recentActivities={childStats.recentActivities.slice(0, 3)}
                  childId={parseInt(selectedChild || "0")}
                />
              )}
            </div>
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
}: { 
  title: string; 
  value: string; 
  description: string;
}) {
  return (
    <Card>
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