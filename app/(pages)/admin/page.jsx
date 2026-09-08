"use client";
import React, { useState } from "react";

import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import BlurFadeGrid from "@/components/BlurFadeGrid";
import PopupComp from "@/components/PopupComp";
import { authClient } from "@/lib/auth-client";

const Home = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const popupConfig = {
    header: "Recruitment Notice",
    description: "Welcome to the recruitment portal.",
    message: [
      "Sign in with your email address to begin your application.",
      "You can apply to up to two departments.",
    ],
  };

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <NavBar />

      {!isPending && !user && (
        <PopupComp
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          PopupData={popupConfig}
        />
      )}

      <div className="flex-grow container mx-auto px-4 py-8 space-y-12">
        <Hero />

        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Explore Departments</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Join our departments and work on real-world projects.
            </p>
          </div>

          <BlurFadeGrid />
        </section>
      </div>

      <Footer />
    </main>
  );
};

export default Home;