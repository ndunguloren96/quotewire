"use client";

import * as React from "react";
import { Github, Star } from "lucide-react";

export function GitHubStar() {
  const [stars, setStars] = React.useState<number | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const fetchStars = async () => {
      // Simple client-side cache
      const cached = localStorage.getItem("github_stars_cache");
      const cacheTime = localStorage.getItem("github_stars_cache_time");
      const now = Date.now();

      if (cached && cacheTime && now - parseInt(cacheTime) < 3600000) { // 1 hour cache
        setStars(parseInt(cached));
        setIsVisible(true);
        return;
      }

      try {
        const res = await fetch("https://api.github.com/repos/ndunguloren96/quotewire");
        if (!res.ok) throw new Error("Repo not found");
        const data = await res.json();
        
        const count = data.stargazers_count;
        setStars(count);
        setIsVisible(true);
        
        localStorage.setItem("github_stars_cache", count.toString());
        localStorage.setItem("github_stars_cache_time", now.toString());
      } catch (error) {
        console.error("Failed to fetch GitHub stars:", error);
        setIsVisible(false);
      }
    };

    fetchStars();
  }, []);

  if (!isVisible) return null;

  return (
    <a
      href="https://github.com/ndunguloren96/quotewire"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all group"
      title="Star on GitHub"
    >
      <Github className="w-5 h-5 text-zinc-900 dark:text-white" />
      <div className="flex items-center gap-1 border-l border-zinc-200 dark:border-zinc-700 pl-2">
        <Star className="w-3.5 h-3.5 text-amber-500 group-hover:fill-amber-500 transition-all" />
        <span className="text-xs font-bold font-mono text-zinc-600 dark:text-zinc-400">
          {stars !== null ? stars.toLocaleString() : "---"}
        </span>
      </div>
    </a>
  );
}
