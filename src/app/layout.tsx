import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDF Chat - Ask Questions about your PDFs",
  description: "A modern PDF chat application powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          expand={false}
          richColors={true}
          // closeButton={true}
          duration={3000}
          gap={8}
          offset={24}
          toastOptions={{
            classNames: {
              toast: 'group flex items-center space-x-3 overflow-hidden rounded-lg border bg-neutral-900 text-white backdrop-blur-sm px-4 py-3 shadow-lg transition-all duration-200 ease-out data-[type=success]:border-green-200 data-[type=error]:border-red-200 data-[type=info]:border-blue-200 data-[type=loading]:border-neutral-800 hover:bg-neutral-900 max-w-sm',
              title: 'text-sm  font-medium text-white leading-tight',
              description: 'text-xs text-neutral-400 leading-relaxed',
              content: 'flex-1',
            },
          }}
        />
      </body>
    </html>
  );
}
