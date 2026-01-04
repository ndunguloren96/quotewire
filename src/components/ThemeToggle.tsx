"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-14 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 opacity-50" />
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        relative w-14 h-8 rounded-full p-1 transition-colors duration-500 ease-in-out focus:outline-none 
        ${isDark ? "bg-zinc-800/80 hover:bg-zinc-800" : "bg-zinc-200/80 hover:bg-zinc-200"}
      `}
      aria-label="Toggle theme"
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="flex items-center justify-center w-6 h-6 rounded-full shadow-sm bg-white"
        animate={{ x: isDark ? 24 : 0 }}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-primary" fill="currentColor" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500" fill="currentColor" />
        )}
      </motion.div>
    </button>
  )
}