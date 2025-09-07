"use client";
import { Bot } from "lucide-react";

export default function Header() {
  return (
    <div className="w-full flex flex-col items-center pt-16 pb-4">
      <div className="w-24 h-24 rounded-full flex items-center justify-center bg-neutral-800/50 shadow-2xl relative border border-white/25">
        <div className="absolute inset-0 rounded-full blur-2xl bg-white/10 animate-pulse" />
        <Bot size={56} className="relative z-10 text-white" strokeWidth={2.2} />
      </div>
      <h1 className="mt-4 text-3xl font-extrabold text-white tracking-tight font-sans uppercase drop-shadow-lg">PDF Chat</h1>
    </div>
  );
}