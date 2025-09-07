"use client";
import { Bot, Keyboard } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface Message {
  question: string;
  answer: string;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className="mb-6">
      {/* User question */}
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-neutral-900 p-2 flex items-center justify-center border border-white/30">
          <Keyboard className="w-5 h-5 text-white" />
        </div>
        <div className="bg-neutral-900 border border-white/25 rounded-xl px-4 py-3 text-white text-base shadow-lg max-w-2xl w-fit font-medium">
          {message.question}
        </div>
      </div>

      {/* Assistant answer (streaming or final) */}
      {message.answer && (
        <div className="flex items-start gap-3 mt-2">
          <div className="rounded-full bg-neutral-900 p-2 flex items-center justify-center border border-white/30">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="bg-neutral-950 border border-white/25 rounded-xl px-4 py-3 text-white text-base shadow-lg max-w-2xl w-fit prose prose-invert prose-neutral break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                code({ className, children, ...props }) {
                  const isInline = Boolean('inline' in props && props.inline);
                  return !isInline ? (
                    <pre className={className + " rounded-lg p-3 bg-gray-700/30 border border-white/20 overflow-x-auto mt-2 mb-2 text-sm text-white"}>
                      <code {...props}>{children}</code>
                    </pre>
                  ) : (
                    <code className={className + " px-1 py-0.5 rounded bg-gray-600/40 text-white text-sm"} {...props}>{children}</code>
                  );
                },
                a({ ...props }) {
                  return <a {...props} className="underline text-white hover:opacity-80" target="_blank" rel="noopener noreferrer" />;
                },
                ul({ ...props }) {
                  return <ul {...props} className="list-disc ml-6" />;
                },
                ol({ ...props }) {
                  return <ol {...props} className="list-decimal ml-6" />;
                },
                blockquote({ ...props }) {
                  return <blockquote {...props} className="border-l-4 border-white/40 pl-4 italic text-white/90 my-2" />;
                },
                table({ ...props }) {
                  return <table {...props} className="border border-white/30 my-2" />;
                },
                th({ ...props }) {
                  return <th {...props} className="border border-white/30 px-2 py-1 bg-gray-700/30 text-white" />;
                },
                td({ ...props }) {
                  return <td {...props} className="border border-white/30 px-2 py-1 text-white/95" />;
                },
              }}
            >
              {message.answer}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
