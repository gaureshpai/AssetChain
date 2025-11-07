"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun, Wallet, FilePlus, Store, ShieldCheck } from "lucide-react";

export default function UserNav() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const short = (addr?: string) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "");

  return (
    <header className="border-b border-border bg-background backdrop-blur supports-backdrop-filter:bg-background sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/30">
              <span className="font-bold text-primary-foreground text-sm">AC</span>
            </div>
            <span className="font-semibold text-foreground">AssetChain</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-muted-foreground text-sm">
            <Link href="/portfolio" className="hover:text-foreground flex items-center gap-1">
              <Wallet className="h-4 w-4" />
              Portfolio
            </Link>
            <Link href="/create-request" className="hover:text-foreground flex items-center gap-1">
              <FilePlus className="h-4 w-4" />
              Create Request
            </Link>
            <Link href="/marketplace" className="hover:text-foreground flex items-center gap-1">
              <Store className="h-4 w-4" />
              Marketplace
            </Link>
            {user.role === "admin" && (
              <Link href="/admin" className="hover:text-foreground flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          {user.isConnected ? (
            <>
              <span className="text-xs text-muted-foreground font-mono hidden sm:block">{short(user.address)}</span>
              <Button size="sm" variant="outline" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Link href="/" className="text-sm text-primary hover:underline">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  );
}
