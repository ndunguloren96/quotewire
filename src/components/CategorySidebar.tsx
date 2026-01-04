"use client";

import { CATEGORIES } from "@/lib/categories";
import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";

interface CategorySidebarProps {
  onSelectCategory: (category: string) => void;
  selectedCategory?: string;
}

export function CategorySidebar({ onSelectCategory, selectedCategory }: CategorySidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = CATEGORIES.filter(cat => 
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full md:w-64 flex flex-col gap-4 h-full border-r pr-4">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input 
          type="text" 
          placeholder="Search categories..." 
          className="w-full pl-10 pr-4 py-2 bg-zinc-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#6c47ff]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="overflow-y-auto flex-1 custom-scrollbar pr-2">
        <div className="flex flex-col gap-1">
          {filteredCategories.map(cat => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === cat 
                  ? 'bg-[#6c47ff10] text-[#6c47ff] font-semibold' 
                  : 'text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {cat}
              {selectedCategory === cat && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
