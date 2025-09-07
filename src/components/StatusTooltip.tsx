"use client";
import { Loader2 } from "lucide-react";

interface StatusTooltipProps {
  showStatus: boolean;
  uploading: boolean;
  loading: boolean;
  uploadMsg: string;
  error: string;
  onClose: () => void;
}

export default function StatusTooltip({
  showStatus,
  uploading,
  loading,
  uploadMsg,
  error,
  onClose
}: StatusTooltipProps) {
  if (!showStatus || (!uploading && !loading && !uploadMsg && !error)) {
    return null;
  }

  return (
    <div
      className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 w-full max-w-md flex items-center justify-center pointer-events-none"
      aria-live="polite"
    >
    
    </div>
  );
}
