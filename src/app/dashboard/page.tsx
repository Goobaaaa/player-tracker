"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockGetSession } from "@/lib/mock-auth";
import { mockDashboardSummary, getAllTasks, updateTask, updateTaskOverdueStatus, mockUsers, getDaysUntilDeadline, getCurrentAuditLog, addTaskComment, updateDashboardSummary, initializeSampleData } from "@/lib/mock-data";
import { Task, DashboardSummary } from "@/lib/database";
import { AuditLogEntry } from "@/components/activity-feed";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { SummaryCard } from "@/components/summary-card";
import { TaskList } from "@/components/task-list";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, User, Calendar, X, MessageSquare, Upload, Eye, Image as ImageIcon, FileText } from "lucide-react";
import Image from "next/image";
import { ActivityFeed } from "@/components/activity-feed";
import FadeInCard from "@/components/fade-in-card";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState("");
  const [taskMediaUrl, setTaskMediaUrl] = useState("");
  const [taskMediaName, setTaskMediaName] = useState("");
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
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
      const currentLog = getCurrentAuditLog();
      setAuditLog(currentLog);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      updateTaskOverdueStatus(); // Update overdue status
      initializeSampleData(); // Initialize sample data if none exists
      updateDashboardSummary(); // Update dashboard summary with fresh calculations
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
    setSelectedTask(task);
    setNewComment("");
  };

  const handleAddComment = () => {
    if (newComment.trim() && selectedTask) {
      // Use the addTaskComment function which creates audit log entry
      const newCommentObj = addTaskComment(
        selectedTask.id,
        "current_user",
        "Current User",
        newComment.trim()
      );

      if (newCommentObj) {
        // Reload tasks to get the updated comments from the data store
        loadDashboardData();

        // Update the selected task
        const updatedTasks = getAllTasks();
        const updatedTask = updatedTasks.find(task => task.id === selectedTask.id);
        if (updatedTask) {
          setSelectedTask(updatedTask);
        }

        setNewComment("");
      }
    }
  };

  const handleAddTaskMedia = () => {
    if (taskMediaUrl.trim() && selectedTask) {
      // Add media URL to the task
      const updatedTask = {
        ...selectedTask,
        mediaUrls: [...(selectedTask.mediaUrls || []), taskMediaUrl.trim()]
      };

      const success = updateTask(selectedTask.id, updatedTask);
      if (success) {
        loadDashboardData();
        const updatedTasks = getAllTasks();
        const taskWithMedia = updatedTasks.find(task => task.id === selectedTask.id);
        if (taskWithMedia) {
          setSelectedTask(taskWithMedia);
        }
        setTaskMediaUrl("");
        setTaskMediaName("");
      }
    }
  };

  const handleViewFullImage = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setShowImageModal(true);
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
        <div className="fixed inset-x-0 top-0 z-50 flex justify-center pt-8 backdrop-blur-sm bg-black/50 h-full">
          <div className="bg-gray-800 rounded-lg max-w-2xl shadow-2xl mx-auto mt-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
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

              {/* Task Media Section */}
              {(selectedTask.mediaUrls && selectedTask.mediaUrls.length > 0) && (
                <div className="border-t border-gray-700 pt-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <ImageIcon className="mr-2 h-5 w-5" />
                    Task Media ({selectedTask.mediaUrls.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedTask.mediaUrls.map((url, index) => {
                      const isImage = url.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i);
                      return (
                        <div key={index} className="relative group cursor-pointer">
                          <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                            {isImage ? (
                              <>
                                <Image
                                  src={url}
                                  alt={`Task media ${index + 1}`}
                                  width={200}
                                  height={200}
                                  className="w-full h-full object-cover cursor-pointer"
                                  onClick={() => handleViewFullImage(url)}
                                  onError={(e) => {
                                    const container = e.currentTarget.parentElement;
                                    if (container) {
                                      container.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-600"><svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                                    }
                                  }}
                                />
                                <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => handleViewFullImage(url)}>
                                  <Eye className="h-8 w-8 text-white" />
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FileText className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="mt-2">
                            <p className="text-xs text-gray-400 truncate">Media {index + 1}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add Task Media Section */}
              <div className="border-t border-gray-700 pt-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Upload className="mr-2 h-5 w-5" />
                  Add Media to Task
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Media URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={taskMediaUrl}
                      onChange={(e) => setTaskMediaUrl(e.target.value)}
                      className="w-full p-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Supported: Images (JPG, PNG, GIF, WEBP), Videos (MP4, MOV), PDFs, and direct links
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Display Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Enter a name for this media"
                      value={taskMediaName}
                      onChange={(e) => setTaskMediaName(e.target.value)}
                      className="w-full p-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleAddTaskMedia}
                      disabled={!taskMediaUrl.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Add Media
                    </Button>
                  </div>
                </div>
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
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                              {comment.mediaUrls.map((url, index) => {
                                const isImage = url.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i);
                                return (
                                  <div
                                    key={index}
                                    className="relative group cursor-pointer"
                                    onClick={() => {
                                      if (isImage) {
                                        handleViewFullImage(url);
                                      } else {
                                        window.open(url, '_blank');
                                      }
                                    }}
                                  >
                                    <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                                      {isImage ? (
                                        <>
                                          <Image
                                            src={url}
                                            alt={`Comment media ${index + 1}`}
                                            width={100}
                                            height={100}
                                            className="w-full h-full object-cover cursor-pointer"
                                            onError={(e) => {
                                              const container = e.currentTarget.parentElement;
                                              if (container) {
                                                container.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-600"><svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                                              }
                                            }}
                                          />
                                          <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <Eye className="h-6 w-6 text-white" />
                                          </div>
                                        </>
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <FileText className="h-6 w-6 text-gray-400" />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
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
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Add Media URL (optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      className="w-full p-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg text-sm"
                      id={`media-url-${selectedTask?.id}`}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Supported: Images (JPG, PNG, GIF), Videos (MP4, MOV), PDFs, and direct links
                    </p>
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button
                      onClick={() => {
                        const mediaInput = document.getElementById(`media-url-${selectedTask?.id}`) as HTMLInputElement;
                        const mediaUrl = mediaInput?.value.trim();

                        if (newComment.trim() || mediaUrl) {
                          // Add comment with media URL if provided
                          if (mediaUrl) {
                            // For demo purposes, we'll just add the URL as a media attachment
                            // In a real app, you'd validate and possibly upload the media
                            const commentWithMedia = addTaskComment(
                              selectedTask!.id,
                              "current_user",
                              "Current User",
                              newComment.trim() || "Added media attachment",
                              [mediaUrl]
                            );

                            if (commentWithMedia) {
                              loadDashboardData();
                              const updatedTasks = getAllTasks();
                              const updatedTask = updatedTasks.find(task => task.id === selectedTask!.id);
                              if (updatedTask) {
                                setSelectedTask(updatedTask);
                              }
                              setNewComment("");
                              if (mediaInput) mediaInput.value = "";
                            }
                          } else {
                            handleAddComment();
                          }
                        }
                      }}
                      disabled={!newComment.trim() && !(document.getElementById(`media-url-${selectedTask?.id}`) as HTMLInputElement)?.value.trim()}
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

      {/* Full Size Image View Modal */}
      {showImageModal && selectedImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20" onClick={() => setShowImageModal(false)}>
          <div className="relative max-w-6xl max-h-[90vh] w-full m-4" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 z-10 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="bg-gray-800 rounded-lg p-4 max-h-[85vh] overflow-auto">
              <div className="mt-4 text-center">
                <Image
                  src={selectedImageUrl}
                  alt="Full size image"
                  width={800}
                  height={600}
                  className="max-w-full h-auto rounded-lg"
                  onError={(e) => {
                    const container = e.currentTarget.parentElement;
                    if (container) {
                      container.innerHTML = '<div class="w-full h-64 flex items-center justify-center bg-gray-700 rounded-lg"><div class="text-center"><svg class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><p class="text-gray-400">Failed to load image</p></div></div>';
                    }
                  }}
                />
                <div className="mt-4">
                  <a
                    href={selectedImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Open in new tab
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}