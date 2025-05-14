"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import Link from "next/link";
import { formatMinutes } from "@/lib/utils";
import { NavigationButton } from "@/components/ui/navigation-button";

export default function TimeLimitsPage() {
  const router = useRouter();
  const [defaultLimits, setDefaultLimits] = useState({
    dailyLimit: 120, // 2 hours
    weekdayLimit: 120,
    weekendLimit: 180, // 3 hours
    bedtime: "21:00",
    enableBedtime: true,
    enforceTimeouts: true,
    allowOverrides: false,
  });

  const [categoryLimits, setCategoryLimits] = useState({
    gaming: 60, // 1 hour
    social: 45, // 45 min
    entertainment: 90, // 1.5 hours
    education: 240, // no real limit
  });

  const handleDailyLimitChange = (value: number[]) => {
    setDefaultLimits({
      ...defaultLimits,
      dailyLimit: value[0],
    });
  };

  const handleCategoryChange = (category: keyof typeof categoryLimits, value: number[]) => {
    setCategoryLimits({
      ...categoryLimits,
      [category]: value[0],
    });
  };

  const handleSave = () => {
    // In a real app, this would call an API to save the time limit settings
    toast.success("Time limit settings saved successfully!");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Screen Time Limits</h1>
          <NavigationButton href="/dashboard" variant="outline">
            Back to Dashboard
          </NavigationButton>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Default Time Limits</CardTitle>
            <CardDescription>Set default screen time limits for all children</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Daily Screen Time Limit</Label>
                <span className="font-medium">{formatMinutes(defaultLimits.dailyLimit)}</span>
              </div>
              <Slider 
                defaultValue={[defaultLimits.dailyLimit]} 
                max={360} 
                step={15} 
                onValueChange={handleDailyLimitChange}
              />
              <p className="text-sm text-muted-foreground">This is the default amount of screen time allowed per day</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="weekdayLimit">Weekday Limit</Label>
                <div className="flex">
                  <Input
                    id="weekdayLimit"
                    type="number"
                    value={defaultLimits.weekdayLimit / 60}
                    onChange={(e) => setDefaultLimits({...defaultLimits, weekdayLimit: Number(e.target.value) * 60})}
                    min={0}
                    max={10}
                    className="w-20 mr-2"
                  />
                  <span className="flex items-center">hours</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="weekendLimit">Weekend Limit</Label>
                <div className="flex">
                  <Input
                    id="weekendLimit"
                    type="number"
                    value={defaultLimits.weekendLimit / 60}
                    onChange={(e) => setDefaultLimits({...defaultLimits, weekendLimit: Number(e.target.value) * 60})}
                    min={0}
                    max={10}
                    className="w-20 mr-2"
                  />
                  <span className="flex items-center">hours</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <h3 className="font-medium">Enforce Bedtime</h3>
                <p className="text-sm text-muted-foreground">Disable all devices after bedtime</p>
              </div>
              <Switch 
                checked={defaultLimits.enableBedtime} 
                onCheckedChange={(checked) => setDefaultLimits({...defaultLimits, enableBedtime: checked})}
              />
            </div>

            {defaultLimits.enableBedtime && (
              <div className="space-y-2 pl-4 border-l-2 border-accent">
                <Label htmlFor="bedtime">Bedtime</Label>
                <Input
                  id="bedtime"
                  type="time"
                  value={defaultLimits.bedtime}
                  onChange={(e) => setDefaultLimits({...defaultLimits, bedtime: e.target.value})}
                  className="w-36"
                />
                <p className="text-sm text-muted-foreground">All devices will be disabled at this time</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div>
                <h3 className="font-medium">Enforce Timeouts</h3>
                <p className="text-sm text-muted-foreground">Require breaks after continuous usage</p>
              </div>
              <Switch 
                checked={defaultLimits.enforceTimeouts} 
                onCheckedChange={(checked) => setDefaultLimits({...defaultLimits, enforceTimeouts: checked})}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <h3 className="font-medium">Allow Parent Override</h3>
                <p className="text-sm text-muted-foreground">Children can request additional time</p>
              </div>
              <Switch 
                checked={defaultLimits.allowOverrides} 
                onCheckedChange={(checked) => setDefaultLimits({...defaultLimits, allowOverrides: checked})}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Limits</CardTitle>
            <CardDescription>Set specific time limits by content category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Gaming</Label>
                <span className="font-medium">{formatMinutes(categoryLimits.gaming)}</span>
              </div>
              <Slider 
                defaultValue={[categoryLimits.gaming]} 
                max={240} 
                step={15} 
                onValueChange={(value: number[]) => handleCategoryChange('gaming', value)}
                className="bg-red-100"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Social Media</Label>
                <span className="font-medium">{formatMinutes(categoryLimits.social)}</span>
              </div>
              <Slider 
                defaultValue={[categoryLimits.social]} 
                max={240} 
                step={15} 
                onValueChange={(value: number[]) => handleCategoryChange('social', value)}
                className="bg-blue-100"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Entertainment</Label>
                <span className="font-medium">{formatMinutes(categoryLimits.entertainment)}</span>
              </div>
              <Slider 
                defaultValue={[categoryLimits.entertainment]} 
                max={240} 
                step={15} 
                onValueChange={(value: number[]) => handleCategoryChange('entertainment', value)}
                className="bg-yellow-100"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Education</Label>
                <span className="font-medium">{formatMinutes(categoryLimits.education)}</span>
              </div>
              <Slider 
                defaultValue={[categoryLimits.education]} 
                max={360} 
                step={15} 
                onValueChange={(value: number[]) => handleCategoryChange('education', value)}
                className="bg-green-100"
              />
              <p className="text-sm text-muted-foreground">Educational content has higher limits by default</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={handleSave}>Save Settings</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 