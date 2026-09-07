"use client";

import React from "react";
import { MagicCard } from "@/components/magicui/magic-card";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function MagicCardComp({ dept }) {
  const { theme } = useTheme();

  return (
    <MagicCard
      className="cursor-pointer flex flex-col justify-between p-6 shadow-2xl transition-all hover:scale-[1.02] h-full"
      gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
    >
      <div>
        {dept.image && (
          <div className="mb-4 w-10 h-10 relative">
            <Image src={dept.image} alt={dept.title} fill className="object-contain" />
          </div>
        )}
        <h3 className="text-xl font-bold mb-2 text-foreground">{dept.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{dept.description}</p>
      </div>
    </MagicCard>
  );
}