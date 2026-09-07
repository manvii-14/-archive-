"use client";

import React from "react";
import BlurFade from "@/components/magicui/blur-fade";
import MagicCardComp from "./MagicCardComp";
import { technicalCards, nonTechnicalCards } from "../constants/index";
import Link from "next/link";

export default function BlurFadeGrid() {
  const allDepartments = [...technicalCards, ...nonTechnicalCards];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {allDepartments.map((dept, idx) => (
        <BlurFade key={dept.formLink || idx} delay={0.02 * idx} inView>
          <Link href={`/join${dept.formLink}`}>
            <MagicCardComp dept={dept} />
          </Link>
        </BlurFade>
      ))}
    </div>
  );
}