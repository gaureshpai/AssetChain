import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import UserNav from "@/components/user/user-nav";

export const metadata = {
  title: "undefined",
  description: "This is the undefined project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Content-Security-Policy" 
              content="default-src 'self' 'https://4ecd215985c1.ngrok-free.app' 'https://*.ngrok-free.app' 'https://*.magic.link' 'wss://*.magic.link'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' 'https://4ecd215985c1.ngrok-free.app' 'https://*.ngrok-free.app' 'https://*.magic.link' 'wss://*.magic.link'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"/>
      </head>
      <body>
        <AuthProvider>
          <UserNav />
          {/* Client shell adds navbar for user pages */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
