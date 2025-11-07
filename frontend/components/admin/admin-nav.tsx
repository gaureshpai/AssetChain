"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Building2,
  BarChart3,
  FileSpreadsheet,
  Banknote,
  ShoppingBag,
  Moon,
  Sun,
} from "lucide-react"
import { buttonVariants, Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

const links = [
  { href: "/admin/buildings", text: "Buildings", icon: Building2 },
  { href: "/admin/analytics", text: "Analytics", icon: BarChart3 },
  { href: "/admin/all-requests", text: "All Requests", icon: FileSpreadsheet },
  { href: "/admin/transactions", text: "Transactions", icon: Banknote },
  { href: "/marketplace", text: "Marketplace", icon: ShoppingBag },
]

export default function AdminNav() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme();

  return (
    <nav className="flex items-center gap-1 bg-card border border-border rounded-xl px-3 py-2 backdrop-blur shadow-sm">
      {links.map(({ href, text, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "flex items-center gap-2 text-sm text-muted-foreground transition-all duration-200",
              "hover:text-foreground hover:bg-accent",
              isActive && "bg-primary/20 text-primary border border-primary/40"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{text}</span>
          </Link>
        )
      })}
      <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </nav>
  )
}