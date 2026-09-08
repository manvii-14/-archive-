"use client";
import React, { useState, useMemo } from "react";
import { notFound } from "next/navigation";
import { reviews } from "@/constants/index";

import NavBar from "@/components/NavBar";
import FormComp from "@/components/FormComp";
import Footer from "@/components/Footer";

const JoinDepartmentPage = ({ params }) => {
  const [isLoading, setIsLoading] = useState(true);
  const ids = params.joinIds;

  const valid = ids.every(
    (id) => reviews.some((dept) => dept.id === id) || id.startsWith("clerk_")
  );

  if (!valid) {
    notFound();
  }

  const departments = useMemo(
    () => reviews.filter((dept) => ids.includes(dept.id)),
    [ids]
  );

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <NavBar />
      <div className="flex-grow bg-grid">
        {/* Render FormComp unconditionally so users can fill it out before signing in */}
        <div className="container mx-auto px-4 py-10">
          <FormComp
            dept1={departments[0]}
            dept2={departments[1]}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default JoinDepartmentPage;