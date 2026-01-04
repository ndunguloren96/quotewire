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
      className="bg-white p-6 md:p-8 rounded-none shadow-sm border border-zinc-200 flex flex-col gap-4 relative group transition-all hover:shadow-md"
    >
      <div className="relative">
        <span className="text-4xl text-zinc-200 absolute -top-3 -left-2 font-serif leading-none select-none">“</span>
        <p className="text-lg md:text-xl text-zinc-900 font-medium leading-relaxed relative z-10 pl-2">
          {text}
        </p>
      </div>
      
      <div className="flex flex-col gap-3">
        <p className="text-zinc-500 font-medium text-sm pl-2">— {author}</p>
        
        <div className="flex flex-wrap gap-2 pl-2">
          {tags.map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-zinc-50 text-zinc-500 border border-zinc-100">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-4 border-t border-zinc-50 pl-2">
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
