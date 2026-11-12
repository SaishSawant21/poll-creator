"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, CheckCircle2, Lock, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "../../../lib/api-client";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Chart } from "react-google-charts";
import { Suspense } from "react";

const PublicPollContent = () => {
  const params = useParams();
  const slug = params.slug;

  const [poll, setPoll] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await apiClient.get(`/polls/${slug}`);
        setPoll(response.data);

        if (response.data.status === 'closed') {
          fetchResults();
        }
      } catch (err) {
        setError("Poll not found or failed to load.");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchPoll();
  }, [slug]);

  const fetchResults = async () => {
    try {
      const response = await apiClient.get(`/polls/${slug}/results`);
      setResults(response.data);
    } catch (err) {
      toast.error("Failed to load results.");
    }
  };

  const handleVote = async () => {
    if (!selectedOption) {
      toast.error("Please select an option first.");
      return;
    }

    setIsVoting(true);
    try {
      await apiClient.post(`/polls/${slug}/vote`, { optionId: selectedOption });
      toast.success("Vote cast successfully!");
      setHasVoted(true);
      fetchResults(); 
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to cast vote";
      toast.error(msg);
    } finally {
      setIsVoting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
        <Lock className="w-12 h-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Poll Unavailable</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  const chartData = results ? [
    ["Option", "Votes", { role: "style" }],
    ...results.options.map((opt) => [opt.text, opt.votes, "#4f46e5"]) // Indigo color
  ] : null;

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-background overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full" />

      <Card className="relative z-10 w-full max-w-2xl border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold leading-tight">{poll.question}</CardTitle>
          {poll?.description && (
            <CardDescription className="text-base mt-2">{poll.description}</CardDescription>
          )}
        </CardHeader>

        <CardContent>
          {hasVoted || poll.status === 'closed' ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                <CheckCircle2 className="w-5 h-5" />
                {hasVoted ? "Thank you for voting!" : "This poll is closed"}
              </div>

              {results ? (
                <div className="space-y-6">
                  <Chart
                    chartType="BarChart"
                    width="100%"
                    height="400px"
                    data={chartData}
                    options={{
                      title: "",
                      chartArea: { width: "80%", height: "70%" },
                      hAxis: { title: "Total Votes", minValue: 0 },
                      vAxis: { title: "Options" },
                      legend: { position: "none" },
                      backgroundColor: "transparent",
                    }}
                  />
                  <div className="text-center text-sm text-muted-foreground">
                    Total Votes: <span className="font-bold text-foreground">{results.totalVotes}</span>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid gap-3">
                {poll.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${selectedOption === option.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border/50 hover:border-primary/50 bg-background/50"
                      }`}
                  >
                    <span className="font-medium text-lg">{option.text}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedOption === option.id ? "border-primary" : "border-muted-foreground/30"
                      }`}>
                      {selectedOption === option.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <Button
                onClick={handleVote}
                disabled={isVoting || !selectedOption}
                className="w-full h-12 text-lg font-medium shadow-lg shadow-primary/20"
              >
                {isVoting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Casting Vote...
                  </>
                ) : (
                  "Submit Vote"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const PublicPollPage = () => {
	return (
		<Suspense fallback={
			<div className="flex min-h-screen items-center justify-center bg-background">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		}>
			<PublicPollContent />
		</Suspense>
	);
}

export default PublicPollPage;