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
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-fade-in pointer-events-auto bg-gray-800/90 text-white border border-white/30 backdrop-blur-sm"
        role="status"
      >
        {(uploading || loading) && <Loader2 className="w-5 h-5 animate-spin" />}
        <span className="flex items-center gap-1">
          {uploading
            ? <>
              Uploading PDF
              <span className="inline-block w-4"><span className="dot-flash" /></span>
            </>
            : loading
              ? <>
                Generating answer
                <span className="inline-block w-4"><span className="dot-flash" /></span>
              </>
              : error
                ? error
                : uploadMsg}
        </span>
        {(error || uploadMsg) && (
          <button
            type="button"
            className="ml-2 p-1 rounded-full hover:bg-white/20 focus:outline-none"
            aria-label="Close status tooltip"
            onClick={onClose}
            tabIndex={0}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M6 6l8 8M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
