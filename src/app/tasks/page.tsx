"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { mockGetSession } from "@/lib/mock-auth";
import { getAllTasks, createTask, updateTask, deleteTask, mockUsers, updateTaskOverdueStatus, getDaysUntilDeadline, addTaskComment } from "@/lib/mock-data";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Clock, AlertCircle, Plus, Search, User, Calendar, X, Edit, Trash2, MessageSquare } from "lucide-react";
import { Task } from "@/lib/database";
import FadeInCard from "@/components/fade-in-card";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCommentsTask, setShowCommentsTask] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<{[taskId: string]: string}>({});
  const [commentAttachments, setCommentAttachments] = useState<{[taskId: string]: File[]}>({});
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  // Form state
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState<"high" | "medium" | "low">("medium");
  const [taskRisk, setTaskRisk] = useState<"dangerous" | "high" | "medium" | "low">("medium");
  const [taskDeadline, setTaskDeadline] = useState("");
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    const { data: { session }, error } = await mockGetSession();
    if (error || !session) {
      router.push("/login");
      return;
    }

    loadTasks();
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    let filtered = tasks;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by risk
    if (riskFilter !== "all") {
      filtered = filtered.filter(task => task.risk === riskFilter);
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  }, [searchQuery, riskFilter, priorityFilter, tasks]);

  const loadTasks = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      updateTaskOverdueStatus(); // Update overdue status
      setTasks(getAllTasks());
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
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

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed": return "bg-green-600";
      case "active": return "bg-blue-600";
      case "overdue": return "bg-red-600";
      default: return "bg-gray-600";
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

  const getDeadlineDisplay = (deadline: string) => {
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

  const handleCreateTask = () => {
    setShowCreateModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskName(task.name);
    setTaskDescription(task.description);
    setTaskPriority(task.priority);
    setTaskRisk(task.risk);
    setTaskDeadline(task.deadline.split('T')[0]);
    setSelectedUsers(task.assignedUsers);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
      loadTasks(); // Reload tasks from data store to reflect deletion
    }
  };

  const handleAddComment = (taskId: string) => {
    const commentText = newComment[taskId]?.trim();
    if (commentText || (commentAttachments[taskId]?.length > 0)) {
      // Create mock media URLs for attachments
      const mediaUrls = commentAttachments[taskId]?.map((file, index) =>
        `mock-media-url-${Date.now()}-${index}-${file.name}`
      ) || [];

      // Use the addTaskComment function which creates audit log entry
      const newCommentObj = addTaskComment(
        taskId,
        "current_user",
        "Current User",
        commentText || "",
        mediaUrls
      );

      if (newCommentObj) {
        // Reload tasks to get the updated comments from the data store
        loadTasks();

        // Clear the comment input and attachments
        setNewComment({ ...newComment, [taskId]: "" });
        setCommentAttachments({ ...commentAttachments, [taskId]: [] });
      }
    }
  };

  const handleFileAttachment = (taskId: string, files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setCommentAttachments({
        ...commentAttachments,
        [taskId]: [...(commentAttachments[taskId] || []), ...newFiles]
      });
    }
  };

  const removeAttachment = (taskId: string, index: number) => {
    const newAttachments = [...(commentAttachments[taskId] || [])];
    newAttachments.splice(index, 1);
    setCommentAttachments({ ...commentAttachments, [taskId]: newAttachments });
  };

  const handleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSubmitTask = () => {
    if (taskName.trim() && taskDeadline && selectedUsers.length > 0) {
      if (editingTask) {
        // Update existing task
        const success = updateTask(editingTask.id, {
          name: taskName.trim(),
          description: taskDescription.trim(),
          priority: taskPriority,
          risk: taskRisk,
          assignedUsers: selectedUsers,
          deadline: taskDeadline,
        });

        if (success) {
          setEditingTask(null);
          alert("Task updated successfully!");
        } else {
          alert("Failed to update task.");
        }
      } else {
        // Create new task
        const newTask = createTask(
          taskName.trim(),
          taskDescription.trim(),
          taskPriority,
          taskRisk,
          selectedUsers,
          taskDeadline,
          "current_user" // In a real app, this would be the actual user ID
        );

        if (newTask) {
          alert("Task created successfully!");
        }
      }

      loadTasks(); // Reload tasks from data store
      setShowCreateModal(false);
      // Reset form
      setTaskName("");
      setTaskDescription("");
      setTaskPriority("medium");
      setTaskRisk("medium");
      setTaskDeadline("");
      setSelectedUsers([]);
    } else {
      alert("Please fill in all required fields and assign at least one user.");
    }
  };

  const getAssignedUserNames = (userIds: string[]) => {
    return userIds.map(id => mockUsers.find(user => user.id === id)?.name || id).join(", ");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">Tasks</h1>
              <Button onClick={handleCreateTask} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-full md:w-48 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Filter by risk" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="all" className="text-white hover:bg-gray-700">All Risk Levels</SelectItem>
                  <SelectItem value="dangerous" className="text-white hover:bg-gray-700">Dangerous</SelectItem>
                  <SelectItem value="high" className="text-white hover:bg-gray-700">High Risk</SelectItem>
                  <SelectItem value="medium" className="text-white hover:bg-gray-700">Medium Risk</SelectItem>
                  <SelectItem value="low" className="text-white hover:bg-gray-700">Low Risk</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-48 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="all" className="text-white hover:bg-gray-700">All Priority</SelectItem>
                  <SelectItem value="high" className="text-white hover:bg-gray-700">High</SelectItem>
                  <SelectItem value="medium" className="text-white hover:bg-gray-700">Medium</SelectItem>
                  <SelectItem value="low" className="text-white hover:bg-gray-700">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {filteredTasks.map((task, index) => (
                <FadeInCard key={task.id} delay={index + 1}>
                  <Card className="bg-gray-800 border-gray-700 transition-all-smooth hover:shadow-lg hover:border-blue-500 hover:scale-102">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3 flex-1">
                        {getStatusIcon(task.status)}
                        <div className="flex-1">
                          <h3 className="font-medium text-white text-lg">{task.name}</h3>
                          <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <User className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-400">
                              {getAssignedUserNames(task.assignedUsers)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority} priority
                        </Badge>
                        <Badge className={getRiskColor(task.risk)}>
                          {task.risk} risk
                        </Badge>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400">
                          Deadline: {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={getDeadlineDisplay(task.deadline).color}>
                        {getDeadlineDisplay(task.deadline).text}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="text-xs text-gray-500">
                        <span>
                          Created: {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                        <span className="ml-4">
                          {task.comments.length} comments
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowCommentsTask(showCommentsTask === task.id ? null : task.id)}
                          className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTask(task)}
                          className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                          className="bg-red-700 border-red-600 text-red-300 hover:bg-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                  {/* Media Attachments */}
                  {task.comments.some(comment => comment.mediaUrls && comment.mediaUrls.length > 0) && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="flex items-center text-gray-400 text-xs mb-2">
                        <span className="mr-2">📎</span>
                        {task.comments.reduce((total, comment) => total + (comment.mediaUrls?.length || 0), 0)} file(s) attached
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {task.comments
                          .filter(comment => comment.mediaUrls && comment.mediaUrls.length > 0)
                          .flatMap(comment => comment.mediaUrls || [])
                          .slice(0, 8)
                          .map((url, index) => (
                            <div
                              key={index}
                              className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-500 transition-colors"
                              onClick={() => alert(`Media file: ${url.split('-').pop()?.substring(0, 20) || 'File'}${index + 1}`)}
                            >
                              <span className="text-gray-400 text-xs">
                                {url.includes('image') ? '🖼️' :
                                 url.includes('video') ? '🎥' :
                                 url.includes('pdf') ? '📄' : '📎'}
                              </span>
                            </div>
                          ))}
                        {task.comments.reduce((total, comment) => total + (comment.mediaUrls?.length || 0), 0) > 8 && (
                          <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-xs">
                              +{task.comments.reduce((total, comment) => total + (comment.mediaUrls?.length || 0), 0) - 8}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  </CardContent>

                  {/* Comments Section */}
                  {showCommentsTask === task.id && (
                    <div className="px-6 pb-6 border-t border-gray-700">
                      <div className="mt-4">
                        <h4 className="text-white font-medium mb-3">Comments ({task.comments.length})</h4>

                        {/* Comment List */}
                        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                          {task.comments.length > 0 ? (
                            task.comments.map((comment) => (
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
                                    <div className="flex items-center text-gray-400 text-xs mb-1">
                                      <span className="mr-2">📎</span>
                                      {comment.mediaUrls.length} file(s) attached
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {comment.mediaUrls.map((url, index) => (
                                        <div key={index} className="bg-gray-600 rounded px-2 py-1 text-xs text-gray-300">
                                          {url.split('-').pop()?.substring(0, 15) || `File ${index + 1}`}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No comments yet</p>
                          )}
                        </div>

                        {/* Add Comment Form */}
                        <div className="border-t border-gray-600 pt-3">
                          <textarea
                            placeholder="Add a comment..."
                            value={newComment[task.id] || ""}
                            onChange={(e) => setNewComment({ ...newComment, [task.id]: e.target.value })}
                            className="w-full p-2 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded-lg resize-none text-sm"
                            rows={2}
                          />

                          {/* File Attachments */}
                          {(commentAttachments[task.id]?.length > 0) && (
                            <div className="mt-2 space-y-1">
                              {commentAttachments[task.id].map((file, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-700 rounded p-2 text-xs">
                                  <span className="text-gray-300 truncate flex-1">{file.name}</span>
                                  <button
                                    onClick={() => removeAttachment(task.id, index)}
                                    className="text-red-400 hover:text-red-300 ml-2"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="file"
                                id={`file-${task.id}`}
                                className="hidden"
                                multiple
                                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                                onChange={(e) => handleFileAttachment(task.id, e.target.files)}
                              />
                              <label
                                htmlFor={`file-${task.id}`}
                                className="cursor-pointer inline-flex items-center px-2 py-1 border border-gray-600 text-xs font-medium rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Attach Media
                              </label>
                              <span className="text-gray-500 text-xs">
                                {commentAttachments[task.id]?.length || 0} file(s)
                              </span>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleAddComment(task.id)}
                              disabled={!newComment[task.id]?.trim() && !commentAttachments[task.id]?.length}
                              className="bg-blue-600 hover:bg-blue-700 text-xs disabled:bg-gray-600"
                            >
                              Post Comment
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
                </FadeInCard>
              ))}
            </div>

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-400 text-lg">No tasks found</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Task Creation/Edit Modal */}
      {(showCreateModal || editingTask) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div className="bg-gray-800 rounded-lg w-full max-w-2xl m-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingTask(null);
                    // Reset form
                    setTaskName("");
                    setTaskDescription("");
                    setTaskPriority("medium");
                    setTaskRisk("medium");
                    setTaskDeadline("");
                    setSelectedUsers([]);
                  }}
                  className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Task Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Task Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter task name"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                {/* Task Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Task Description
                  </label>
                  <textarea
                    placeholder="Enter task description"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    rows={3}
                    className="w-full p-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg resize-none"
                  />
                </div>

                {/* Priority and Risk */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Priority *
                    </label>
                    <Select value={taskPriority} onValueChange={(value: "high" | "medium" | "low") => setTaskPriority(value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="high" className="text-white hover:bg-gray-700">High Priority (Red)</SelectItem>
                        <SelectItem value="medium" className="text-white hover:bg-gray-700">Medium Priority (Orange)</SelectItem>
                        <SelectItem value="low" className="text-white hover:bg-gray-700">Low Priority (Green)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Risk Level *
                    </label>
                    <Select value={taskRisk} onValueChange={(value: "dangerous" | "high" | "medium" | "low") => setTaskRisk(value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="dangerous" className="text-white hover:bg-gray-700">Dangerous (Black)</SelectItem>
                        <SelectItem value="high" className="text-white hover:bg-gray-700">High Risk (Red)</SelectItem>
                        <SelectItem value="medium" className="text-white hover:bg-gray-700">Medium Risk (Orange)</SelectItem>
                        <SelectItem value="low" className="text-white hover:bg-gray-700">Low Risk (Green)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Deadline *
                  </label>
                  <Input
                    type="date"
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                {/* Assigned Users */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Assigned Staff * (Select at least one)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {mockUsers.map((user) => (
                      <label
                        key={user.id}
                        className="flex items-center space-x-2 p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleUserSelection(user.id)}
                          className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
                        />
                        <span className="text-white">{user.name}</span>
                        <span className="text-gray-400 text-xs">({user.username})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingTask(null);
                      // Reset form
                      setTaskName("");
                      setTaskDescription("");
                      setTaskPriority("medium");
                      setTaskRisk("medium");
                      setTaskDeadline("");
                      setSelectedUsers([]);
                    }}
                    variant="outline"
                    className="flex-1 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitTask}
                    disabled={!taskName.trim() || !taskDeadline || selectedUsers.length === 0}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}