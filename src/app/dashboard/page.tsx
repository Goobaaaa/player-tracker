"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockGetSession } from "@/lib/mock-auth";
import { mockDashboardSummary } from "@/lib/mock-data";
import { DashboardSummary } from "@/lib/database";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { SummaryCard } from "@/components/summary-card";
import { TaskList } from "@/components/task-list";
import { ActivityFeed } from "@/components/activity-feed";
import FadeInCard from "@/components/fade-in-card";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await mockGetSession();
      if (error || !session) {
        router.push("/login");
        return;
      }

      loadDashboardData();
    };

    checkAuth();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setSummary(mockDashboardSummary);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Error loading dashboard</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 animate-slideIn">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <FadeInCard delay={1}>
                <SummaryCard
                  title="Total Players"
                  value={summary.totalPlayers}
                  icon="👥"
                  trend="+2 this week"
                />
              </FadeInCard>
              <FadeInCard delay={2}>
                <SummaryCard
                  title="Total Assets Value"
                  value={`$${summary.totalAssetsValue.toLocaleString()}`}
                  icon="💎"
                  trend="+12% this month"
                />
              </FadeInCard>
              <FadeInCard delay={3}>
                <SummaryCard
                  title="Total Cash Balance"
                  value={`$${summary.totalCashBalance.toLocaleString()}`}
                  icon="💰"
                  trend="+5% this month"
                />
              </FadeInCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FadeInCard delay={4}>
                <TaskList tasks={summary.recentTasks} />
              </FadeInCard>
              <FadeInCard delay={5}>
                <ActivityFeed activities={summary.recentActivity} />
              </FadeInCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}