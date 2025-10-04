"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/contexts/session-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

function LoginPageContent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useSession();

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setInfoMessage(message);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('Login attempt:', { username, password: '***' });

    try {
      const result = await login(username, password);
      console.log('Login result:', result);

      if (result.success) {
        console.log('Redirecting to homepage...');
        router.push("/homepage");
      } else {
        console.log('Login failed:', result.error);
        setError(result.error || "Login failed");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#4c4d4e' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-64 h-64 flex items-center justify-center mb-6">
            <Image src="/media/USMSBadge.png" alt="USMS Badge" width={256} height={256} className="object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-6">USMS Dashboard</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Input
              id="login-username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 h-12 text-center"
              required
            />
          </div>

          <div>
            <Input
              id="login-password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 h-12 text-center"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          {infoMessage && (
            <div className="text-orange-400 text-sm text-center">{infoMessage}</div>
          )}

          <div className="text-gray-400 text-xs text-center space-y-1">
            <p>• User accounts must be created by an administrator</p>
            <p>• Contact your admin if you need login credentials</p>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 h-12"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}