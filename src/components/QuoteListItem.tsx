"use client";

import { Heart, Copy, Share2, Check } from "lucide-react";
import { useState } from "react";

interface QuoteListItemProps {
  pk: string;
  sk: string;
  text: string;
  author: string;
  tags: string[];
}

export function QuoteListItem({ pk, sk, text, author, tags }: QuoteListItemProps) {
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${text}" - ${author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    try {
      await fetch("/api/quotes/like", {
        method: "POST",
        body: JSON.stringify({ pk, sk }),
      });
    } catch (e) { console.error(e); }
  };

  return (
    <div className="py-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-start justify-between gap-4 group hover:bg-zinc-50/50 transition-colors px-4 -mx-4">
      <div className="flex-1">
        <p className="text-zinc-800 text-base leading-relaxed mb-2 font-serif">
          "{text}"
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">— {author}</span>
          <div className="flex gap-2">
            {tags.map(t => (
              <span key={t} className="text-[10px] text-zinc-400 border border-zinc-200 px-1.5 py-0.5">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={handleLike} className={`p-1.5 ${liked ? 'text-red-500' : 'text-zinc-300 hover:text-zinc-600'}`}>
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
        </button>
        <button onClick={handleCopy} className="p-1.5 text-zinc-300 hover:text-zinc-600">
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
