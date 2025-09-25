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
import Image from "next/image";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showFullAuditLog, setShowFullAuditLog] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<{url: string, name: string} | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
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

  const toggleDescription = (taskId: string) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedDescriptions(newExpanded);
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
        <div className="fixed inset-0 z-50 flex justify-start pt-8 p-4 backdrop-blur-sm bg-black/50" onClick={() => setSelectedTask(null)}>
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[85vh] shadow-2xl overflow-y-auto mx-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              {/* Header with tags */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {getStatusIcon(selectedTask.status)}
                    <h3 className="text-2xl font-bold text-white">{selectedTask.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
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
                  {/* Date and Status Info */}
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <FolderOpen className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Created:</span>
                      <span className="text-white">
                        {new Date(selectedTask.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Due:</span>
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

              <div className="flex flex-col h-full">
                {/* Description */}
                {selectedTask.description && (
                  <div className="mb-6">
                    <p className={`text-gray-300 ${expandedDescriptions.has(selectedTask.id) ? '' : 'line-clamp-2'}`}>
                      {selectedTask.description}
                    </p>
                    {selectedTask.description.length > 100 && (
                      <button
                        onClick={() => toggleDescription(selectedTask.id)}
                        className="text-blue-400 hover:text-blue-300 text-sm mt-1 transition-colors"
                      >
                        {expandedDescriptions.has(selectedTask.id) ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </div>
                )}

                {/* Assigned To */}
                <div className="text-sm mb-6">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Assigned to:</span>
                    <span className="text-white">{getAssignedUserNames(selectedTask.assignedUsers)}</span>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="flex-1 border-t border-gray-700 pt-6 min-h-0">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Comments ({selectedTask.comments.length})
                  </h4>

                  {/* Existing Comments */}
                  <div className="flex-1 space-y-3 overflow-y-auto pr-2">
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
                          {comment.mediaUrls && comment.mediaUrls.length > 0 && (
                            <div className="mt-2">
                              <div className="flex items-center text-gray-400 text-xs mb-2">
                                <span className="mr-2">📎</span>
                                {comment.mediaUrls.length} file(s) attached
                              </div>
                              <div className="grid grid-cols-4 gap-2">
                                {comment.mediaUrls.map((url, index) => {
                                  let displayUrl = url;
                                  let fileName = `File ${index + 1}`;

                                  // Handle named URLs (format: "name:url")
                                  const nameIndex = url.indexOf(':');
                                  if (nameIndex > 0) {
                                    const name = url.substring(0, nameIndex);
                                    const actualUrl = url.substring(nameIndex + 1);

                                    // If it's a data URL or external URL, use it
                                    if (actualUrl.startsWith('data:') || actualUrl.startsWith('http://') || actualUrl.startsWith('https://')) {
                                      displayUrl = actualUrl;
                                      fileName = name;
                                    }
                                  } else {
                                    fileName = url.split('/').pop() || `File ${index + 1}`;
                                  }

                                  const isImage = (displayUrl.startsWith('data:image') || (displayUrl.startsWith('http://') || displayUrl.startsWith('https://')) && /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(displayUrl)) && !displayUrl.startsWith('mock-file');
                                  const isVideo = displayUrl.startsWith('data:video/') || ((displayUrl.startsWith('http://') || displayUrl.startsWith('https://')) && /\.(mp4|avi|mov|webm)$/i.test(displayUrl));

                                  return (
                                    <div key={index} className="relative group">
                                      <div className="aspect-square bg-gray-600 rounded-lg overflow-hidden flex items-center justify-center hover:bg-gray-500 transition-colors cursor-pointer" onClick={() => isImage && setFullscreenImage({ url: displayUrl, name: fileName })}>
                                        {isImage ? (
                                          <>
                                            <Image
                                              src={displayUrl}
                                              alt={fileName}
                                              width={200}
                                              height={200}
                                              className="w-full h-full object-cover"
                                              unoptimized
                                            />
                                            {/* Eye icon overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                              <div className="bg-black bg-opacity-50 rounded-full p-2">
                                                <Eye className="w-4 h-4 text-white" />
                                              </div>
                                            </div>
                                          </>
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-600">
                                            <span className="text-2xl">
                                              {isVideo ? '🎥' :
                                               displayUrl.includes('pdf') ? '📄' : '📎'}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      <div className="mt-1 text-xs text-gray-300 text-center truncate">{fileName}</div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No comments yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 backdrop-blur-sm bg-black/80" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }} onClick={() => setFullscreenImage(null)}>
          <div className="relative mt-8">
            {/* Image container with background */}
            <div className="relative bg-gray-900 border-2 border-gray-700 rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <Image
                src={fullscreenImage.url}
                alt={fullscreenImage.name}
                width={1200}
                height={800}
                className="max-w-[90vw] max-h-[80vh] object-contain"
                unoptimized
                onError={(e) => {
                  // Fallback for failed image loads
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>

            {/* Image name overlay */}
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg">
              <p className="text-sm font-medium truncate max-w-md">{fullscreenImage.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}