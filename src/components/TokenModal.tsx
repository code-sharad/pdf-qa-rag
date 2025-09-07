"use client";
import { Bot } from "lucide-react";
import { toast } from "sonner";

interface TokenModalProps {
  showTokenModal: boolean;
  tokenDraft: string;
  setTokenDraft: (value: string) => void;
  setApiToken: (value: string) => void;
  setShowTokenModal: (value: boolean) => void;
}

export default function TokenModal({
  showTokenModal,
  tokenDraft,
  setTokenDraft,
  setApiToken,
  setShowTokenModal
}: TokenModalProps) {
  if (!showTokenModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowTokenModal(false)} />
      <div className="relative z-10 w-full max-w-xs rounded-2xl bg-neutral-950 border border-white/30 p-7 shadow-2xl flex flex-col items-center">
        <Bot className="w-10 h-10 text-white mb-3" strokeWidth={2.2} />
        <h3 className="text-lg font-semibold text-white mb-6">Enter API Token</h3>
        <input
          type="password"
          value={tokenDraft}
          onChange={e => setTokenDraft(e.target.value)}
          className="w-full rounded-lg border border-white/40 bg-neutral-800 px-3 py-2 outline-none text-white focus:ring-2 focus:ring-white/60 focus:border-white/60"
          placeholder="Paste your API secret"
          autoFocus
        />
        <div className="mt-4 flex justify-end gap-2 w-full">
          <button
            type="button"
            className="rounded-lg border border-white/40 px-3 py-2 text-xs text-white hover:bg-white/15 transition-colors"
            onClick={() => setShowTokenModal(false)}
          >Cancel</button>
          <button
            type="button"
            className="rounded-lg bg-white text-black px-4 py-2 text-xs font-medium disabled:opacity-50 hover:bg-gray-100 transition-colors"
            disabled={!tokenDraft}
            onClick={() => {
              setApiToken(tokenDraft);
              setTokenDraft("");
              setShowTokenModal(false);
              toast.success("Token saved", {
                description: "Ready to upload and chat",
                duration: 2500,
                icon: "✅",
              });
            }}
          >Save</button>
        </div>
      </div>
    </div>
  );
}
