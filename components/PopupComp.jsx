"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PopupComp = ({ isOpen, onClose, PopupData }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{PopupData?.header}</DialogTitle>
          <DialogDescription>{PopupData?.description}</DialogDescription>
        </DialogHeader>

        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
          {PopupData?.message?.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>

        <Button type="button" onClick={onClose} className="mt-2 w-full">
          Got it
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PopupComp;