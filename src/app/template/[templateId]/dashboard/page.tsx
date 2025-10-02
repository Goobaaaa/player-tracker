"use client";

import { useParams } from "next/navigation";
import { mockGetSession } from "@/lib/mock-auth";
import { hasTemplateAccess } from "@/lib/mock-data";
import { getTemplateById } from "@/lib/mock-data";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the dashboard page to avoid SSR issues
const DashboardPage = dynamic(() => import("../../../dashboard/page"), {
  ssr: false,
});

export default function TemplateDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const templateId = params.templateId as string;

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Check if user is authenticated
        const { data: { session, user }, error } = await mockGetSession();
        if (error || !session || !user) {
          router.push("/login");
          return;
        }

        // Check if template exists
        const template = getTemplateById(templateId);
        if (!template) {
          router.push("/homepage");
          return;
        }

        // Check if user has access to this template
        const hasAccess = hasTemplateAccess(templateId, user.id);
        if (!hasAccess) {
          router.push("/access-denied");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Error checking template access:", error);
        router.push("/homepage");
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [templateId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect
  }

  return <DashboardPage />;
}