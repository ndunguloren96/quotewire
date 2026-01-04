"use client";

import * as React from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/ThemeToggle";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClasses = `flex justify-between items-center p-6 gap-4 h-16 border-b backdrop-blur-sm sticky top-0 z-50 transition-all duration-300 ${
    isScrolled 
      ? "border-zinc-100/50 dark:border-zinc-800/50 bg-background/80 dark:bg-zinc-950/80" 
      : "border-transparent bg-transparent"
  }`;

  return (
    <header className={headerClasses}>
      <Link href="/" className="font-serif font-bold text-2xl tracking-tighter hover:text-primary transition-colors cursor-pointer">
        QuoteWire
      </Link>
      <div className="flex items-center gap-4">
        <ModeToggle />
        
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
