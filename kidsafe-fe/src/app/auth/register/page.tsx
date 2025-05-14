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

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  
  // Add state for OTP verification
  const [otpCode, setOtpCode] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Reset email verification if email changes
    if (name === 'email') {
      setEmailVerified(false);
    }
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError("Please enter your name");
      return false;
    }
    if (!formData.email.includes('@')) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!emailVerified) {
      setError("Please verify your email address before continuing");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError("");
    if (validateStep1()) {
      setStep(2);
    }
  };
  
  const handleSendOtp = async () => {
    if (!formData.email || !formData.email.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }
    
    try {
      setSendingOtp(true);
      const result = await authService.sendOtp(formData.email);
      toast.success(result.message || "Verification code sent to your email");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError(error instanceof Error ? error.message : "Failed to send verification code");
    } finally {
      setSendingOtp(false);
    }
  };
  
  const handleVerifyOtp = async () => {
    if (!formData.email || !otpCode) {
      setError("Please enter the verification code");
      return;
    }
    
    try {
      setVerifyingOtp(true);
      const result = await authService.verifyOtp(formData.email, otpCode);
      toast.success(result.message || "Email verified successfully!");
      setEmailVerified(true);
      setOtpCode("");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError(error instanceof Error ? error.message : "Failed to verify code");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateStep2()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const user = await authService.register(
        formData.name,
        formData.email,
        formData.password
      );
      
      if (user) {
        toast.success("Registration successful!");
        safeNavigate(router, "/dashboard", { delay: 500 });
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Set up your parent account to manage your children's screen time
            </CardDescription>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex-1">
                <div className={`h-2 rounded-l-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`}></div>
              </div>
              <div className="mx-1 text-xs font-bold text-muted-foreground">
                {step}/2
              </div>
              <div className="flex-1">
                <div className={`h-2 rounded-r-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                  <Input 
                    id="name"
                    name="name"
                    type="text" 
                    placeholder="John Doe" 
                    value={formData.name}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input 
                    id="email"
                    name="email"
                    type="email" 
                    placeholder="name@example.com" 
                    value={formData.email}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                
                {/* Email Verification Section */}
                <div className="p-3 border rounded-md space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Verify Your Email</h4>
                    {emailVerified && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  
                  {!emailVerified ? (
                    <>
                      <p className="text-xs text-muted-foreground">
                        We'll send a verification code to your email
                      </p>
                      <div className="flex gap-2">
                        <Input
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="6-digit code"
                          maxLength={6}
                          disabled={!formData.email}
                        />
                        <Button 
                          onClick={handleVerifyOtp}
                          disabled={verifyingOtp || otpCode.length !== 6}
                          size="sm"
                        >
                          {verifyingOtp ? "Verifying..." : "Verify"}
                        </Button>
                      </div>
                      <Button 
                        variant="outline" 
                        className="text-xs w-full"
                        onClick={handleSendOtp}
                        disabled={sendingOtp || !formData.email}
                      >
                        {sendingOtp ? "Sending..." : "Send Verification Code"}
                      </Button>
                    </>
                  ) : (
                    <p className="text-xs text-green-600">
                      Your email has been successfully verified.
                    </p>
                  )}
                </div>
                
                <Button 
                  type="button" 
                  className="w-full" 
                  onClick={handleNextStep}
                  disabled={!emailVerified}
                >
                  Continue
                </Button>
              </div>
            )}
            
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <Input 
                    id="password"
                    name="password"
                    type="password" 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
                  <Input 
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password" 
                    placeholder="••••••••" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                        Creating...
                      </span>
                    ) : "Register"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          
          <CardFooter className="text-sm text-center text-muted-foreground border-t pt-4">
            Already have an account? {" "}
            <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium">
              Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 