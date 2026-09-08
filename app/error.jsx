"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#0a0a0a] text-white px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="mt-3 text-neutral-400">
          Please try again — if this keeps happening, let us know.
        </p>
      </motion.div>
      <Button size="lg" onClick={() => reset()}>
        Try again
      </Button>
    </main>
  );
}