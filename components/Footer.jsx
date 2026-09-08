"use client";

import React from "react";
import Link from "next/link";
import { DM_Sans } from "next/font/google";

const dm_sans = DM_Sans({ weight: ["400", "500"], subsets: ["latin"] });

const footerLinks = [
  { name: "Home", path: "/" },
  { name: "Departments", path: "/departments" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${dm_sans.className} border-t border-border bg-background`}>
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground">
        <p>Organization · Recruitment Portal &copy; {currentYear}</p>
        <div className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="hover:text-foreground transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;