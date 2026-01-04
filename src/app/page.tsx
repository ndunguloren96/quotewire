"use client";

import { useState, useEffect } from "react";
import { QuoteCard } from "@/components/QuoteCard";
import { CategorySidebar } from "@/components/CategorySidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Heart, Compass, Search as SearchIcon, Loader2 } from "lucide-react";

type Tab = "daily" | "foryou" | "discover" | "search";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("daily");
  const [dailyQuote, setDailyQuote] = useState<any>(null);
  const [randomQuotes, setRandomQuotes] = useState<any[]>([]);
  const [suggestedQuotes, setSuggestedQuotes] = useState<any[]>([]);
  const [categoryQuotes, setCategoryQuotes] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDaily();
  }, []);

  const fetchDaily = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/quotes/daily");
      const data = await res.json();
      setDailyQuote(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRandom = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/quotes/random");
      const data = await res.json();
      setRandomQuotes([data]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const likedQuotes = JSON.parse(localStorage.getItem("liked_quotes") || "[]");
      const userInterests = JSON.parse(localStorage.getItem("user_interests") || "[]");
      
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        body: JSON.stringify({ liked_quotes: likedQuotes, preferred_categories: userInterests }),
      });
      const data = await res.json();
      setSuggestedQuotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryQuotes = async (cat: string) => {
    setLoading(true);
    setSelectedCategory(cat);
    try {
      const res = await fetch(`/api/quotes/category/${cat}`);
      const data = await res.json();
      setCategoryQuotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "daily" && !dailyQuote) fetchDaily();
    if (tab === "discover" && randomQuotes.length === 0) fetchRandom();
    if (tab === "foryou") fetchSuggestions();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="flex items-center justify-center mb-12">
        <div className="inline-flex p-1 bg-zinc-100 rounded-2xl">
          {[
            { id: "daily", label: "Daily", icon: Calendar },
            { id: "foryou", label: "For You", icon: Heart },
            { id: "discover", label: "Discover", icon: Compass },
            { id: "search", label: "Search", icon: SearchIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as Tab)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id 
                  ? "bg-white text-[#6c47ff] shadow-sm" 
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subscription Banner */}
      <div className="mb-12 p-6 bg-gradient-to-r from-[#6c47ff] to-[#8a6eff] rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-[#6c47ff20]">
        <div>
          <h3 className="text-xl font-bold mb-1">Never miss a profound thought.</h3>
          <p className="text-[#ffffff90]">Subscribe for daily inspiration delivered directly to your device.</p>
        </div>
        <button 
          onClick={() => {
            if ("Notification" in window) {
              Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                  alert("Awesome! You'll receive daily inspiration.");
                }
              });
            }
          }}
          className="bg-white text-[#6c47ff] px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-transform active:scale-95"
        >
          Subscribe Now
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#6c47ff] animate-spin" />
          </div>
        )}

        <AnimatePresence mode="wait">
          {!loading && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "daily" && dailyQuote && (
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-zinc-400 text-sm font-bold uppercase tracking-[0.2em] mb-6 text-center">Quote of the Day</h2>
                  <QuoteCard 
                    pk={dailyQuote.PK} 
                    sk={dailyQuote.SK} 
                    text={dailyQuote.text} 
                    author={dailyQuote.author} 
                    tags={dailyQuote.tags}
                    initialLikes={dailyQuote.likes}
                  />
                </div>
              )}

              {activeTab === "foryou" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {suggestedQuotes.map((q, i) => (
                    <QuoteCard 
                      key={i}
                      pk={q.PK || "AI#SUGGEST"} 
                      sk={q.SK || `QUOTE#${i}`} 
                      text={q.text} 
                      author={q.author} 
                      tags={q.tags}
                    />
                  ))}
                  {suggestedQuotes.length === 0 && (
                    <div className="col-span-full text-center py-20 text-zinc-400">
                      Like some quotes to get personalized suggestions!
                    </div>
                  )}
                </div>
              )}

              {activeTab === "discover" && (
                <div className="flex flex-col md:flex-row gap-8">
                  <CategorySidebar 
                    onSelectCategory={fetchCategoryQuotes} 
                    selectedCategory={selectedCategory || undefined} 
                  />
                  <div className="flex-1 flex flex-col gap-6">
                    {selectedCategory ? (
                      <>
                        <h2 className="text-xl font-bold text-zinc-800 mb-2">{selectedCategory} Quotes</h2>
                        {categoryQuotes.map((q, i) => (
                          <QuoteCard key={i} {...q} />
                        ))}
                        {categoryQuotes.length === 0 && (
                          <div className="text-center py-20 text-zinc-400">No quotes found for this category.</div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-20 text-zinc-400">Select a category to discover profound quotes.</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "search" && (
                <div className="max-w-2xl mx-auto">
                  <div className="relative mb-8">
                    <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input 
                      type="text" 
                      placeholder="Search by author or keywords..." 
                      className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-lg focus:ring-2 focus:ring-[#6c47ff] outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="text-center py-10 text-zinc-400">
                    Search functionality coming soon!
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}