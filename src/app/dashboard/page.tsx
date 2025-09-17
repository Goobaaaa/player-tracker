"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockGetSession } from "@/lib/mock-auth";
import { mockDashboardSummary, getAllTasks, updateTaskOverdueStatus, mockUsers, getDaysUntilDeadline, mockAuditLog } from "@/lib/mock-data";
import { Task, DashboardSummary } from "@/lib/database";
import { AuditLogEntry } from "@/components/activity-feed";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { SummaryCard } from "@/components/summary-card";
import { TaskList } from "@/components/task-list";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, User, Calendar, X, MessageSquare } from "lucide-react";
import { ActivityFeed } from "@/components/activity-feed";
import FadeInCard from "@/components/fade-in-card";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState("");
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

  // Update audit log every second to show new entries
  useEffect(() => {
    const interval = setInterval(() => {
      if (mockAuditLog.length > 0) {
        setAuditLog([...mockAuditLog]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      updateTaskOverdueStatus(); // Update overdue status
      setSummary(mockDashboardSummary);
      setTasks(getAllTasks());
      setAuditLog(mockAuditLog);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setNewComment("");
  };

  const handleAddComment = () => {
    if (newComment.trim() && selectedTask) {
      const newCommentObj = {
        id: Date.now().toString(),
        taskId: selectedTask.id,
        userId: "current_user",
        username: "Current User",
        text: newComment.trim(),
        createdAt: new Date().toISOString(),
      };

      setTasks(tasks.map(task =>
        task.id === selectedTask.id
          ? { ...task, comments: [...task.comments, newCommentObj] }
          : task
      ));

      // Update the selected task with the new comment
      setSelectedTask({
        ...selectedTask,
        comments: [...selectedTask.comments, newCommentObj]
      });

      setNewComment("");
    }
  };

  const getAssignedUserNames = (userIds: string[]) => {
    return userIds.map(id => mockUsers.find(user => user.id === id)?.name || id).join(", ");
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

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "active": return <Clock className="h-4 w-4 text-blue-400" />;
      case "overdue": return <AlertCircle className="h-4 w-4 text-red-400" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getDeadlineDisplay = (deadline: string) => {
    const daysUntil = getDaysUntilDeadline(deadline);
    if (daysUntil < 0) {
      return { text: `${Math.abs(daysUntil)}d overdue`, color: "text-red-400" };
    } else if (daysUntil === 0) {
      return { text: "Due today", color: "text-yellow-400" };
    } else if (daysUntil === 1) {
      return { text: "Due tomorrow", color: "text-yellow-400" };
    } else {
      return { text: `${daysUntil}d left`, color: "text-green-400" };
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
                <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
          <div className="bg-gray-800 rounded-lg w-full max-w-4xl m-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {getStatusIcon(selectedTask.status)}
                    <h3 className="text-2xl font-bold text-white">{selectedTask.name}</h3>
                    <div className="flex space-x-2">
                      <Badge className={`${getPriorityColor(selectedTask.priority)} text-white`}>
                        {selectedTask.priority} priority
                      </Badge>
                      <Badge className={`${getRiskColor(selectedTask.risk)} text-white`}>
                        {selectedTask.risk} risk
                      </Badge>
                      <Badge className="bg-blue-600 text-white">
                        {selectedTask.status}
                      </Badge>
                    </div>
                  </div>
                  {selectedTask.description && (
                    <p className="text-gray-300 mb-4">{selectedTask.description}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{getAssignedUserNames(selectedTask.assignedUsers)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Deadline: {new Date(selectedTask.deadline).toLocaleDateString()}</span>
                      <span className={getDeadlineDisplay(selectedTask.deadline).color}>
                        ({getDeadlineDisplay(selectedTask.deadline).text})
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedTask(null)}
                  className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Comments Section */}
              <div className="border-t border-gray-700 pt-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Comments ({selectedTask.comments.length})
                </h4>

                {/* Comment List */}
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {selectedTask.comments.length > 0 ? (
                    selectedTask.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-400 font-medium">{comment.username}</span>
                            <span className="text-gray-500 text-xs">
                              {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">{comment.text}</p>
                        {comment.mediaUrls && comment.mediaUrls.length > 0 && (
                          <div className="mt-2">
                            <div className="flex items-center text-gray-400 text-xs mb-2">
                              <span className="mr-2">📎</span>
                              {comment.mediaUrls.length} file(s) attached
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {comment.mediaUrls.map((url, index) => (
                                <div
                                  key={index}
                                  className="bg-gray-600 rounded p-2 text-xs text-gray-300 cursor-pointer hover:bg-gray-500 transition-colors"
                                  onClick={() => alert(`Viewing: ${url.split('-').pop()?.substring(0, 20) || 'File'}${index + 1}`)}
                                >
                                  {url.includes('image') ? '🖼️ Image' :
                                   url.includes('video') ? '🎥 Video' :
                                   url.includes('pdf') ? '📄 PDF' : '📎 File'} {index + 1}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                  )}
                </div>

                {/* Add Comment Form */}
                <div className="border-t border-gray-600 pt-4">
                  <h5 className="text-white font-medium mb-3">Add Comment</h5>
                  <textarea
                    placeholder="Write your comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-3">
                    <Button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
                    >
                      Post Comment
                    </Button>
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