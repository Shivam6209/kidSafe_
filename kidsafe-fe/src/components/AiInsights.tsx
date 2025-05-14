"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { dashboardService, AiInsights } from '@/services/dashboardService';
import { AlertCircle, Check, Lightbulb, BarChart, Brain, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface AiInsightsComponentProps {
  childId: number;
  childName: string;
}

export function AiInsightsComponent({ childId, childName }: AiInsightsComponentProps) {
  const [insights, setInsights] = useState<AiInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await dashboardService.getAiInsights(childId);
      setInsights(data);
    } catch (err) {
      console.error('Failed to fetch AI insights:', err);
      setError('Failed to fetch AI insights');
      toast.error('Could not load AI insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [childId]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            <Skeleton className="h-7 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-full" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error || !insights) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Insights Unavailable
          </CardTitle>
          <CardDescription>
            We couldn't generate insights for {childName} at this time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center py-6 space-y-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              {error || "There was a problem generating insights. This could be due to insufficient activity data."}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={fetchInsights} variant="outline" className="w-full">
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Insights for {childName}
        </CardTitle>
        <CardDescription>
          Personalized analysis based on {childName}'s digital activity patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm leading-relaxed">{insights.summary}</p>
              
              <div>
                <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                  <BarChart className="h-4 w-4 text-primary" />
                  Screen Time Analysis
                </h4>
                <p className="text-sm text-muted-foreground">{insights.screenTimeAnalysis}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Content Categories Analysis
                </h4>
                <p className="text-sm text-muted-foreground">{insights.contentCategoriesAnalysis}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="patterns" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Key Patterns
                </h4>
                <ul className="space-y-2">
                  {insights.patterns.map((pattern, i) => (
                    <li key={i} className="text-sm flex gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>{pattern}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  Areas to Monitor
                </h4>
                <ul className="space-y-2">
                  {insights.concerns.map((concern, i) => (
                    <li key={i} className="text-sm flex gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>{concern}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Positive Behaviors
                </h4>
                <ul className="space-y-2">
                  {insights.positives.map((positive, i) => (
                    <li key={i} className="text-sm flex gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>{positive}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations">
            <div>
              <h4 className="text-sm font-medium mb-3">Recommended Actions</h4>
              <div className="space-y-2">
                {insights.recommendations.map((recommendation, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="mt-0.5 bg-primary/10 p-1.5 rounded-full">
                      <Lightbulb className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-muted-foreground">
          <Badge variant="outline" className="mr-1">AI</Badge>
          Insights generated based on recent activity data
        </p>
        <Button onClick={fetchInsights} size="sm" variant="ghost">
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
} 