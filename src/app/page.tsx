"use client";

import { useState, useEffect } from "react";
import { QuoteCard } from "@/components/QuoteCard";
import { Search, RefreshCw, Loader2 } from "lucide-react";

export default function Home() {

  const [dailyQuote, setDailyQuote] = useState<any>(null);

  const [randomQuote, setRandomQuote] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [isSearching, setIsSearching] = useState(false);

  const [hasSearched, setHasSearched] = useState(false);

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



  const handleSearch = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!searchQuery.trim()) {

      setIsSearching(false);

      setHasSearched(false);

      return;

    }



    setIsSearching(true);

    setHasSearched(true);

    

    try {

      const res = await fetch(`/api/quotes/search?q=${encodeURIComponent(searchQuery)}`);

      const data = await res.json();

      setSearchResults(data);

    } catch (err) {

      console.error(err);

      setSearchResults([]);

    } finally {

      setIsSearching(false);

    }

  };



  return (

    <div className="max-w-6xl mx-auto px-6 py-12">

      

      {/* Search Bar */}

      <div className="flex justify-end mb-16">

        <form onSubmit={handleSearch} className="relative w-full max-w-sm group">

          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />

          <input 

            type="text" 

            placeholder="Search authors or keywords..." 

            className="w-full pl-9 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all rounded-none placeholder:text-zinc-400 text-black dark:text-white"

            value={searchQuery}

            onChange={(e) => {

              setSearchQuery(e.target.value);

              if (e.target.value === "") setHasSearched(false);

            }}

          />

        </form>

      </div>



      {/* Conditional Rendering: Search Results vs Standard Grid */}

      {hasSearched ? (

        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

          <div className="flex items-center justify-between">

            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Search Results</h2>

            <button 

              onClick={() => {

                setSearchQuery("");

                setHasSearched(false);

              }}

              className="text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"

            >

              Clear Search

            </button>

          </div>

          

          {isSearching ? (

             <div className="flex justify-center py-20">

               <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />

             </div>

          ) : searchResults.length > 0 ? (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {searchResults.map((quote) => (

                <QuoteCard key={quote.SK} {...quote} />

              ))}

            </div>

          ) : (

            <div className="text-center py-24 border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">

              <p className="text-zinc-400 italic mb-2">"Not all those who wander are lost, but this search found nothing."</p>

              <p className="text-xs text-zinc-300 uppercase tracking-widest">— J.R.R. Tolkien (Adapted)</p>

            </div>

          )}

        </div>

      ) : (

        /* Standard Grid for Daily & Random */

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          

          {/* Daily Quote */}

          <div className="flex flex-col gap-6">

            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Quote of the Day</h2>

            {loadingDaily ? (

              <div className="h-64 bg-zinc-50 dark:bg-zinc-900 animate-pulse border border-zinc-100 dark:border-zinc-800" />

            ) : dailyQuote ? (

              <QuoteCard {...dailyQuote} />

            ) : (

              <div className="p-8 border border-zinc-100 dark:border-zinc-800 text-zinc-400">Failed to load daily quote.</div>

            )}

          </div>



          {/* Random Quote */}

          <div className="flex flex-col gap-6">

            <div className="flex items-center justify-between">

              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Random Discovery</h2>

              <button 

                onClick={fetchNewRandom} 

                disabled={loadingRandom}

                className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 hover:text-[#6c47ff] dark:hover:text-[#8a6eff] flex items-center gap-2 disabled:opacity-50 transition-colors"

              >

                {loadingRandom ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}

                Next Quote

              </button>

            </div>

            {randomQuote ? (

              <QuoteCard key={randomQuote.SK} {...randomQuote} />

            ) : (

               <div className="h-64 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-300 dark:text-zinc-600">

                  Click Next to discover

               </div>

            )}

          </div>

        </div>

      )}



    </div>

  );

}
