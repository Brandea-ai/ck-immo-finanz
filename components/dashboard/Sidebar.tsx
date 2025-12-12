"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const nav = [
  { name: "Dashboard", href: "/" },
  { name: "Pipeline", href: "/pipeline" },
  { name: "Kunden", href: "/kunden" },
  { name: "Team", href: "/team" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r bg-white flex flex-col">
      {/* Logo */}
      <div className="h-14 px-4 flex items-center border-b">
        <span className="font-semibold text-[15px] tracking-tight">
          CK IMMO FINANZ
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block px-3 py-2 rounded-md text-sm transition-colors",
              pathname === item.href
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
            CK
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Christian Keller</p>
            <p className="text-xs text-muted-foreground">Geschäftsführer</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
