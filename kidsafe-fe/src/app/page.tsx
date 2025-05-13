import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="container flex justify-between items-center h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="text-2xl font-bold">KidSafe</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#ai-insights" className="text-sm font-medium hover:text-primary transition-colors group">
              <span className="group-hover:underline underline-offset-4">AI Insights</span>
            </a>
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors group">
              <span className="group-hover:underline underline-offset-4">Features</span>
            </a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors group">
              <span className="group-hover:underline underline-offset-4">How It Works</span>
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <div className="bg-muted/50 rounded-full py-1 px-3 flex items-center gap-3">
              <Link href="/auth/login" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5 group" aria-label="Parent login">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span className="group-hover:underline underline-offset-4">Parent Login</span>
              </Link>
              <span className="text-muted-foreground">|</span>
              <Link href="/child-login" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5 group" aria-label="Child login">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="group-hover:underline underline-offset-4">Child Login</span>
              </Link>
            </div>
            <Link 
              href="/auth/register" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 shadow-sm hover:shadow transition-all"
              aria-label="Register for KidSafe"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Register
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-purple-50 p-0">
          {/* Blurred shapes */}
          <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-3xl z-0"></div>
          <div className="pointer-events-none absolute top-1/2 right-0 w-96 h-96 rounded-full bg-purple-400/20 blur-3xl z-0"></div>
          <div className="pointer-events-none absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-pink-400/20 blur-3xl z-0"></div>
          <div className="container relative z-10 px-4">
            <div className="flex flex-col items-center justify-center w-full gap-6 min-h-[420px] pt-8 pb-8">
              <div className="inline-flex items-center rounded-full bg-gray-200 px-4 py-1 text-sm font-medium text-gray-700 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                AI-Powered Protection
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-black to-purple-600 mb-2 leading-tight">
                Keep Your Children Safe <br /> Online
              </h1>
              <p className="text-lg md:text-xl text-gray-700 text-center mb-6 max-w-2xl">
                Monitor and control your children's screen time and app usage with AI-powered insights. Set time limits, block unwanted content, and get intelligent analysis of their digital habits.
              </p>
              {/* Stats Cards */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">65%</div>
                    <div className="text-gray-600 text-sm">Average screen time reduction</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">97%</div>
                    <div className="text-gray-600 text-sm">Parents report improved focus</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">24/7</div>
                    <div className="text-gray-600 text-sm">Real-time monitoring & alerts</div>
                  </div>
                </div>
              </div>
              {/* CTA Buttons */}
              <div className="flex flex-row items-center justify-center gap-4 mt-2">
                <a href="/auth/register" className="px-8 py-3 rounded-xl text-lg font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow hover:scale-105 hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 5v14M8 5v14M3 10h18" />
                  </svg>
                  Get Started Free
                </a>
                <a href="/child-login" className="px-8 py-3 rounded-xl text-lg font-semibold bg-white border border-gray-200 shadow hover:scale-105 hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Child Login
                </a>
              </div>
            </div>
          </div>
        </section>
        
        {/* AI Insights Section */}
        <section id="ai-insights" className="w-full py-16 md:py-28 lg:py-36 bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden">
          {/* Blurred shapes */}
          <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl z-0"></div>
          <div className="pointer-events-none absolute top-1/2 right-0 w-80 h-80 rounded-full bg-purple-400/20 blur-3xl z-0"></div>
          <div className="pointer-events-none absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-pink-400/20 blur-3xl z-0"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm font-bold text-primary">
                  AI-Powered Protection
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-5xl/tight">
                  Smart Insights for Smart Parenting
                </h2>
                <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed">
                  Our advanced AI technology analyzes your child's digital behavior to provide personalized insights and recommendations that help you make informed decisions about your child's online activities.
                </p>
              </div>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              <div className="group flex flex-col items-start text-left rounded-2xl border border-border/60 p-8 shadow-sm bg-white/80 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-blue-100/60 hover:via-purple-100/60 hover:to-pink-100/60">
                <div className="mb-4 text-3xl text-gray-800"><span role="img" aria-label="Pattern Recognition">📋</span></div>
                <h3 className="text-2xl font-bold mb-2">Pattern Recognition</h3>
                <p className="text-gray-700 mb-4">Our AI identifies usage patterns and alerts you to changes in your child's digital behavior.</p>
                <div className="bg-gray-100 rounded-lg p-3 text-sm w-full"><span className="font-bold">Example:</span> "YouTube usage has increased by 15% this week compared to last week."</div>
              </div>
              <div className="group flex flex-col items-start text-left rounded-2xl border border-border/60 p-8 shadow-sm bg-white/80 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-blue-100/60 hover:via-purple-100/60 hover:to-pink-100/60">
                <div className="mb-4 text-3xl text-gray-800"><span role="img" aria-label="Smart Scheduling">⏰</span></div>
                <h3 className="text-2xl font-bold mb-2">Smart Scheduling</h3>
                <p className="text-gray-700 mb-4">AI recommends optimal screen time limits based on your child's age, activity and habits.</p>
                <div className="bg-gray-100 rounded-lg p-3 text-sm w-full"><span className="font-bold">Example:</span> "Your child exceeds their screen-time limit most often on Fridays after 7 PM."</div>
              </div>
              <div className="group flex flex-col items-start text-left rounded-2xl border border-border/60 p-8 shadow-sm bg-white/80 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-blue-100/60 hover:via-purple-100/60 hover:to-pink-100/60">
                <div className="mb-4 text-3xl text-gray-800"><span role="img" aria-label="Content Classification">✅</span></div>
                <h3 className="text-2xl font-bold mb-2">Content Classification</h3>
                <p className="text-gray-700 mb-4">AI automatically categorizes apps and websites to provide detailed usage breakdown.</p>
                <div className="bg-gray-100 rounded-lg p-3 text-sm w-full"><span className="font-bold">Example:</span> "Educational content makes up only 10% of total screen time."</div>
              </div>
              <div className="group flex flex-col items-start text-left rounded-2xl border border-border/60 p-8 shadow-sm bg-white/80 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-blue-100/60 hover:via-purple-100/60 hover:to-pink-100/60">
                <div className="mb-4 text-3xl text-gray-800"><span role="img" aria-label="Behavioral Insights">⚡</span></div>
                <h3 className="text-2xl font-bold mb-2">Behavioral Insights</h3>
                <p className="text-gray-700 mb-4">Gain deep understanding of your child's digital engagement patterns across devices.</p>
                <div className="bg-gray-100 rounded-lg p-3 text-sm w-full"><span className="font-bold">Example:</span> "Most productive hours are between 3-5 PM on weekdays."</div>
              </div>
              <div className="group flex flex-col items-start text-left rounded-2xl border border-border/60 p-8 shadow-sm bg-white/80 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-blue-100/60 hover:via-purple-100/60 hover:to-pink-100/60">
                <div className="mb-4 text-3xl text-gray-800"><span role="img" aria-label="Personalized Reports">📊</span></div>
                <h3 className="text-2xl font-bold mb-2">Personalized Reports</h3>
                <p className="text-gray-700 mb-4">Receive detailed weekly and monthly reports with actionable recommendations.</p>
                <div className="bg-gray-100 rounded-lg p-3 text-sm w-full"><span className="font-bold">Example:</span> "Gaming activity peaks on weekends, averaging 2 hours per day."</div>
              </div>
              <div className="group flex flex-col items-start text-left rounded-2xl border border-border/60 p-8 shadow-sm bg-white/80 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-blue-100/60 hover:via-purple-100/60 hover:to-pink-100/60">
                <div className="mb-4 text-3xl text-gray-800"><span role="img" aria-label="Real-Time Alerts">🔔</span></div>
                <h3 className="text-2xl font-bold mb-2">Real-Time Alerts</h3>
                <p className="text-gray-700 mb-4">Get instant notifications for important events, such as screen time limit reached or access to blocked content.</p>
                <div className="bg-gray-100 rounded-lg p-3 text-sm w-full"><span className="font-bold">Example:</span> "Alert: Billy Doe just opened YouTube (1h ago)."</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="w-full py-16 md:py-28 lg:py-36 bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden">
          {/* Blurred shapes */}
          <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl z-0"></div>
          <div className="pointer-events-none absolute top-1/2 right-0 w-80 h-80 rounded-full bg-purple-400/20 blur-3xl z-0"></div>
          <div className="pointer-events-none absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-pink-400/20 blur-3xl z-0"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything You Need to Protect Your Children
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  KidSafe provides powerful tools for managing your children's digital experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-primary">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                }
                title="Screen Time Limits"
                description="Set daily time limits for each child and device"
              />
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-primary">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                }
                title="Content Blocking"
                description="Block unwanted websites and apps"
              />
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-primary">
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                  </svg>
                }
                title="Activity Reports"
                description="View detailed reports of your child's digital activity"
              />
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-primary">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                }
                title="Social Media Monitoring"
                description="Keep track of social media usage and activity"
              />
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-primary">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                }
                title="Easy to Use"
                description="Simple setup and user-friendly interface"
              />
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-primary">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                }
                title="Multi-Device Support"
                description="Monitor activity across phones, tablets and computers"
              />
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-16 md:py-28 lg:py-36 bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden">
          {/* Blurred shapes */}
          <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl z-0"></div>
          <div className="pointer-events-none absolute top-1/2 right-0 w-80 h-80 rounded-full bg-purple-400/20 blur-3xl z-0"></div>
          <div className="pointer-events-none absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-pink-400/20 blur-3xl z-0"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Simple Setup, Powerful Protection
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Setting up KidSafe is easy and takes just a few minutes
                </p>
              </div>
            </div>
            
            <div className="mx-auto max-w-5xl py-12">
              <div className="grid gap-8 md:grid-cols-3">
                <div className="flex flex-col items-center text-center space-y-3 bg-white/80 rounded-2xl shadow-md p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-gradient-to-br hover:from-blue-100/60 hover:via-purple-100/60 hover:to-pink-100/60 cursor-pointer">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white text-xl font-bold mb-2">1</div>
                  <h3 className="text-xl font-semibold">Create Account</h3>
                  <p className="text-muted-foreground">Sign up for a KidSafe account and add your child profiles</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-3 bg-white/80 rounded-2xl shadow-md p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-gradient-to-br hover:from-blue-100/60 hover:via-purple-100/60 hover:to-pink-100/60 cursor-pointer">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white text-xl font-bold mb-2">2</div>
                  <h3 className="text-xl font-semibold">Set Up Devices</h3>
                  <p className="text-muted-foreground">Add your children's devices and install the monitoring app</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-3 bg-white/80 rounded-2xl shadow-md p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-gradient-to-br hover:from-blue-100/60 hover:via-purple-100/60 hover:to-pink-100/60 cursor-pointer">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white text-xl font-bold mb-2">3</div>
                  <h3 className="text-xl font-semibold">Monitor & Control</h3>
                  <p className="text-muted-foreground">Set time limits, block content, and view AI-powered reports from your dashboard</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-white via-blue-50 to-purple-50 overflow-hidden">
          {/* Blurred shapes */}
          <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl z-0"></div>
          <div className="pointer-events-none absolute top-1/2 right-0 w-80 h-80 rounded-full bg-purple-400/20 blur-3xl z-0"></div>
          <div className="pointer-events-none absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-pink-400/20 blur-3xl z-0"></div>
          <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center justify-center space-y-6 text-center w-full">
              <div className="space-y-3 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-black mb-2">Ready to Keep Your Children Safe Online?</h2>
                <p className="max-w-[800px] mx-auto text-gray-700 md:text-xl/relaxed mb-8">
                  Create your free account today and start monitoring your children's digital activity with AI-powered insights.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 mt-2 justify-center items-center w-full">
                <a href="/auth/register" className="px-10 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center gap-2 focus:ring-4 focus:ring-blue-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Get Started Free
                </a>
                <a href="/child-login" className="px-10 py-4 rounded-xl text-lg font-semibold bg-white border-2 border-gray-200 text-gray-700 shadow hover:bg-gray-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-300 flex items-center gap-2 focus:ring-4 focus:ring-blue-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Child Login
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-5 bg-background">
        <div className="container mx-auto px-6 flex flex-col-reverse md:flex-row justify-between items-center gap-6">
          {/* Left side: Logo, copyright and tagline */}
          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 bg-primary rounded-lg flex items-center justify-center shadow-sm" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-sm font-medium">
                &copy; {new Date().getFullYear()} KidSafe
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Protecting children's digital lives since 2023</p>
          </div>
          
          {/* Right side: Navigation links with icons */}
          <nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3">
            <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group px-2 py-1 rounded-md hover:bg-muted/30" aria-label="Parent login">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span className="group-hover:underline underline-offset-4">Login</span>
            </Link>
            <Link href="/auth/register" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group px-2 py-1 rounded-md hover:bg-muted/30" aria-label="Register for KidSafe">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span className="group-hover:underline underline-offset-4">Register</span>
            </Link>
            <Link href="/support" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group px-2 py-1 rounded-md hover:bg-muted/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="group-hover:underline underline-offset-4">Support</span>
            </Link>
            <div className="hidden md:flex h-5 items-center">
              <span className="text-muted-foreground/30 mx-1">|</span>
            </div>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group px-2 py-1 rounded-md hover:bg-muted/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="group-hover:underline underline-offset-4">Privacy</span>
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group px-2 py-1 rounded-md hover:bg-muted/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="group-hover:underline underline-offset-4">Terms</span>
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex flex-col items-center text-center rounded-lg border border-border/60 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/50 hover:bg-gradient-to-b hover:from-background hover:to-primary/5 transform hover:-translate-y-1">
      <div className="mb-4 text-primary/80 group-hover:text-primary transition-all duration-300 transform group-hover:scale-110">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{title}</h3>
      <p className="text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">{description}</p>
    </div>
  );
}
