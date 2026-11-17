"use client";

import { Suspense } from "react";
import Link from "next/link";
import { BarChart3, Compass, LogIn, LayoutDashboard, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../hooks/use-auth";

const HeaderContent = () => {
  // Check if user is logged in. We don't redirect here, just check status.
  const { user, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <BarChart3 className="w-6 h-6" />
          <span>Pollify</span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Link href="/explore" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            <Compass className="w-4 h-4" />
            <span className="hidden sm:inline">Explore</span>
          </Link>

          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          ) : user ? (
            <Link href="/dashboard">
              <Button variant="default" size="sm" className="gap-2 shadow-sm">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm" className="gap-2 shadow-sm">
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

const PublicHeader = () => {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md h-16" />
    }>
      <HeaderContent />
    </Suspense>
  );
};

export default PublicHeader;