"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockSignIn } from "@/lib/mock-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await mockSignIn(username, password);

      if (error) {
        setError(error.message);
      } else if (data.user) {
        router.push("/homepage");
      }
    } catch {
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
              id="username"
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
              id="password"
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