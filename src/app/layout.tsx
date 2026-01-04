import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/Header";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground transition-colors duration-300 min-h-screen flex flex-col`}
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
          <main className="flex-grow pt-4">
            {children}
          </main>
          
          <footer className="border-t border-zinc-100 dark:border-zinc-800 py-8 mt-12">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-medium">
              <p>QuoteWire | © {new Date().getFullYear()} | All rights reserved.</p>
              <p>
                Built by{" "}
                <a 
                  href="https://x.com/loren_kamau" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-foreground hover:text-primary transition-colors underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-2"
                >
                  @loren_kamau
                </a>
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}