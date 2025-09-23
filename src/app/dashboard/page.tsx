"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockGetSession } from "@/lib/mock-auth";
import { mockDashboardSummary, getAllTasks, updateTaskOverdueStatus, mockUsers, getCurrentAuditLog, initializeSampleData, updateDashboardSummary } from "@/lib/mock-data";
import { Task, DashboardSummary } from "@/lib/database";
import { AuditLogEntry } from "@/components/activity-feed";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { SummaryCard } from "@/components/summary-card";
import { TaskList } from "@/components/task-list";
import { ActivityFeed } from "@/components/activity-feed";
import FadeInCard from "@/components/fade-in-card";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
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

  useEffect(() => {
    const interval = setInterval(() => {
      const currentLog = getCurrentAuditLog();
      setAuditLog(currentLog);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      updateTaskOverdueStatus();
      initializeSampleData();
      updateDashboardSummary();
      setSummary(mockDashboardSummary);
      setTasks(getAllTasks());
      setAuditLog(getCurrentAuditLog());
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task: Task) => {
    console.log("Task clicked:", task);
    setSelectedTask(task);
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
                  title="Total Suspects"
                  value={summary.totalPlayers}
                  icon="👥"
                />
              </FadeInCard>
              <FadeInCard delay={2}>
                <SummaryCard
                  title="Total Assets Value"
                  value={`$${summary.totalAssetsValue.toLocaleString()}`}
                  icon="💎"
                />
              </FadeInCard>
              <FadeInCard delay={3}>
                <SummaryCard
                  title="Total Officers"
                  value={mockUsers.length}
                  icon="👮"
                />
              </FadeInCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FadeInCard delay={4}>
                <TaskList tasks={tasks} onTaskClick={handleTaskClick} isDashboard={true} />
              </FadeInCard>
              <FadeInCard delay={5}>
                <ActivityFeed activities={auditLog} />
              </FadeInCard>
            </div>
          </div>
        </main>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] shadow-2xl overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-white">{selectedTask.name}</h3>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {selectedTask.description && (
                  <p className="text-gray-300">{selectedTask.description}</p>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span className="ml-2 text-white">{selectedTask.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Priority:</span>
                    <span className="ml-2 text-white">{selectedTask.priority}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Risk:</span>
                    <span className="ml-2 text-white">{selectedTask.risk}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Deadline:</span>
                    <span className="ml-2 text-white">
                      {new Date(selectedTask.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {selectedTask.assignedUsers && selectedTask.assignedUsers.length > 0 && (
                  <div>
                    <span className="text-gray-400">Assigned to:</span>
                    <div className="mt-1">
                      {selectedTask.assignedUsers.map(userId => {
                        const user = mockUsers.find(u => u.id === userId);
                        return (
                          <span key={userId} className="inline-block bg-gray-700 text-white px-2 py-1 rounded text-sm mr-2 mb-1">
                            {user?.name || userId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedTask.mediaUrls && selectedTask.mediaUrls.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-2">Media Files</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {selectedTask.mediaUrls.map((url, index) => (
                        <div key={index} className="bg-gray-700 rounded p-2 text-center">
                          <span className="text-gray-300 text-xs">File {index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTask.comments && selectedTask.comments.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-2">Comments ({selectedTask.comments.length})</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedTask.comments.map(comment => (
                        <div key={comment.id} className="bg-gray-700 rounded p-3">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-blue-400 font-medium text-sm">{comment.username}</span>
                            <span className="text-gray-500 text-xs">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}