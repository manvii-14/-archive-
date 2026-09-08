"use client";
import React, { useState } from "react";
import { useRouter, notFound } from "next/navigation";
import { reviews } from "@/constants/index";

import NavBar from "@/components/NavBar";
import FormComp from "@/components/FormComp";
import Footer from "@/components/Footer";
import DWASFWLoader from "@/components/GDGLoader";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

const JoinDepartmentPage = ({ params }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const isSignedIn = !!user;

  if (isPending) {
    return (
      <main className="min-h-screen flex flex-col bg-background text-foreground">
        <NavBar />
        <DWASFWLoader />
        <Footer />
      </main>
    );
  }

  const departments = reviews.filter((dept) => params.joinIds.includes(dept.id));
  const ids = params.joinIds;

  const valid = ids.every(
    (id) => reviews.some((dept) => dept.id === id) || id.startsWith("clerk_")
  );

  if (!valid) {
    notFound();
  }

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <NavBar />
      <div className="flex-grow bg-grid">
        {isSignedIn ? (
          <div className="container mx-auto px-4 py-10">
            <FormComp
              dept1={departments[0]}
              dept2={departments[1]}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>
        ) : (
          <div className="min-h-[70vh] flex items-center justify-center px-4">
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="glass rounded-xl border border-border p-8 sm:p-10 max-w-md w-full text-center space-y-4"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ShieldAlert className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Authentication Required</h2>
              <p className="text-sm text-muted-foreground">
                Please sign in to access the application form.
              </p>
              <Button
                type="button"
                size="lg"
                className="w-full"
                onClick={() => router.push("/auth/signin")}
              >
                Sign In
              </Button>
            </motion.section>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default JoinDepartmentPage;