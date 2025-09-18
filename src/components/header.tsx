"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Settings, User } from "lucide-react";
import { SearchBar } from "@/components/search-bar";

export function Header() {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="text-white text-lg font-semibold">Player Tracker</div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
            <Bell className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
            <Settings className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm text-gray-300">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}