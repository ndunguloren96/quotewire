'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Quote } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 1 }}
          className="absolute top-10 left-10 text-foreground"
        >
          <Quote size={120} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-20 right-10 text-foreground rotate-180"
        >
          <Quote size={160} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-8 max-w-lg relative z-10"
      >
        <div className="relative inline-block">
          <motion.h1
            className="text-[10rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/20 select-none"
            initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            404
          </motion.h1>
          <motion.div 
            className="absolute -top-4 -right-8 text-primary rotate-12"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
          >
            <span className="text-4xl">?</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h2 className="text-3xl font-bold tracking-tight">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg">
            We couldn't find the page you were looking for.
          </p>
        </motion.div>

        {/* Thematic Quote Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mx-auto"
        >
          <div className="relative p-8 bg-card border border-border rounded-2xl shadow-sm max-w-md mx-auto group hover:border-primary/50 transition-colors duration-300">
            <Quote className="absolute -top-3 -left-3 text-primary bg-background p-1 border border-border rounded-full group-hover:scale-110 transition-transform duration-300" size={32} />
            <figure className="text-center">
              <blockquote className="font-serif text-xl italic text-foreground/90 leading-relaxed">
                "Not all those who wander are lost... <br/>
                <span className="text-muted-foreground text-base not-italic mt-2 block font-sans">
                  (but it seems you might be)
                </span>"
              </blockquote>
              <figcaption className="text-sm text-primary font-bold mt-4 tracking-wide uppercase">
                J.R.R. Tolkien <span className="text-muted-foreground font-normal normal-case opacity-50 ml-1">...ish</span>
              </figcaption>
            </figure>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link
            href="/"
            className="group flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/25 active:scale-95"
          >
            <Home size={18} className="group-hover:-translate-y-0.5 transition-transform" />
            Return Home
          </Link>
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 px-8 py-3 bg-secondary text-secondary-foreground rounded-full font-medium transition-all hover:bg-secondary/80 hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            Go Back
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
