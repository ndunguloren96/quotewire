"use client";

import { useState } from "react";
import { Heart, Copy, Share2, Check } from "lucide-react";
import { motion } from "framer-motion";

interface QuoteCardProps {
  pk: string;
  sk: string;
  text: string;
  author: string;
  tags: string[];
  initialLikes?: number;
}

export function QuoteCard({ pk, sk, text, author, tags, initialLikes = 0 }: QuoteCardProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    setLikes(prev => prev + 1);
    
    try {
      await fetch("/api/quotes/like", {
        method: "POST",
        body: JSON.stringify({ pk, sk }),
      });
      
      // Store in local storage for personalization
      const storedLikes = JSON.parse(localStorage.getItem("liked_quotes") || "[]");
      if (!storedLikes.find((q: any) => q.sk === sk)) {
        storedLikes.push({ pk, sk, text, author, tags });
        localStorage.setItem("liked_quotes", JSON.stringify(storedLikes));
        
        const storedCats = JSON.parse(localStorage.getItem("user_interests") || "[]");
        tags.forEach(tag => {
          if (!storedCats.includes(tag)) storedCats.push(tag);
        });
        localStorage.setItem("user_interests", JSON.stringify(storedCats));
      }
    } catch (error) {
      console.error("Failed to like:", error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${text}" - ${author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "QuoteWire",
        text: `"${text}" - ${author}`,
        url: window.location.href,
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 flex flex-col gap-6 relative group transition-all hover:shadow-md"
    >
      <div className="relative">
        <span className="text-6xl text-zinc-100 absolute -top-4 -left-4 font-serif leading-none select-none">“</span>
        <p className="text-xl md:text-2xl text-zinc-800 font-medium leading-relaxed relative z-10">
          {text}
        </p>
      </div>
      
      <div className="flex flex-col gap-4">
        <p className="text-zinc-500 font-medium">— {author}</p>
        
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag} className="text-xs font-semibold px-2.5 py-1 bg-zinc-50 text-zinc-400 rounded-full border border-zinc-100">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-6 border-t border-zinc-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors ${liked ? 'text-red-500' : 'text-zinc-400 hover:text-red-500'}`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span className="text-sm font-semibold">{likes}</span>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCopy}
            className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </button>
          <button 
            onClick={handleShare}
            className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors"
            title="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
