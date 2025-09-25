"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockGetSession } from "@/lib/mock-auth";
import { mockDashboardSummary, getAllTasks, updateTaskOverdueStatus, mockUsers, getCurrentAuditLog, initializeSampleData, updateDashboardSummary, addTaskComment, getDaysUntilDeadline } from "@/lib/mock-data";
import { Task, DashboardSummary } from "@/lib/database";
import { AuditLogEntry } from "@/components/activity-feed";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { SummaryCard } from "@/components/summary-card";
import { TaskList } from "@/components/task-list";
import { ActivityFeed } from "@/components/activity-feed";
import FadeInCard from "@/components/fade-in-card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, User, Calendar, MessageSquare, Eye, FolderOpen } from "lucide-react";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState("");
  const [taskMediaUrl, setTaskMediaUrl] = useState("");
  const [taskMediaName, setTaskMediaName] = useState("");
  const [showFullAuditLog, setShowFullAuditLog] = useState(false);
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
    setNewComment("");
  };

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "active": return <Clock className="h-4 w-4 text-blue-400" />;
      case "overdue": return <AlertCircle className="h-4 w-4 text-red-400" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-600";
      case "medium": return "bg-yellow-600";
      case "low": return "bg-green-600";
      default: return "bg-gray-600";
    }
  };

  const getRiskColor = (risk: Task["risk"]) => {
    switch (risk) {
      case "dangerous": return "bg-black";
      case "high": return "bg-red-600";
      case "medium": return "bg-orange-600";
      case "low": return "bg-green-600";
      default: return "bg-gray-600";
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed": return "bg-green-600";
      case "active": return "bg-blue-600";
      case "overdue": return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  const getAssignedUserNames = (userIds: string[]) => {
    return userIds.map(id => mockUsers.find(user => user.id === id)?.name || id).join(", ");
  };

  const getDeadlineDisplay = (deadline: string, taskStatus?: Task["status"]) => {
    // If task is completed, show "Complete"
    if (taskStatus === "completed") {
      return { text: "Complete", color: "text-green-400" };
    }

    const daysUntil = getDaysUntilDeadline(deadline);
    if (daysUntil < 0) {
      return { text: `${Math.abs(daysUntil)} days overdue`, color: "text-red-400" };
    } else if (daysUntil === 0) {
      return { text: "Due today", color: "text-yellow-400" };
    } else if (daysUntil === 1) {
      return { text: "Due tomorrow", color: "text-yellow-400" };
    } else {
      return { text: `${daysUntil} days remaining`, color: "text-green-400" };
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
                <ActivityFeed
                  activities={auditLog}
                  limit={5}
                  showFullLog={showFullAuditLog}
                  onToggleFullLog={() => setShowFullAuditLog(!showFullAuditLog)}
                />
              </FadeInCard>
            </div>
          </div>
        </main>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] shadow-2xl overflow-y-auto">
            <div className="p-6">
              {/* Header with tags */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {getStatusIcon(selectedTask.status)}
                    <h3 className="text-2xl font-bold text-white">{selectedTask.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={`${getStatusColor(selectedTask.status)} text-white`}>
                      {selectedTask.status}
                    </Badge>
                    <Badge className={`${getPriorityColor(selectedTask.priority)} text-white`}>
                      {selectedTask.priority} priority
                    </Badge>
                    <Badge className={`${getRiskColor(selectedTask.risk)} text-white`}>
                      {selectedTask.risk} risk
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setSelectedTask(null);
                      router.push("/tasks");
                    }}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Full Details</span>
                  </button>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="text-gray-400 hover:text-white text-xl"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Description */}
                {selectedTask.description && (
                  <p className="text-gray-300">{selectedTask.description}</p>
                )}

                {/* Task Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Assigned to:</span>
                    <span className="text-white">{getAssignedUserNames(selectedTask.assignedUsers)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Due Date:</span>
                    <span className="text-white">
                      {new Date(selectedTask.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Status:</span>
                    <span className={getDeadlineDisplay(selectedTask.deadline, selectedTask.status).color}>
                      {getDeadlineDisplay(selectedTask.deadline, selectedTask.status).text}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FolderOpen className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Created:</span>
                    <span className="text-white">
                      {new Date(selectedTask.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Media Files */}
                {selectedTask.mediaUrls && selectedTask.mediaUrls.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-3">Media Files</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {selectedTask.mediaUrls.map((url, index) => (
                        <div key={index} className="bg-gray-700 rounded-lg p-3 text-center hover:bg-gray-600 transition-colors">
                          <div className="text-2xl mb-1">
                            {url.includes('image') ? '🖼️' : url.includes('video') ? '🎥' : '📄'}
                          </div>
                          <span className="text-gray-300 text-xs">
                            {url.split('-').pop()?.substring(0, 15) || `File ${index + 1}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments Section */}
                <div className="border-t border-gray-700 pt-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Comments ({selectedTask.comments.length})
                  </h4>

                  {/* Existing Comments */}
                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                    {selectedTask.comments.length > 0 ? (
                      selectedTask.comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-700 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-blue-400 font-medium text-sm">{comment.username}</span>
                              <span className="text-gray-500 text-xs">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm">{comment.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No comments yet</p>
                    )}
                  </div>

                  {/* Add Comment Form */}
                  <div className="border-t border-gray-600 pt-4">
                    <textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full p-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg resize-none"
                      rows={3}
                    />

                    {/* Image URL Attachment */}
                    <div className="mt-3">
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={taskMediaUrl}
                        onChange={(e) => setTaskMediaUrl(e.target.value)}
                        className="w-full p-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Image name (optional)"
                        value={taskMediaName}
                        onChange={(e) => setTaskMediaName(e.target.value)}
                        className="w-full p-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg text-sm mt-2"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Add image URL with optional name
                      </p>
                    </div>

                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => {
                          if (newComment.trim() || taskMediaUrl.trim()) {
                            const mediaUrls = taskMediaUrl.trim()
                              ? [taskMediaName.trim() ? `${taskMediaName.trim()}:${taskMediaUrl.trim()}` : taskMediaUrl.trim()]
                              : [];

                            addTaskComment(
                              selectedTask.id,
                              "current_user",
                              "Current User",
                              newComment.trim(),
                              mediaUrls
                            );

                            loadDashboardData();
                            setNewComment("");
                            setTaskMediaUrl("");
                            setTaskMediaName("");
                          }
                        }}
                        disabled={!newComment.trim() && !taskMediaUrl.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:bg-gray-600"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}