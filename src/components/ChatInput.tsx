"use client";
import { Upload, Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  query: string;
  setQuery: (value: string) => void;
  loading: boolean;
  pdfFile: File | null;
  uploading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  triggerFileInput: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function ChatInput({
  query,
  setQuery,
  loading,
  pdfFile,
  uploading,
  onSubmit,
  onFileChange,
  triggerFileInput,
  fileInputRef
}: ChatInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl px-2 md:px-0 pb-6 z-30"
      autoComplete="off"
    >
      <div className="flex items-center bg-neutral-900/70 border border-white/30 rounded-2xl shadow-2xl px-5 py-4 gap-3 backdrop-blur-md animate-fade-in hover:border-white/50 transition-colors duration-200">
        {/* Upload icon */}
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={onFileChange}
          className="hidden"
        />
        <div className="relative group">
          <button
            type="button"
            onClick={triggerFileInput}
            className="p-3 rounded-xl hover:bg-neutral-700/50 transition-all duration-200 text-white focus:outline-none focus:ring-2 focus:ring-white/50 hover:scale-105 border border-white/20 hover:border-white/40"
            tabIndex={-1}
            aria-label="Upload PDF"
          >
            <Upload className="w-5 h-5" strokeWidth={2} />
          </button>
          {/* Upload button tooltip */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-14 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-gray-800/90 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap z-50 border border-white/30 backdrop-blur-sm">
            Upload PDF
          </div>
        </div>

        {/* Input */}
        <input
          type="text"
          className="flex-1 bg-transparent outline-none text-white placeholder-white/60 text-lg px-4 font-light"
          placeholder="Ask me anything..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          disabled={loading}
          autoFocus
        />

        {/* Send button */}
        <button
          type="submit"
          className="ml-3 p-3 rounded-xl bg-white hover:bg-gray-100 shadow-xl focus:outline-none focus:ring-2 focus:ring-white/60 transition-all duration-200 hover:scale-105 hover:shadow-2xl disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 group border border-white/20"
          disabled={loading || !query.trim()}
          aria-label="Send"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            {loading ? (
              <Loader2 className="w-5 h-5 text-black animate-spin" strokeWidth={2.5} />
            ) : (
              <Send className="w-5 h-5 text-black group-hover:text-gray-800 transition-colors duration-200 group-active:scale-90" strokeWidth={2.5} />
            )}
          </div>
        </button>
      </div>

      {/* File name preview below input bar */}
      {pdfFile && !uploading && (
        <div className="mt-2 text-xs text-white/80 text-center animate-fade-in">Selected: {pdfFile.name}</div>
      )}
    </form>
  );
}
