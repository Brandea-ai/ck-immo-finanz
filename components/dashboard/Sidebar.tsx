"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GitBranch,
  FileText,
  Settings,
  Zap,
  UserCircle,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Kunden", href: "/kunden", icon: Users },
  { name: "Pipeline", href: "/pipeline", icon: GitBranch },
  { name: "Dokumente", href: "/dokumente", icon: FileText },
  { name: "Automatisierung", href: "/automatisierung", icon: Zap },
  { name: "Einstellungen", href: "/einstellungen", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-900 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold">
          CK
        </div>
        <div>
          <div className="font-semibold text-sm">CK IMMO FINANZ</div>
          <div className="text-[10px] text-slate-400">Prozess-Automation</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700">
            <UserCircle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Christian Keller</div>
            <div className="text-xs text-slate-400">Geschäftsführer</div>
          </div>
          <button className="text-slate-400 hover:text-white">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
