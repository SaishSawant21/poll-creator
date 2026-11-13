"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Chart } from "react-google-charts";
import { apiClient } from "../../lib/api-client";
import { toast } from "sonner";

const PollResults = ({ slug, hasVoted }) => {
	const [results, setResults] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchResults = async () => {
			try {
				const response = await apiClient.get(`/polls/${slug}/results`);
				setResults(response.data);
			} catch (err) {
				toast.error("Failed to load results.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchResults();
	}, [slug]);

	if (isLoading) {
		return (
			<div className="flex justify-center p-12">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	if (!results) return null;

	const chartData = [
		["Option", "Votes", { role: "style" }],
		...results.options.map((opt) => [opt.text, opt.votes, "#4f46e5"]),
	];

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="flex items-center justify-center gap-2 text-green-600 font-medium">
				<CheckCircle2 className="w-5 h-5" />
				{hasVoted ? "Thank you for voting!" : "This poll is closed"}
			</div>

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
	);
}
export default PollResults;
