"use client";

import { useState, useEffect } from "react";
import { mockGetSession, isSessionActive } from "@/lib/mock-auth";

export default function DebugAuthPage() {
  const [authStatus, setAuthStatus] = useState<string>("Checking...");
  const [sessionData, setSessionData] = useState<{session?: Record<string, unknown>, user?: Record<string, unknown>} | null>(null);
  const [localStorageData, setLocalStorageData] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [sessionActive, setSessionActive] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const now = Date.now();
      setCurrentTime(now);

      try {
        // Check localStorage first
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('usms-session');
          const timeout = localStorage.getItem('usms-session-timeout');

          setLocalStorageData(stored ? JSON.stringify(JSON.parse(stored), null, 2) : 'No session in localStorage');

          // Check session active status
          setSessionActive(isSessionActive());

          console.log('Debug - Session stored:', stored);
          console.log('Debug - Session timeout:', timeout);
          console.log('Debug - Session active:', isSessionActive());
        }

        // Check mockGetSession
        const { data, error } = await mockGetSession();

        console.log('Debug - mockGetSession result:', { data, error });

        if (error) {
          setAuthStatus(`Error: ${error.message}`);
          setSessionData(null);
        } else if (data.session) {
          setAuthStatus("Authenticated");
          setSessionData(data);
        } else {
          setAuthStatus("Not authenticated");
          setSessionData(data);
        }
      } catch (err) {
        setAuthStatus(`Exception: ${err}`);
        setSessionData(null);
      }
    };

    checkAuth();
  }, []);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>

      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Current Time: {formatTime(currentTime)}</h2>
          <h2 className="text-lg font-semibold mb-2">Auth Status: {authStatus}</h2>
          <h2 className="text-lg font-semibold mb-2">Session Active: {sessionActive ? 'YES' : 'NO'}</h2>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Session Data:</h2>
          <pre className="text-sm text-gray-300 overflow-auto">
            {JSON.stringify(sessionData, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">LocalStorage Data:</h2>
          <pre className="text-sm text-gray-300 overflow-auto">
            {localStorageData}
          </pre>
        </div>
      </div>
    </div>
  );
}