import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "FormChat – conversational forms", description: "Build chat-style forms, embed them anywhere, and collect responses." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}
