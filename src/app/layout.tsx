"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ThemeToggle";
import { Search, RefreshCw, Loader2, Calendar, Heart, Compass, ChevronRight, Copy, Share2, Check } from "lucide-react"; // Added icons

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuoteWire | Premium Daily Inspiration",
  description: "Discover profound, strategic, and user-centric quotes. Your daily source for wisdom, motivation, and creative thought.",
  keywords: ["quotes", "inspiration", "wisdom", "daily quote", "motivation", "philosophy", "quotewire"],
  openGraph: {
    title: "QuoteWire | Premium Daily Inspiration",
    description: "Discover profound, strategic, and user-centric quotes.",
    type: "website",
    locale: "en_US",
    siteName: "QuoteWire",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuoteWire",
    description: "Your daily source for wisdom and motivation.",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

// Header Client Component
function Header() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Adjust threshold as needed
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
      <Link href="/" className="font-serif font-bold text-2xl tracking-tighter hover:text-primary">
        QuoteWire
      </Link>
      <div className="flex items-center gap-4">
        <ModeToggle />
        
        {/* Auth hidden for now */}
        <SignedOut>
           {/* <SignInButton />
           <SignUpButton>
             <button className="bg-primary text-white font-medium text-sm sm:text-base h-10 px-4 cursor-pointer rounded-none">
               Sign Up
             </button>
           </SignUpButton> */}
        </SignedOut>
        
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground transition-colors duration-300`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  if ('serviceWorker' in navigator) {
                    window.addEventListener('load', function() {
                      navigator.serviceWorker.register('/sw.js').then(function(registration) {
                        console.log('ServiceWorker registration successful');
                      }, function(err) {
                        console.log('ServiceWorker registration failed: ', err);
                      });
                    });
                  }
                `,
              }}
            />
            <Header />
            <main className="min-h-screen pt-4"> {/* Add pt-4 to account for sticky header */}
              {children}
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}