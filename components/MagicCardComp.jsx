"use client";

import React, { useState } from "react";
import { MagicCard } from "@/components/magicui/magic-card";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function MagicCardComp({ dept }) {
  const { theme } = useTheme();
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <MagicCard
      className="cursor-pointer flex flex-col justify-between p-6 shadow-2xl transition-all hover:scale-[1.02] h-full"
      gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
    >
      <div>
        {dept.image && (
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[hsl(var(--department-icon)/0.22)] bg-[hsl(var(--department-icon)/0.1)] shadow-[0_8px_18px_hsl(var(--department-icon)/0.12)]">
            {imageFailed ? (
              <Sparkles className="h-6 w-6 text-[hsl(var(--department-icon))]" />
            ) : (
              <Image
                src={dept.image}
                alt={dept.title}
                width={28}
                height={28}
                onError={() => setImageFailed(true)}
                className="h-7 w-7 object-contain department-logo"
              />
            )}
          </div>
        )}
        <h3 className="text-xl font-bold mb-2 text-foreground">{dept.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{dept.description}</p>
      </div>
    </MagicCard>
  );
}