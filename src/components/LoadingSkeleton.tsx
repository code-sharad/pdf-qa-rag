"use client";
import { Bot, Loader2 } from "lucide-react";

interface LoadingSkeletonProps {
  showSkeleton: boolean;
  streaming: boolean;
}

export default function LoadingSkeleton({ showSkeleton, streaming }: LoadingSkeletonProps) {
  if (!showSkeleton && !streaming) return null;

  return (
    <div className="mb-6">
      <div className="flex items-start gap-3 mt-2">
        <div className="rounded-full bg-neutral-900 p-2 flex items-center justify-center border border-white/30">
          <Bot className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div className="bg-neutral-950 border border-white/25 rounded-xl px-4 py-3 text-white text-base shadow-lg max-w-2xl w-fit">
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="w-4 h-4 animate-spin text-white/60" />
            <span className="text-white/60 text-sm">Generating response...</span>
          </div>
         
        </div>
      </div>
    </div>
  );
}
