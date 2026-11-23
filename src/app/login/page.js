"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { BarChart3, Loader2 } from "lucide-react";

// Relative imports
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { apiClient } from "./../../lib/api-client";
import { useAuth } from "../../hooks/use-auth";
import { toast } from "sonner";

const LoginPage = () => {
	const router = useRouter();
	const [serverError, setServerError] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm();

	const onSubmit = async (data) => {
		setServerError("");

		try {
			await apiClient.post("/auth/login", data);
			toast.success("Login successful!");
			router.push("/dashboard");
		} catch (error) {
			let msg;
			if (error.response && error.response.data && error.response.data.message) {
				msg = error.response.data.message;
				setServerError(error.response.data.message);
			} else {
				msg = "An unexpected error occurred.";
				setServerError("An unexpected error occurred.");
			}
			toast.error("Login failed", { description: msg });
		}
	};

	// Moved to the top to comply with Rules of Hooks
	const { isLoading: isAuthLoading } = useAuth({
		redirectTo: "/dashboard",
		redirectIfFound: true
	});

	if (isAuthLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}
	
	return (
		// Changed p-4 to p-3 on mobile for more screen real estate
		<div className="relative flex min-h-[100dvh] items-center justify-center p-3 sm:p-4 bg-background overflow-hidden">

			{/* Adjusted blob sizes so they don't cause horizontal scroll on mobile */}
			<div className="absolute top-[-10%] left-[-20%] w-[60%] sm:w-[40%] h-[40%] bg-primary/20 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none" />
			<div className="absolute bottom-[-10%] right-[-20%] w-[60%] sm:w-[40%] h-[40%] bg-blue-500/20 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none" />

			<Card className="relative z-10 w-full max-w-md border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl">
				{/* Reduced horizontal padding on mobile (px-4 vs px-6) */}
				<CardHeader className="space-y-2 pb-6 pt-8 px-4 sm:px-6 text-center">
					<div className="flex justify-center mb-2">
						<div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 shadow-inner">
							<BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
						</div>
					</div>
					{/* Scaled down text on mobile */}
					<CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
						Welcome to Pollify
					</CardTitle>
					<CardDescription className="text-sm sm:text-base text-muted-foreground px-2">
						Enter your details to access your account
					</CardDescription>
				</CardHeader>

				<CardContent className="px-4 sm:px-6">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
						<div className="space-y-2">
							<Label htmlFor="email" className="text-sm font-medium">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="name@example.com"
								className="h-11 bg-background/50 focus-visible:ring-primary focus-visible:ring-2 transition-all text-base"
								{...register("email", {
									required: "Email is required",
									pattern: {
										value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
										message: "Invalid email address",
									},
								})}
							/>
							{errors.email && (
								<p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">
									{errors.email.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="password" className="text-sm font-medium">Password</Label>
								<Link href="#" className="text-xs text-primary font-medium hover:underline">
									Forgot password?
								</Link>
							</div>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								className="h-11 bg-background/50 focus-visible:ring-primary focus-visible:ring-2 transition-all text-base"
								{...register("password", {
									required: "Password is required",
									minLength: {
										value: 8,
										message: "Password must be at least 8 characters",
									},
								})}
							/>
							{errors.password && (
								<p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">
									{errors.password.message}
								</p>
							)}
						</div>

						{serverError && (
							<div className="text-sm font-medium text-red-500 p-3 bg-red-500/10 rounded-md border border-red-500/20 text-center">
								{serverError}
							</div>
						)}

						<Button
							type="submit"
							className="w-full h-11 text-base font-medium shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40"
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Signing in...
								</>
							) : (
								"Sign In"
							)}
						</Button>
					</form>
				</CardContent>

				<CardFooter className="flex justify-center border-t border-border/50 pt-6 pb-6 px-4 sm:px-6">
					<p className="text-sm text-muted-foreground text-center">
						Don&apos;t have an account?{" "}
						<Link href="/register" className="text-primary font-semibold hover:underline">
							Sign up
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
};
export default LoginPage;
