"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { profileService } from "@/services/profileService";
import { NavigationButton } from "@/components/ui/navigation-button";
import { toast } from "sonner";

export default function AddChildPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    dailyLimit: 120, // Default 2 hours
    deviceId: "",
    avatar: "avatar1.png", // Default avatar
    blockedWebsites: [] as string[] // Initialize empty array for blocked websites
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.name.trim()) {
      setError("Please enter a name for your child");
      return;
    }
    
    setLoading(true);
    
    try {
      await profileService.addChild(formData);
      toast.success("Child added successfully!");
      // Use direct navigation for reliability
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error adding child:", error);
      setError("Failed to add child. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-blue-50 to-purple-50 flex items-center justify-center relative overflow-hidden p-4">
      {/* Blurred shapes for background, matching dashboard */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl z-0"></div>
      <div className="pointer-events-none absolute top-1/2 right-0 w-80 h-80 rounded-full bg-purple-400/20 blur-3xl z-0"></div>
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-pink-400/20 blur-3xl z-0"></div>
      <div className="relative z-10 w-full max-w-md">
        <Card className="w-full shadow-xl border-t-4 border-t-primary rounded-2xl bg-white/90 backdrop-blur-md">
          <CardHeader className="space-y-1 pt-8 pb-4 flex flex-col items-center">
            <div className="inline-block bg-primary/10 p-3 rounded-full mb-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-10 w-10 text-primary" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Add Child Profile</CardTitle>
            <CardDescription className="text-center text-base text-muted-foreground mt-2">
              Create a new profile for your child to monitor their screen time
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-2 pb-0">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Child's Name</label>
                <Input
                  id="name"
                  placeholder="Enter child's name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="dailyLimit" className="text-sm font-medium">Daily Time Limit (minutes)</label>
                <Input
                  id="dailyLimit"
                  type="number"
                  min="15"
                  max="1440"
                  step="15"
                  value={formData.dailyLimit}
                  onChange={(e) => setFormData({ ...formData, dailyLimit: parseInt(e.target.value) })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 15 minutes, maximum 24 hours (1440 minutes)
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="deviceId" className="text-sm font-medium">Device ID (Optional)</label>
                <Input
                  id="deviceId"
                  placeholder="Leave blank to auto-generate"
                  value={formData.deviceId}
                  onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  A unique identifier for your child's device. If left blank, one will be generated automatically.
                </p>
              </div>
              {error && (
                <div className="text-sm text-red-500 bg-red-50 p-2 rounded mt-2">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-3 pt-2 pb-8">
              <div className="flex gap-2 justify-between mt-6">
                <NavigationButton variant="outline" href="/profile">
                  Cancel
                </NavigationButton>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                      Adding...
                    </span>
                  ) : "Add Child"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
} 