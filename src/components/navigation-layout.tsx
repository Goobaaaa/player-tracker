"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { mockGetSession } from "@/lib/mock-auth";
import Image from "next/image";
import { LogOut, Home, Car, MessageSquare, Camera, Quote, Gift, Calendar } from "lucide-react";

interface NavigationLayoutProps {
  children: React.ReactNode;
}

export function NavigationLayout({ children }: NavigationLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: 'admin' | 'marshall' } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session, user: sessionUser }, error } = await mockGetSession();
      if (error || !session) {
        router.push("/login");
        return;
      }
      setIsAuthenticated(true);
      setUser(sessionUser);
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      const { mockSignOut } = await import("@/lib/mock-auth");
      await mockSignOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    }
  };

  const navItems = [
    { icon: Home, label: "Homepage", href: "/homepage" },
    { icon: Users, label: "Marshalls", href: "/marshalls" },
    { icon: Car, label: "Fleet", href: "/fleet" },
    { icon: MessageSquare, label: "Marshall Chatroom", href: "/marshall-chatroom" },
    { icon: Camera, label: "Marshall Media", href: "/marshall-media" },
    { icon: Quote, label: "Quote Wall", href: "/quote-wall" },
    { icon: Gift, label: "Commendation Jar", href: "/commendation-jar" },
    { icon: Calendar, label: "Upcoming Events", href: "/upcoming-events" },
  ];

  // No filtering needed as all nav items are available to all users
  const filteredNavItems = navItems;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left-hand navigation menu */}
      <div className="w-64 bg-gray-800 border-r border-gray-700">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Image src="/media/USMSBadge.png" alt="USMS Badge" width={40} height={40} className="object-contain" />
            <h2 className="text-2xl font-bold text-white">USMS</h2>
          </div>

          <nav className="space-y-2">
            {filteredNavItems.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors block ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="mb-4">
              <p className="text-sm text-gray-400">Logged in as:</p>
              <p className="text-white font-medium">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
              <p className="text-xs text-blue-400 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}

// Import Users icon
import { Users } from "lucide-react";