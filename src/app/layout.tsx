import type { Metadata } from "next";
import {
  ClerkProvider,
  // SignInButton,
  // SignUpButton,
  SignedIn,
  // SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ThemeToggle";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300`}
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
            <header className="flex justify-between items-center p-6 gap-4 border-b border-zinc-100/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
              <div className="font-serif font-bold text-2xl tracking-tighter">QuoteWire</div>
              <div className="flex items-center gap-4">
                <ModeToggle />
                
                {/* Auth hidden for now */}
                {/* <SignedOut>
                  <SignInButton />
                  <SignUpButton>
                    <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 px-4 cursor-pointer">
                      Sign Up
                    </button>
                  </SignUpButton>
                </SignedOut> */}
                
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </header>
            <main className="min-h-screen">
              {children}
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}