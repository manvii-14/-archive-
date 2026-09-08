"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600"] });

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative flex flex-col items-center text-center gap-6 pt-12 sm:pt-16 pb-20 sm:pb-28"
    >
      <motion.div variants={item}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/gdg.svg"
          alt="Organization logo"
          className="h-14 w-auto object-contain"
        />
      </motion.div>

      <motion.span
        variants={item}
        className="inline-flex items-center rounded-full border border-border bg-muted/50 px-4 py-1 text-xs sm:text-sm font-medium text-muted-foreground"
      >
        Applications now open
      </motion.span>

      <motion.h1
        variants={item}
        className={`${spaceGrotesk.className} text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gradient`}
      >
        Recruitment 2026
      </motion.h1>

      <motion.h2 variants={item} className="text-xl sm:text-2xl font-semibold text-foreground/80">
        Ready to make your mark?
      </motion.h2>

      <motion.p variants={item} className="max-w-xl text-sm sm:text-base text-muted-foreground">
        Join our departments and work on real-world projects. Your journey starts here.
      </motion.p>

      <motion.div variants={item}>
        <Link href="/departments">
          <button
            type="button"
            className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm sm:text-base font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.97] shadow-[0_0_30px_-8px_hsl(var(--primary))]"
          >
            Join us
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </Link>
      </motion.div>
    </motion.div>
  );
}