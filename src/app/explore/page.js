"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, BarChart3, ArrowRight, Compass } from "lucide-react";
import { apiClient } from "../../lib/api-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import PublicHeader from "../../components/public-header";

const ExplorePage = () => {
  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await apiClient.get("/polls");
        setPolls(response.data);
      } catch (err) {
        setError("Failed to load public polls.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolls();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <PublicHeader />

      <div className="absolute top-0 left-[-10%] w-[30%] h-[30%] bg-primary/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-[-10%] w-[30%] h-[30%] bg-blue-500/20 blur-[120px] rounded-full" />

      <div className="max-w-6xl mx-auto p-6 md:p-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-primary font-semibold mb-2">
              <Compass className="w-5 h-5" />
              <span>Discover</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Explore Public Polls</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Vote on polls created by the community, or sign in to create your own.
            </p>
          </div>
          {/* The hardcoded Sign In button is removed here */}
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Empty State */}
        {polls.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl border-border/50 bg-card/50">
            <BarChart3 className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No public polls yet</h3>
            <p className="text-muted-foreground max-w-sm">
              Nobody has published a public poll yet. Log in and be the first!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {polls.map((poll) => (
              <Link href={`/p/${poll.slug}`} key={poll.id} className="group">
                <Card className="h-full flex flex-col hover:border-primary/50 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg bg-background/60 backdrop-blur-sm">
                  <CardHeader className="flex-1">
                    <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {poll.question}
                    </CardTitle>
                    {poll.description && (
                      <CardDescription className="line-clamp-2 mt-1">
                        {poll.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between border-t border-border/50 pt-4">
                      <span className="text-xs text-muted-foreground">
                        {new Date(poll.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-1 text-primary text-sm font-medium group-hover:underline">
                        Vote now
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
