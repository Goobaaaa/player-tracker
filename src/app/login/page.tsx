"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockSignIn } from "@/lib/mock-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await mockSignIn(email, password);

      if (error) {
        setError(error.message);
      } else if (data.user) {
        router.push("/dashboard");
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
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Input
              id="email"
              type="email"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 h-12 text-center"
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
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 h-12 text-center"
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