"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/services/authService";
import { safeNavigate } from "@/lib/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }
    
    setLoading(true);
    
    try {
      const user = await authService.login(formData.email, formData.password);
      
      if (user) {
        toast.success("Login successful!");
        safeNavigate(router, "/dashboard", { delay: 300 });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
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
            {/* Parent SVG Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className="h-16 w-16">
              <circle cx="24" cy="24" r="24" fill="#E0E7FF" />
              <ellipse cx="24" cy="20" rx="8" ry="8" fill="#6366F1" />
              <ellipse cx="16" cy="34" rx="6" ry="6" fill="#A5B4FC" />
              <ellipse cx="32" cy="34" rx="6" ry="6" fill="#A5B4FC" />
              <ellipse cx="24" cy="38" rx="10" ry="6" fill="#6366F1" />
              <circle cx="24" cy="20" r="4" fill="#fff" />
            </svg>
          </div>
        </div>
        <Card className="w-full shadow-lg border-t-4 border-t-primary relative z-10">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1">
              <div className="text-center mb-2">
                <div className="inline-block bg-primary/10 p-2 rounded-full">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-8 w-8 text-primary" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access the parental dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input 
                  id="email"
                  name="email"
                  type="email" 
                  placeholder="name@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <Link href="#" className="text-xs text-primary hover:text-primary/80">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password"
                  name="password"
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-10"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                    Logging in...
                  </span>
                ) : "Login"}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex flex-col space-y-2 border-t pt-4">
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account? {" "}
              <Link href="/auth/register" className="text-primary hover:text-primary/80 font-medium">
                Register
              </Link>
            </div>
            <div className="text-sm text-center text-muted-foreground">
              <Link href="/child-login" className="text-primary hover:text-primary/80 font-medium">
                Child Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 