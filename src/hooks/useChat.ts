"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useCompletion } from '@ai-sdk/react';

interface Message {
  question: string;
  answer: string;
}

export function useChat() {
  // States
  const [showStatus, setShowStatus] = useState(false);
  const statusTimeout = useRef<NodeJS.Timeout | null>(null);
  const [query, setQuery] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [apiToken, setApiToken] = useState("");
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenDraft, setTokenDraft] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastCompletionRef = useRef("");

  const { completion, complete, isLoading: streaming, error: completionError } = useCompletion({
    api: '/api/query',
    headers: { Authorization: `Bearer ${apiToken}` }
  });

  // Memoized functions to prevent unnecessary re-renders
  const showStatusTooltip = useCallback(() => {
    setShowStatus(true);
    if (statusTimeout.current) clearTimeout(statusTimeout.current);
    statusTimeout.current = setTimeout(() => setShowStatus(false), 3500);
  }, []);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleUpload = useCallback(async (file: File) => {
    if (!apiToken) {
      setShowTokenModal(true);
      return;
    }
    setUploading(true);
    setUploadMsg("");
    setError("");
    setShowStatus(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setUploadMsg("PDF uploaded and processed successfully!");
      setPdfFile(null);
      showStatusTooltip();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      setShowStatus(true);
      showStatusTooltip();
    } finally {
      setUploading(false);
      setUploadMsg("");
    }
  }, [apiToken, showStatusTooltip]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPdfFile(file);
    setUploadMsg("");
    if (file) {
      handleUpload(file);
    }
  }, [handleUpload]);

  const handleQuery = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiToken) {
      setShowTokenModal(true);
      return;
    }
    setLoading(true);
    setShowSkeleton(true);
    setShowStatus(true);
    setError("");
    setUploadMsg("");
    const currentQuery = query.trim();
    if (!currentQuery) {
      setLoading(false);
      setShowSkeleton(false);
      return;
    }
    setMessages((prev) => [
      ...prev,
      { question: currentQuery, answer: "" },
    ]);
    setQuery("");
    try {
      await complete(currentQuery);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      setShowStatus(true);
      showStatusTooltip();
    } finally {
      setLoading(false);
      setShowSkeleton(false);
    }
  }, [apiToken, query, complete, showStatusTooltip]);

  // Effects
  useEffect(() => {
    if (!messages.length || !completion || completion === lastCompletionRef.current) return;

    lastCompletionRef.current = completion;
    setMessages(prev => {
      const next = [...prev];
      const lastIdx = next.length - 1;
      if (next[lastIdx]) {
        next[lastIdx] = { ...next[lastIdx], answer: completion };
      }
      return next;
    });
  }, [completion, messages.length]); // Include messages.length dependency

  useEffect(() => {
    if (completionError) setError(completionError.message);
  }, [completionError]);

  useEffect(() => {
    if (streaming) {
      setLoading(false);
      setShowSkeleton(false);
    }
  }, [streaming]);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('apiToken') : null;
    if (saved) {
      setApiToken(saved);
    } else {
      setShowTokenModal(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && apiToken) localStorage.setItem('apiToken', apiToken);
  }, [apiToken]);

  return {
    // States
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

    // Functions
    triggerFileInput,
    handleFileChange,
    handleQuery,
    showStatusTooltip,
    setShowStatus
  };
}
