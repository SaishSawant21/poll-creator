"use client";
import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { Loader2, Lock, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "../../../lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import PollVote from "../../../components/polls/PollVote";
import PollResults from "../../../components/polls/PollResults";

const PublicPollContent = () => {
	const params = useParams();
	const slug = params.slug;

	const [poll, setPoll] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [isVoting, setIsVoting] = useState(false);
	const [hasVoted, setHasVoted] = useState(false);

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

	const handleVote = async (optionId) => {
		if (!optionId) {
			toast.error("Please select an option first.");
			return;
		}

		setIsVoting(true);
		try {
			await apiClient.post(`/polls/${slug}/vote`, { optionId });
			toast.success("Vote cast successfully!");
			setHasVoted(true);
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
					{poll.description && (
						<CardDescription className="text-base mt-2">{poll.description}</CardDescription>
					)}
				</CardHeader>

				<CardContent>
					{/* Clean logic: If voted or closed, show results. Otherwise, show voting UI */}
					{hasVoted || poll.status === 'closed' ? (
						<PollResults slug={slug} hasVoted={hasVoted} />
					) : (
						<PollVote options={poll.options} isVoting={isVoting} onVote={handleVote} />
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