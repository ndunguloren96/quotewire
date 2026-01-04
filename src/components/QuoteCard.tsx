"use client";

import { useState, useEffect } from "react";
import { Heart, Copy, Check, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface QuoteCardProps {
  PK: string;
  SK: string;
  text: string;
  author: string;
  tags: string[];
  likes?: number;
  views?: number;
}

export function QuoteCard({ PK, SK, text, author, tags, likes: initialLikes = 0, views: initialViews = 0 }: QuoteCardProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [views, setViews] = useState(initialViews);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatCount = (num: number) => {
    return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(num);
  };

  useEffect(() => {
    const logView = async () => {
      try {
        const res = await fetch("/api/quotes/view", {
          method: "POST",
          body: JSON.stringify({ pk: PK, sk: SK }),
        });
        const data = await res.json();
        if (data.views) setViews(data.views);
      } catch (error) {
        console.error("Failed to log view:", error);
      }
    };
    logView();
  }, [PK, SK]);

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    setLikes(prev => prev + 1);
    
    try {
      await fetch("/api/quotes/like", {
        method: "POST",
        body: JSON.stringify({ pk: PK, sk: SK }),
      });
    } catch (error) {
      console.error("Failed to like:", error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${text}" - ${author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card text-card-foreground p-6 md:p-8 rounded-none shadow-sm border border-border flex flex-col gap-4 relative group transition-all hover:shadow-md dark:shadow-none h-full"
    >
      <div className="relative flex-grow">
        <span className="text-4xl text-muted/20 absolute -top-3 -left-2 font-serif leading-none select-none">“</span>
        <p className="text-lg md:text-xl font-medium leading-relaxed relative z-10 pl-2">
          {text}
        </p>
      </div>
      
      <div className="flex flex-col gap-3">
        <p className="text-muted-foreground font-medium text-sm pl-2">— {author}</p>
        
        <div className="flex flex-wrap gap-2 pl-2">
          {tags.map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-secondary text-secondary-foreground border border-border">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-4 border-t border-border pl-2">
        <div className="flex items-center gap-6">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors ${liked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            <span className="text-xs font-semibold">{formatCount(likes)}</span>
          </button>
          
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span className="text-xs font-semibold">{formatCount(views)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCopy}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
