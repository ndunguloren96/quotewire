"use client";

import { useState, useEffect } from "react";
import { QuoteCard } from "@/components/QuoteCard";
import { QuoteListItem } from "@/components/QuoteListItem";
import { Search, RefreshCw, Loader2 } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

export default function Home() {
  const [dailyQuote, setDailyQuote] = useState<any>(null);
  const [randomQuote, setRandomQuote] = useState<any>(null);
  const [archiveQuotes, setArchiveQuotes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingDaily, setLoadingDaily] = useState(true);
  const [loadingRandom, setLoadingRandom] = useState(false);
  
  // Fetch Daily Quote on Mount
  useEffect(() => {
    const fetchDaily = async () => {
      try {
        const res = await fetch("/api/quotes/daily");
        const data = await res.json();
        setDailyQuote(data);
      } catch (err) { console.error(err); } 
      finally { setLoadingDaily(false); }
    };
    fetchDaily();
    fetchNewRandom();
    
    // Initial "Archive" fetch - just getting a category for now as a "latest" proxy
    fetchCategoryQuotes("Life"); 
  }, []);

  const fetchNewRandom = async () => {
    setLoadingRandom(true);
    try {
      const res = await fetch("/api/quotes/random");
      const data = await res.json();
      setRandomQuote(data);
    } catch (err) { console.error(err); }
    finally { setLoadingRandom(false); }
  };

  const fetchCategoryQuotes = async (cat: string) => {
    try {
      const res = await fetch(`/api/quotes/category/${cat}`);
      const data = await res.json();
      setArchiveQuotes(data.slice(0, 20)); // Limit for now
    } catch (err) { console.error(err); }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    // For now, search usually means author lookup in our API, or just filter the list
    // We'll implement a basic author search if available, otherwise just warn
    alert("Full text search coming soon. Try searching for an author via URL /api/quotes/author/[name] for now.");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      
      {/* Search Bar */}
      <div className="flex justify-end mb-12">
        <form onSubmit={handleSearch} className="relative w-full max-w-xs group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-800" />
          <input 
            type="text" 
            placeholder="Search authors..." 
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 text-sm focus:outline-none focus:border-zinc-400 focus:bg-white transition-all rounded-none placeholder:text-zinc-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Top Section: Grid for Daily & Random */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        
        {/* Daily Quote */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Quote of the Day</h2>
          {loadingDaily ? (
            <div className="h-64 bg-zinc-50 animate-pulse border border-zinc-100" />
          ) : dailyQuote ? (
            <QuoteCard {...dailyQuote} />
          ) : (
            <div className="p-8 border border-zinc-100 text-zinc-400">Failed to load daily quote.</div>
          )}
        </div>

        {/* Random Quote */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Random Discovery</h2>
            <button 
              onClick={fetchNewRandom} 
              disabled={loadingRandom}
              className="text-xs font-bold uppercase tracking-wider text-zinc-800 hover:text-[#6c47ff] flex items-center gap-2 disabled:opacity-50"
            >
              {loadingRandom ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              Next Quote
            </button>
          </div>
          {randomQuote ? (
            <QuoteCard {...randomQuote} />
          ) : (
             <div className="h-64 bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-300">
                Click Next to discover
             </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-100 w-full mb-12" />

      {/* Archive / Collection List */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Collection</h3>
          <div className="flex gap-2">
             {/* Quick category filter chips */}
             {["Life", "Wisdom", "Technology", "Art"].map(cat => (
               <button 
                 key={cat}
                 onClick={() => fetchCategoryQuotes(cat)}
                 className="text-xs font-semibold px-3 py-1 border border-zinc-200 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-colors"
               >
                 {cat}
               </button>
             ))}
          </div>
        </div>

        <div className="flex flex-col">
          {archiveQuotes.length > 0 ? (
            archiveQuotes.map((q, i) => (
              <QuoteListItem key={i} {...q} />
            ))
          ) : (
            <div className="py-12 text-center text-zinc-400 text-sm">
              Select a category to view the collection.
            </div>
          )}
        </div>
        
        <div className="mt-8 flex justify-center">
             <button className="text-sm font-semibold text-zinc-400 hover:text-zinc-800 transition-colors">
               Load More
             </button>
        </div>
      </div>

    </div>
  );
}
