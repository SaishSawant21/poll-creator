"use client";

import Link from "next/link";
import { BarChart3, Compass, LogIn } from "lucide-react";
import { Button } from "./ui/button";

const PublicHeader = () => {
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

          <Link href="/login">
            <Button variant="default" size="sm" className="gap-2 shadow-sm">
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
export default PublicHeader;
