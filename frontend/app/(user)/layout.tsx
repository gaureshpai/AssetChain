import React from "react";
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
    <>
      <UserNav />
      {children}
    </>
  );
}
