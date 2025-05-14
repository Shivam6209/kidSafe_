"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authService } from "@/services/authService";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { safeNavigate } from "@/lib/navigation";
import { NavigationButton } from "@/components/ui/navigation-button";
import { LinkButton } from "@/components/ui/link-button";

export default function ProfilePage() {
  const router = useRouter();
  const [parent, setParent] = useState<{ name: string; email: string, isVerified?: boolean } | null>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    emailNotifications: true,
    timeAlerts: true
  });
  
  // Add state for OTP verification
  const [showVerification, setShowVerification] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userData = await authService.getProfile();
        setParent(userData.user);
        setFormData({
          name: userData.user?.name || "",
          emailNotifications: true,
          timeAlerts: true
        });
        
        // Fetch children data
        const childrenData = await authService.getChildren();
        setChildren(childrenData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
        safeNavigate(router, '/auth/login');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [router]);

  const handleSaveChanges = async () => {
    try {
      // This would call a real API in production
      toast.success('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddChild = () => {
    safeNavigate(router, '/profile/add-child');
  };

  const handleSendOtp = async () => {
    if (!parent?.email) return;
    
    try {
      setSendingOtp(true);
      const result = await authService.sendOtp(parent.email);
      toast.success(result.message || "Verification code sent to your email");
      setShowVerification(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send verification code");
    } finally {
      setSendingOtp(false);
    }
  };
  
  const handleVerifyOtp = async () => {
    if (!parent?.email || !otpCode) return;
    
    try {
      setVerifyingOtp(true);
      const result = await authService.verifyOtp(parent.email, otpCode);
      toast.success(result.message || "Email verified successfully!");
      setShowVerification(false);
      setOtpCode("");
      
      // Update parent state with verified status
      setParent(prev => prev ? {...prev, isVerified: true} : null);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error instanceof Error ? error.message : "Failed to verify code");
    } finally {
      setVerifyingOtp(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-white via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Blurred shapes for background */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl z-0"></div>
      <div className="pointer-events-none absolute top-1/2 right-0 w-80 h-80 rounded-full bg-purple-400/20 blur-3xl z-0"></div>
      <div className="relative z-10 max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">User Profile</h1>
            <p className="text-muted-foreground">Manage your profile, children, and account settings</p>
          </div>
          <div className="flex gap-4">
            <LinkButton 
              variant="outline" 
              href="/dashboard"
            >
              Back to Dashboard
            </LinkButton>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="mr-4 p-3 rounded-full bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Registered Children</p>
                <h3 className="text-2xl font-bold">{children.length}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="mr-4 p-3 rounded-full bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Account Status</p>
                <h3 className="text-lg font-bold">Active</h3>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="account" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">Account Settings</TabsTrigger>
            <TabsTrigger value="children">Children</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="mt-6">
            {/* Profile Card */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account settings and preferences</CardDescription>
                  </div>
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/avatars/parent.png" alt="Profile" />
                    <AvatarFallback>{parent?.name ? parent.name.split(' ').map(n => n[0]).join('').toUpperCase() : "P"}</AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {editMode ? (
                  // Edit Form
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div>
                      <Label className="text-base">Email</Label>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">{parent?.email || ""}</p>
                        {parent?.isVerified ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Verified</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">Not Verified</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                    </div>
                    {!parent?.isVerified && !showVerification && (
                      <div className="mt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleSendOtp}
                          disabled={sendingOtp}
                        >
                          {sendingOtp ? "Sending..." : "Verify Email"}
                        </Button>
                      </div>
                    )}
                    
                    {showVerification && (
                      <div className="mt-2 p-3 border rounded-md space-y-3">
                        <h4 className="text-sm font-medium">Verify Your Email</h4>
                        <p className="text-xs text-muted-foreground">Enter the verification code sent to your email</p>
                        <div className="flex gap-2">
                          <Input
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="6-digit code"
                            maxLength={6}
                          />
                          <Button 
                            onClick={handleVerifyOtp}
                            disabled={verifyingOtp || otpCode.length !== 6}
                          >
                            {verifyingOtp ? "Verifying..." : "Verify"}
                          </Button>
                        </div>
                        <Button 
                          variant="link" 
                          className="text-xs p-0 h-auto"
                          onClick={handleSendOtp}
                          disabled={sendingOtp}
                        >
                          {sendingOtp ? "Sending..." : "Resend Code"}
                        </Button>
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <Label className="text-base">Notification Preferences</Label>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emailNotifications" className="cursor-pointer">Email notifications</Label>
                        <Switch 
                          id="emailNotifications" 
                          checked={formData.emailNotifications}
                          onCheckedChange={(checked: boolean) => setFormData({...formData, emailNotifications: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="timeAlerts" className="cursor-pointer">Screen time limit alerts</Label>
                        <Switch 
                          id="timeAlerts" 
                          checked={formData.timeAlerts}
                          onCheckedChange={(checked: boolean) => setFormData({...formData, timeAlerts: checked})}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium">Email</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">{parent?.email || ""}</p>
                        {parent?.isVerified ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Verified</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">Not Verified</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium">Name</h3>
                      <p className="text-sm text-muted-foreground">{parent?.name || ""}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Notification Preferences</h3>
                      <div className="flex items-center mt-1">
                        <input type="checkbox" id="emailNotif" className="mr-2 h-4 w-4" checked={formData.emailNotifications} readOnly />
                        <label htmlFor="emailNotif" className="text-sm">Email notifications</label>
                      </div>
                      <div className="flex items-center mt-1">
                        <input type="checkbox" id="limitNotif" className="mr-2 h-4 w-4" checked={formData.timeAlerts} readOnly />
                        <label htmlFor="limitNotif" className="text-sm">Screen time limit alerts</label>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {editMode ? (
                  <div className="flex gap-4 w-full">
                    <Button variant="outline" className="flex-1" onClick={() => setEditMode(false)}>Cancel</Button>
                    <Button className="flex-1" onClick={handleSaveChanges}>Save Changes</Button>
                  </div>
                ) : (
                  <Button variant="default" onClick={() => setEditMode(true)}>Edit Profile</Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="children" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Children Profiles</CardTitle>
                    <CardDescription>Manage your children's profiles and settings</CardDescription>
                  </div>
                  <Button onClick={handleAddChild}>Add Child</Button>
                </div>
              </CardHeader>
              <CardContent>
                {children.length === 0 ? (
                  <div className="text-center p-8">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-muted-foreground"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    <h3 className="text-lg font-medium mb-1">No children profiles yet</h3>
                    <p className="text-muted-foreground mb-4">Add your first child to start monitoring their activity</p>
                    <Button onClick={handleAddChild}>Add Your First Child</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {children.map((child) => (
                      <div key={child.id} className="p-4 border rounded-lg hover:bg-accent/10 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-4">
                              <AvatarImage src={child.avatar} alt={child.name} />
                              <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{child.name}</h3>
                              <p className="text-sm text-muted-foreground">Device ID: {child.deviceId || "Not connected"}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/profile/edit-limits/${child.id}`}>Edit</Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard?child=${child.id}`}>View Activity</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            {/* Security Section */}
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your password and account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Password</h3>
                  <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">Not enabled</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Login Devices</h3>
                  <div className="mt-2 space-y-2">
                    <div className="p-3 border rounded-md flex justify-between items-center">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                        <div>
                          <p className="text-sm font-medium">Windows PC</p>
                          <p className="text-xs text-muted-foreground">Last active: Today</p>
                        </div>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Current</span>
                    </div>
                    <div className="p-3 border rounded-md flex justify-between items-center">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                        <div>
                          <p className="text-sm font-medium">iPhone</p>
                          <p className="text-xs text-muted-foreground">Last active: Yesterday</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50">
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Change Password</Button>
                <Button variant="outline">Enable 2FA</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 