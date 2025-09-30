"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Bell, Settings, User } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { useAppSettings } from "@/contexts/app-settings-context";

export function Header() {
  const [ukTime, setUkTime] = useState("");
  const [usTime, setUsTime] = useState("");
  const { appName, appLogo } = useAppSettings();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // UK GMT (UTC+0 or UTC+1 during BST)
      const ukTimeStr = now.toLocaleTimeString('en-GB', {
        timeZone: 'Europe/London',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      // US EST (UTC-5 or UTC-4 during EDT)
      const usTimeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      setUkTime(ukTimeStr);
      setUsTime(usTimeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-6">
          <div className="text-white text-lg font-semibold flex items-center">
            <Image src={appLogo} alt="App Logo" width={32} height={32} className="w-8 h-8 mr-2" />
            {appName}
          </div>
          <SearchBar />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 bg-gray-700 px-3 py-1 rounded-lg">
            <div className="text-center">
              <div className="text-xs text-gray-400">UK GMT</div>
              <div className="text-sm font-mono text-white">{ukTime}</div>
            </div>
            <div className="text-gray-500">|</div>
            <div className="text-center">
              <div className="text-xs text-gray-400">US EST</div>
              <div className="text-sm font-mono text-white">{usTime}</div>
            </div>
          </div>
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