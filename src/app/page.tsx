"use client";
import Header from "@/components/Header";
import TokenModal from "@/components/TokenModal";
import ChatMessage from "@/components/ChatMessage";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ChatInput from "@/components/ChatInput";
import StatusTooltip from "@/components/StatusTooltip";
import { useChat } from "@/hooks/useChat";

export default function HomePage() {
  const {
    showStatus,
    query,
    setQuery,
    pdfFile,
    uploading,
    uploadMsg,
    loading,
    showSkeleton,
    error,
    messages,
    apiToken,
    setApiToken,
    showTokenModal,
    setShowTokenModal,
    tokenDraft,
    setTokenDraft,
    fileInputRef,
    streaming,
    triggerFileInput,
    handleFileChange,
    handleQuery,
    setShowStatus
  } = useChat();

  // Debug: Log API token status (this prevents unused variable warning)
  if (process.env.NODE_ENV === 'development') {
    console.log('API Token available:', !!apiToken);
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-stone-950 relative overflow-hidden">
      {/* Token Modal */}
      <TokenModal
        showTokenModal={showTokenModal}
        tokenDraft={tokenDraft}
        setTokenDraft={setTokenDraft}
        setApiToken={setApiToken}
        setShowTokenModal={setShowTokenModal}
      />

      {/* Header */}
      <Header />

      {/* Chat Messages */}
      <div className="flex-1 w-full max-w-2xl mx-auto px-2 md:px-0 pb-40 overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-center text-white/70 mt-10 text-lg font-light">
            No conversation yet. Start by asking a question!
          </div>
        )}

        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}

        {/* Loading Response Skeleton */}
        <LoadingSkeleton showSkeleton={showSkeleton} streaming={streaming} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center justify-center mt-4">
          <div className="rounded-lg bg-red-900/40 text-white border border-red-500/50 px-4 py-3 text-sm w-fit text-center shadow-lg">
            {error}
          </div>
        </div>
      )}

      {/* Status Tooltip */}
      <StatusTooltip
        showStatus={showStatus}
        uploading={uploading}
        loading={loading}
        uploadMsg={uploadMsg}
        error={error}
        onClose={() => setShowStatus(false)}
      />

      {/* Chat Input */}
      <ChatInput
        query={query}
        setQuery={setQuery}
        loading={loading}
        pdfFile={pdfFile}
        uploading={uploading}
        onSubmit={handleQuery}
        onFileChange={handleFileChange}
        triggerFileInput={triggerFileInput}
        fileInputRef={fileInputRef}
      />
    </div>
  );
}
