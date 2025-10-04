"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/contexts/session-context";
import Image from "next/image";
import { LogOut, Home, Car, Users, MessageSquare, Camera, Quote, Gift, Calendar } from "lucide-react";

interface NavigationLayoutProps {
  children: React.ReactNode;
}

export function NavigationLayout({ children }: NavigationLayoutProps) {
  const { user, loading, signOut } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut();
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

  if (loading || !user) {
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
              <p className="text-xs text-gray-400">{user?.username}</p>
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

