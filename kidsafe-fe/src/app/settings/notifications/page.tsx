"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import Link from "next/link";
import { NavigationButton } from "@/components/ui/navigation-button";
import { LinkButton } from "@/components/ui/link-button";

export default function NotificationsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("parent@example.com");
  const [notifications, setNotifications] = useState({
    dailySummary: true,
    screenTimeAlerts: true,
    newAppInstalled: true,
    contentWarnings: true,
    weeklyReport: true,
  });

  const handleSave = () => {
    // In a real app, this would call an API to save the notification settings
    toast.success("Email notification settings saved successfully!");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Notification Settings</h1>
          <LinkButton href="/dashboard" variant="outline">
            Back to Dashboard
          </LinkButton>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
            <CardDescription>Configure where you want to receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="your@email.com"
              />
              <p className="text-sm text-muted-foreground">All notifications will be sent to this email address</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => toast.success("Email updated successfully!")}>Update Email</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose which notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Daily Summary</h3>
                <p className="text-sm text-muted-foreground">Receive a daily summary of your child's activity</p>
              </div>
              <Switch 
                checked={notifications.dailySummary} 
                onCheckedChange={(checked) => setNotifications({...notifications, dailySummary: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Screen Time Alerts</h3>
                <p className="text-sm text-muted-foreground">Get notified when your child is approaching their screen time limit</p>
              </div>
              <Switch 
                checked={notifications.screenTimeAlerts} 
                onCheckedChange={(checked) => setNotifications({...notifications, screenTimeAlerts: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">New App Installed</h3>
                <p className="text-sm text-muted-foreground">Get notified when your child installs a new app</p>
              </div>
              <Switch 
                checked={notifications.newAppInstalled} 
                onCheckedChange={(checked) => setNotifications({...notifications, newAppInstalled: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Content Warnings</h3>
                <p className="text-sm text-muted-foreground">Get notified about inappropriate content</p>
              </div>
              <Switch 
                checked={notifications.contentWarnings} 
                onCheckedChange={(checked) => setNotifications({...notifications, contentWarnings: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Weekly Report</h3>
                <p className="text-sm text-muted-foreground">Receive a comprehensive weekly activity report</p>
              </div>
              <Switch 
                checked={notifications.weeklyReport} 
                onCheckedChange={(checked) => setNotifications({...notifications, weeklyReport: checked})}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={handleSave}>Save Preferences</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 