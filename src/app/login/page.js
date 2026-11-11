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
	// If the user is logged in, redirect them to the dashboard
	
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm();

	const onSubmit = async (data) => {
		setServerError("");

		try {
			await apiClient.post("/auth/login", data);
			router.push("/dashboard");
			toast.success("Login successful!");
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
	const { isLoading: isAuthLoading } = useAuth({
		redirectTo: "/dashboard",
		redirectIfFound: true
	});

	if (isAuthLoading) return null; 

	return (
		<div className="relative flex min-h-screen items-center justify-center p-4 bg-background overflow-hidden">

			<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
			<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full" />

			<Card className="relative z-10 w-full max-w-md border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl">
				<CardHeader className="space-y-2 pb-6 text-center">
					<div className="flex justify-center mb-2">
						<div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 shadow-inner">
							<BarChart3 className="w-7 h-7 text-primary" />
						</div>
					</div>
					<CardTitle className="text-3xl font-bold tracking-tight">
						Welcome to Pollify
					</CardTitle>
					<CardDescription className="text-base text-muted-foreground">
						Enter your details to access your account
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

						<div className="space-y-2">
							<Label htmlFor="email" className="text-sm font-medium">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="name@example.com"
								className="h-11 bg-background/50 focus-visible:ring-primary focus-visible:ring-2 transition-all"
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
								className="h-11 bg-background/50 focus-visible:ring-primary focus-visible:ring-2 transition-all"
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

				<CardFooter className="flex justify-center border-t border-border/50 pt-6">
					<p className="text-sm text-muted-foreground">
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
