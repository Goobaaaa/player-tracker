"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockGetSession } from "@/lib/mock-auth";

export default function AccessDeniedPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await mockGetSession();
      if (error || !session) {
        router.push("/login");
        return;
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Centered exclamation mark */}
        <div className="text-6xl font-bold text-red-600 mb-8">!</div>

        {/* Bold heading */}
        <h1 className="text-4xl font-bold text-red-600 mb-6">
          ACCESS DENIED
        </h1>

        {/* Subtext */}
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          You are attempting to access a restricted document, please contact the person in charge of this document or the system administrator if you are seeing this in error.
        </p>

        {/* Return to homepage button */}
        <button
          onClick={() => router.push("/homepage")}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Return to Homepage
        </button>
      </div>
    </div>
  );
}