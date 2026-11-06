"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Loader2, FileQuestion } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { apiClient } from "../../lib/api-client";

const DashboardPage = () => {
  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await apiClient.get("/polls/me");
        setPolls(response.data);
      } catch (err) {
        setError("Failed to load polls. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolls();
  }, []);

  // Loading State
  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Polls</h2>
          <p className="text-muted-foreground mt-1">Manage your polls and track live results.</p>
        </div>
        <Link href="/dashboard/polls/new">
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <PlusCircle className="w-4 h-4" />
            Create Poll
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">
          {error}
        </div>
      )}

      {/* Empty State */}
      {polls.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl border-border/50 bg-card/50">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <FileQuestion className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No polls yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            You haven't created any polls. Create your first poll to start gathering opinions!
          </p>
          <Link href="/dashboard/polls/new">
            <Button>Create your first poll</Button>
          </Link>
        </div>
      ) : (
        /* Polls Grid */
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <Card key={poll.id} className="hover:border-primary/50 transition-colors cursor-pointer group shadow-sm hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                    {poll.question}
                  </CardTitle>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    poll.status === 'open' ? 'bg-green-500/10 text-green-600' : 
                    poll.status === 'draft' ? 'bg-zinc-500/10 text-zinc-600' : 
                    'bg-red-500/10 text-red-600'
                  }`}>
                    {poll.status.toUpperCase()}
                  </span>
                </div>
                <CardDescription>Created {new Date(poll.createdAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Slug</span>
                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{poll.slug}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
export default DashboardPage; 