"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Play, Square, Copy, Check, Link as LinkIcon } from "lucide-react"; // <-- Added Copy, Check, LinkIcon
import { toast } from "sonner";
import { apiClient } from "../../../../lib/api-client";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import PollResults from "../../../../components/polls/PollResults";

const PollDetailsContent = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [poll, setPoll] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [copied, setCopied] = useState(false); // <-- New state for copy feedback

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await apiClient.get(`/polls/${slug}`);
        setPoll(response.data);
      } catch (err) {
        setError("Poll not found or failed to load.");
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchPoll();
  }, [slug]);

  const updateStatus = async (newStatus) => {
    setIsUpdating(true);
    try {
      await apiClient.patch(`/polls/${slug}/status`, { status: newStatus });
      setPoll((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Poll ${newStatus === 'open' ? 'published' : 'closed'} successfully!`);
      router.push(`/dashboard`);
    } catch (err) {
      toast.error("Failed to update status.");
    } finally {
      setIsUpdating(false);
    }
  };

  // <-- New function to handle copying the link
  const handleCopyLink = () => {
    const publicUrl = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");

    // Reset the checkmark icon after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/dashboard">
          <Button variant="outline">Back</Button>
        </Link>
      </div>
    );
  }

  // <-- Construct the public URL for display
  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/p/${slug}` : "";

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Link>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">{poll.question}</CardTitle>
              {poll.description && <CardDescription className="text-base mt-2">{poll.description}</CardDescription>}
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${poll.status === 'open' ? 'bg-green-500/10 text-green-600' :
              poll.status === 'draft' ? 'bg-zinc-500/10 text-zinc-600' :
                'bg-red-500/10 text-red-600'
              }`}>
              {poll.status.toUpperCase()}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="flex gap-3">
            {poll.status === 'draft' && (
              <Button onClick={() => updateStatus('OPEN')} disabled={isUpdating} className="gap-2">
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} Publish Poll
              </Button>
            )}
            {poll.status === 'open' && (
              <Button onClick={() => updateStatus('CLOSED')} disabled={isUpdating} variant="destructive" className="gap-2">
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />} Close Poll
              </Button>
            )}
          </div>

          {/* <-- New Share Link Section --> */}
          <div className="bg-muted/30 border border-border/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <LinkIcon className="w-4 h-4" />
              Share this poll
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-mono text-muted-foreground truncate">
                {publicUrl}
              </div>
              <Button
                onClick={handleCopyLink}
                variant={copied ? "default" : "secondary"}
                className="gap-2 shrink-0 min-w-[120px]"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Link
                  </>
                )}
              </Button>
            </div>
          </div>

          {poll.status === 'draft' && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Options</h3>
              <div className="grid gap-2">
                {poll.options?.map((option) => (
                  <div key={option.id} className="p-4 rounded-lg border border-border/50 bg-muted/30">
                    <span className="font-medium text-foreground">{option.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(poll.status === 'open' || poll.status === 'closed') && (
            <div className="border-t border-border/50 pt-8">
              <h3 className="font-semibold text-lg mb-6">Live Results</h3>
              <PollResults slug={slug} hasVoted={false} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const PollDetailsPage = () => {
  return (
    <Suspense fallback={
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <PollDetailsContent />
    </Suspense>
  );
};

export default PollDetailsPage;