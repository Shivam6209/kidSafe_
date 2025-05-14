"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import Link from "next/link";
import { authService } from "@/services/authService";
import { profileService } from "@/services/profileService";
import { formatMinutes } from "@/lib/utils";
import { NavigationButton } from "@/components/ui/navigation-button";
import { LinkButton } from "@/components/ui/link-button";

export default function EditChildLimitsPage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [childName, setChildName] = useState("");
  const [childObj, setChildObj] = useState<any>(null);
  
  const [limits, setLimits] = useState({
    dailyLimit: 120, // 2 hours default
    blockedWebsites: [] as string[],
  });

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        setLoading(true);
        
        // Get child profile
        const children = await authService.getChildren();
        const child = children.find(c => c.id.toString() === childId) as any;
        
        if (child) {
          setChildName(child.name);
          setChildObj(child);
          
          // Use actual data from child profile
          setLimits({
            dailyLimit: child.dailyLimit || limits.dailyLimit,
            blockedWebsites: child.blockedWebsites || [],
          });
        } else {
          toast.error("Child not found");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching child data:", error);
        toast.error("Failed to load child data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchChildData();
  }, [childId, router]);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Prepare the data for the API
      const updateData = {
        dailyLimit: limits.dailyLimit,
        blockedWebsites: limits.blockedWebsites,
      };
      
      console.log("Sending data to API:", updateData);
      
      // Call the API to update the child's limits
      const response = await profileService.updateChild(parseInt(childId), updateData);
      console.log("API response:", response);
      
      toast.success(`Settings for ${childName} updated successfully!`);
      
      // Force refresh dashboard data when returning
      localStorage.setItem('refreshDashboard', 'true');
      
      // Navigate back to dashboard after successful save
      router.push(`/dashboard?child=${childId}`);
    } catch (error) {
      console.error("Error saving limits:", error);
      if (error instanceof Error) {
        toast.error(`Failed to save settings: ${error.message}`);
      } else {
        toast.error("Failed to save settings. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading child data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Edit Settings for {childName}</h1>
          <LinkButton href={`/dashboard?child=${childId}`} variant="outline">
            Back to Dashboard
          </LinkButton>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Screen Time & Content Settings</CardTitle>
            <CardDescription>Configure screen time limits and blocked websites for {childName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="dailyLimit">Daily Screen Time Limit (minutes)</Label>
              <Input
                id="dailyLimit"
                type="number"
                value={limits.dailyLimit}
                onChange={(e) => setLimits({...limits, dailyLimit: Number(e.target.value)})}
                min={0}
                max={720}
              />
              <p className="text-sm text-muted-foreground">
                Current daily limit: {formatMinutes(limits.dailyLimit)}
              </p>
            </div>

            <div className="p-3 bg-amber-50 text-amber-800 rounded-md text-sm">
              <p className="font-medium">Note: Currently only the daily screen time limit and blocked websites can be configured.</p>
              <p>Additional features such as bedtime scheduling, app blocking, and educational overtime are coming soon.</p>
            </div>

            <div className="space-y-2">
              <Label>Blocked Websites</Label>
              <div className="flex flex-wrap gap-2">
                {limits.blockedWebsites.map((website, index) => (
                  <div key={index} className="bg-muted px-3 py-1 rounded-full flex items-center gap-2">
                    <span>{website}</span>
                    <button 
                      className="text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => setLimits({
                        ...limits, 
                        blockedWebsites: limits.blockedWebsites.filter((_, i) => i !== index)
                      })}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const website = prompt("Enter website to block:");
                    if (website && !limits.blockedWebsites.includes(website)) {
                      setLimits({...limits, blockedWebsites: [...limits.blockedWebsites, website]});
                    }
                  }}
                >
                  + Add Website
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                  Saving...
                </span>
              ) : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 