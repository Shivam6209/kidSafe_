"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/services/authService";

export default function ChildLoginPage() {
  const router = useRouter();
  const [deviceId, setDeviceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Mock login - in a real app, this would validate with the server
      const child = await authService.childLogin(deviceId);
      if (child) {
        router.push("/child-login/dashboard");
      }
    } catch (err) {
      setError("Invalid device ID. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Blurred shapes */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl z-0"></div>
      <div className="pointer-events-none absolute top-1/2 right-0 w-80 h-80 rounded-full bg-purple-400/20 blur-3xl z-0"></div>
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-pink-400/20 blur-3xl z-0"></div>
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block bg-white dark:bg-slate-800 p-4 rounded-full shadow-lg mb-4">
            <div className="text-6xl">👦👧</div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Kid's Login</h1>
          <p className="text-muted-foreground">Enter your device ID to see your screen time</p>
        </div>
        
        <Card className="border-t-8 border-t-primary shadow-lg">
          <form onSubmit={handleLogin}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl font-bold text-center">Welcome Back!</CardTitle>
              <CardDescription className="text-center">
                Ask your parent for your Device ID if you don't know it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="deviceId" className="text-sm font-medium">Device ID</label>
                <Input 
                  id="deviceId" 
                  placeholder="device-123" 
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  className="text-center text-lg h-12"
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-lg" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                    Logging in...
                  </span>
                ) : (
                  "Let's Go!"
                )}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium">
                Parent Login
              </Link>
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Ask a parent or guardian
          </p>
        </div>
      </div>
    </div>
  );
} 