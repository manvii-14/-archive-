"use client";
import React from "react";
import { Loader2 } from "lucide-react";

const DWASFWLoader = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
};

export default DWASFWLoader;