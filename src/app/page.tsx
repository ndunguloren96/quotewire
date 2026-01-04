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



            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />



            <input 



              type="text" 



              placeholder="Search authors or keywords..." 



              className="w-full pl-9 pr-4 py-3 bg-secondary/50 border border-input text-sm focus:outline-none focus:border-ring transition-all rounded-none placeholder:text-muted-foreground text-foreground"



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



              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Search Results</h2>



              <button 



                onClick={() => {



                  setSearchQuery("");



                  setHasSearched(false);



                }}



                className="text-xs font-medium text-muted-foreground hover:text-foreground"



              >



                Clear Search



              </button>



            </div>



            



            {isSearching ? (



               <div className="flex justify-center py-20">



                 <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />



               </div>



            ) : searchResults.length > 0 ? (



              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">



                {searchResults.map((quote) => (



                  <QuoteCard key={quote.SK} {...quote} />



                ))}



              </div>



            ) : (



              <div className="text-center py-24 border border-border bg-secondary/20">



                <p className="text-muted-foreground italic mb-2">"Not all those who wander are lost, but this search found nothing."</p>



                <p className="text-xs text-muted-foreground/60 uppercase tracking-widest">— J.R.R. Tolkien (Adapted)</p>



              </div>



            )}



          </div>



        ) : (



          /* Standard Grid for Daily & Random */



          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">



            



            {/* Daily Quote */}



            <div className="flex flex-col gap-6">



              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Quote of the Day</h2>



              {loadingDaily ? (



                <div className="h-64 bg-secondary/50 animate-pulse border border-border" />



              ) : dailyQuote ? (



                <QuoteCard {...dailyQuote} />



              ) : (



                <div className="p-8 border border-border text-muted-foreground">Failed to load daily quote.</div>



              )}



            </div>



  



                                {/* Random Quote */}



  



                                <div className="flex flex-col gap-6">



  



                                  <div className="flex items-center justify-between">



  



                                    <div className="flex items-center gap-2">



  



                                      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Random Discovery</h2>



  



                                      <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-none font-mono">



  



                                        {randomQuote?.total ? new Intl.NumberFormat().format(randomQuote.total) : '---'}



  



                                      </span>



  



                                    </div>



  



                                    <button 



  



                                      onClick={fetchNewRandom} 



  



                                      disabled={loadingRandom}



  



                                      className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 hover:text-primary dark:hover:text-primary flex items-center gap-2 disabled:opacity-50 transition-colors"



  



                                    >



  



                                      {loadingRandom ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}



  



                                      Next Quote



  



                                    </button>



  



                                  </div>



  



                                              {randomQuote?.quote ? (



  



                                                <QuoteCard key={randomQuote.quote.SK} {...randomQuote.quote} />



  



                                              ) : (



  



                                  



  



                      



                 <div className="h-64 bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground">



                    Click Next to discover



                 </div>



              )}



            </div>



          </div>



        )}



  



      </div>



    );



  }



  
