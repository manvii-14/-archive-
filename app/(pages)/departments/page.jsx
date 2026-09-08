"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Bricolage_Grotesque, Space_Grotesk } from "next/font/google";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { reviews } from "@/constants";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { useSubmissions } from "@/components/SubmissionsProvider";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const departments = reviews;

const DepartmentsListPage = () => {
  const router = useRouter();
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const { submittedDepartments } = useSubmissions();

  const remainingSlots = 2 - submittedDepartments.length;
  const selectedCount = selectedDepartments.length;

  const selectedIds = useMemo(
    () =>
      departments
        .filter((dept) => selectedDepartments.includes(dept.name))
        .map((dept) => dept.id),
    [selectedDepartments]
  );

  const isContinueDisabled = selectedIds.length === 0;

  const toggleDepartment = (departmentName) => {
    if (submittedDepartments.includes(departmentName)) {
      toast.error(`You have already submitted an application for ${departmentName}.`);
      return;
    }

    if (remainingSlots <= 0) {
      toast.error("You have already submitted the maximum allowed (2) applications.");
      return;
    }

    setSelectedDepartments((current) => {
      const isSelected = current.includes(departmentName);

      if (isSelected) {
        return current.filter((name) => name !== departmentName);
      }

      if (current.length >= remainingSlots) {
        toast.error(`You can select at most ${remainingSlots} department(s).`);
        return current;
      }

      return [...current, departmentName];
    });
  };

  const goToApplication = () => {
    if (!selectedIds.length) return;
    router.push(`/join/${selectedIds.join("/")}`);
  };

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <NavBar />

      <div className="flex-grow bg-grid">
        <div className="container mx-auto px-4 py-14 sm:py-20">
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center space-y-3 mb-14"
          >
            <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-4 py-1 text-xs font-medium text-muted-foreground">
              Step 01 · Select
            </span>
            <h1 className={`${spaceGrotesk.className} text-3xl sm:text-5xl font-bold tracking-tight`}>
              Pick your departments
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Select up to <span className="text-foreground font-semibold">two</span> departments.
              Check the ones you wish to apply for.
            </p>
          </motion.header>

          <div className={`${bricolageGrotesque.className} grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-32`}>
            {departments.map((department, index) => {
              const Icon = department.icon;
              const isSelected = selectedDepartments.includes(department.name);
              const isSubmitted = submittedDepartments.includes(department.name);

              return (
                <motion.button
                  key={department.id}
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => toggleDepartment(department.name)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  whileHover={!isSubmitted ? { y: -4 } : {}}
                  whileTap={!isSubmitted ? { scale: 0.98 } : {}}
                    className={`glass-card group relative text-left rounded-2xl p-5 transition-all duration-300 overflow-hidden
                    ${isSubmitted ? "opacity-50 cursor-not-allowed border-border bg-card/40" : "cursor-pointer"}
                    ${
                      isSelected
                        ? "border-primary/70 shadow-[0_0_0_1px_hsl(var(--primary)),0_20px_45px_hsl(var(--primary)/0.16)]"
                        : "hover:-translate-y-1 hover:border-primary/40"
                    }`}
                >
                  <div
                    className="absolute -top-10 -right-10 h-28 w-28 rounded-full blur-3xl opacity-20 transition-opacity duration-300 group-hover:opacity-30"
                    style={{ background: department.tone }}
                  />

                  <div className="relative flex items-start justify-between gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: `${department.tone}1A`,
                        color: department.tone,
                      }}
                    >
                      {Icon ? <Icon fontSize="small" /> : null}
                    </div>

                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                        isSelected
                          ? "bg-primary border-primary"
                          : "border-border"
                      }`}
                    >
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Check className="h-3.5 w-3.5 text-primary-foreground" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <h3 className="relative mt-4 font-semibold text-base">
                    {department.name}
                    {isSubmitted && (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        (Already submitted)
                      </span>
                    )}
                  </h3>
                  <p className="relative mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {department.description}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-border glass"
          >
            <div className="container mx-auto flex items-center justify-between px-4 py-4">
              <p className="text-sm font-medium">
                <span className="text-primary font-bold">{selectedCount}</span> / 2 selected
              </p>
              <button
                type="button"
                onClick={goToApplication}
                disabled={isContinueDisabled}
                className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.97] disabled:opacity-50"
              >
                Continue to application
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
};

export default DepartmentsListPage;