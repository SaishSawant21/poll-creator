"use client";

import Link from "next/link";
import { BarChart3, ArrowRight, ShieldCheck, Zap, BarChart2 } from "lucide-react";
import { Button } from "../components/ui/button";
import PublicHeader from "../components/public-header";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />

      <PublicHeader />

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 pt-24 pb-16 text-center">

        {/* Hero Section */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Zap className="w-4 h-4" />
          <span>Fast, secure, and free to use</span>
        </div>

        <h1 className="max-w-4xl text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          Create polls that <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
            actually get answers.
          </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          Pollify is the easiest way to ask questions, gather opinions, and visualize results in real-time with beautiful charts.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <Link href="/register">
            <Button size="lg" className="h-12 px-8 text-lg font-medium shadow-lg shadow-primary/25 gap-2">
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/explore">
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg font-medium">
              Explore Public Polls
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="max-w-5xl w-full grid md:grid-cols-3 gap-6 mt-24 animate-in fade-in slide-in-from-bottom-12 duration-1000">

          <div className="p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 shadow-sm text-left">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <BarChart2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Live Results</h3>
            <p className="text-muted-foreground">Watch votes come in and update instantly with our interactive charts.</p>
          </div>

          <div className="p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 shadow-sm text-left">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Secure Voting</h3>
            <p className="text-muted-foreground">Prevent duplicate votes and protect polls with login-required modes.</p>
          </div>

          <div className="p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 shadow-sm text-left">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Privacy First</h3>
            <p className="text-muted-foreground">Keep polls unlisted or private. Share links only with who you choose.</p>
          </div>

        </div>
      </main>
    </div>
  );
};
export default LandingPage;
