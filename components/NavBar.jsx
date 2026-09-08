"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import UserButton from "./UserButton";
import { Button } from "./ui/button";
import { MdAdminPanelSettings } from "react-icons/md";
import { Menu, X, Clock, Loader2 } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";

import { DM_Sans } from "next/font/google";

const dm_sans = DM_Sans({ weight: ["400", "500", "700"], subsets: ["latin"] });

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();

  const [formattedTimeDisplay, setFormattedTimeDisplay] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthenticated = Boolean(session?.user?.email);
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    const timer = setInterval(() => {
      setFormattedTimeDisplay(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Departments", href: "/departments" },
    ...(isAuthenticated && isAdmin ? [{ label: "Admin Panel", href: "/admin" }] : []),
  ];

  return (
    <header
      className={`${dm_sans.className} sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "glass shadow-lg" : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Recruitment <span className="text-primary">Portal</span>
          </span>
          <span className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground border border-border rounded-full px-2 py-0.5">
            <Clock className="h-3 w-3" />
            {formattedTimeDisplay}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label === "Admin Panel" && (
                <MdAdminPanelSettings className="inline h-4 w-4 mr-1 -mt-0.5" />
              )}
              {item.label}
            </Link>
          ))}

          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : !isAuthenticated ? (
            <Link href="/auth/signin">
              <Button size="sm">Sign In</Button>
            </Link>
          ) : (
            <UserButton user={session.user} />
          )}
          <ThemeToggle />
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden glass border-t border-border"
          >
            <div className="flex flex-col gap-4 px-4 py-4">
              <ThemeToggle />
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-foreground"
                >
                  {item.label}
                </Link>
              ))}
              {isPending ? null : !isAuthenticated ? (
                <Link href="/auth/signin" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full">Sign In</Button>
                </Link>
              ) : (
                <UserButton user={session.user} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavBar;