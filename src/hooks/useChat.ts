"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useCompletion } from '@ai-sdk/react';
import { toast } from "sonner";

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
  const currentQueryRef = useRef("");

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

  // Custom query setter that keeps ref in sync
  const setQueryValue = useCallback((value: string) => {
    setQuery(value);
    currentQueryRef.current = value;
  }, []);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPdfFile(file);
    setUploadMsg("");

    if (!file) return;

    // Upload logic directly here to avoid circular dependencies
    if (!apiToken) {
      setShowTokenModal(true);
      toast.info("Token required", {
        description: "Enter API token to upload",
        duration: 2500,
        icon: "🔑",
      });
      return;
    }

    setUploading(true);
    setUploadMsg("");
    setError("");
    setShowStatus(true);

    // Show loading toast
    const loadingToastId = toast.loading("Processing PDF...", {
      description: "Uploading and indexing document",
      icon: "⏳",
    });

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

      // Dismiss loading toast and show success
      toast.dismiss(loadingToastId);
      toast.success("PDF ready", {
        description: "Document uploaded and processed",
        duration: 2500,
        icon: "✅",
      });

      setPdfFile(null);
    } catch (err: unknown) {
      // Dismiss loading toast first
      toast.dismiss(loadingToastId);

      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      setShowStatus(true);
      if (statusTimeout.current) clearTimeout(statusTimeout.current);
      statusTimeout.current = setTimeout(() => setShowStatus(false), 3500);

      // Show error toast
      toast.error("Upload failed", {
        description: errorMessage,
        duration: 4000,
        icon: "❌",
      });
    } finally {
      setUploading(false);
      setUploadMsg("");
    }
  }, [apiToken]); // Only depend on apiToken

  const handleQuery = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiToken) {
      setShowTokenModal(true);
      toast.info("Token required", {
        description: "Enter API token to ask questions",
        duration: 2500,
        icon: "🔑",
      });
      return;
    }
    setLoading(true);
    setShowSkeleton(true);
    setShowStatus(true);
    setError("");
    setUploadMsg("");

    // Use ref to get current query value to avoid stale closure
    const currentQuery = currentQueryRef.current.trim();

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
    currentQueryRef.current = "";
    try {
      await complete(currentQuery);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      setShowStatus(true);

      // Show status tooltip with timeout (inline to avoid dependency issues)
      if (statusTimeout.current) clearTimeout(statusTimeout.current);
      statusTimeout.current = setTimeout(() => setShowStatus(false), 3500);

      // Show error toast for query failures
      toast.error("Query failed", {
        description: errorMessage,
        duration: 4000,
        icon: "❌",
      });
    } finally {
      setLoading(false);
      setShowSkeleton(false);
    }
  }, [apiToken, complete]); // Removed 'query' and 'showStatusTooltip' to prevent loops

  // Effects
  useEffect(() => {
    if (!completion || completion === lastCompletionRef.current) return;

    lastCompletionRef.current = completion;
    setMessages(prev => {
      if (prev.length === 0) return prev; // No messages to update

      const next = [...prev];
      const lastIdx = next.length - 1;
      if (next[lastIdx]) {
        next[lastIdx] = { ...next[lastIdx], answer: completion };
      }
      return next;
    });
  }, [completion]); // Only depend on completion

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

  // Keep query ref in sync with query state
  useEffect(() => {
    currentQueryRef.current = query;
  }, [query]);

  return {
    // States
    showStatus,
    query,
    setQuery: setQueryValue,
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
