"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { mockGetSession } from "@/lib/mock-auth";
import { getAllTasks, createTask, updateTask, deleteTask, mockUsers, updateTaskOverdueStatus, getDaysUntilDeadline, addTaskComment, toggleTaskCompleted, deleteTaskComment } from "@/lib/mock-data";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Clock, AlertCircle, Plus, Search, User, Calendar, X, Edit, Trash2, MessageSquare, Eye } from "lucide-react";
import { Task } from "@/lib/database";
import FadeInCard from "@/components/fade-in-card";
import Image from "next/image";

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
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [newComment, setNewComment] = useState<{[taskId: string]: string}>({});
  const [commentAttachments, setCommentAttachments] = useState<{[taskId: string]: File[]}>({});
  const [mediaFileNames, setMediaFileNames] = useState<{[taskId: string]: {[index: number]: string}}>({});
  const [imageAttachments, setImageAttachments] = useState<{[taskId: string]: Array<{url: string, name: string}>}>({});
  const [selectedImageUrl, setSelectedImageUrl] = React.useState('');
  const [showImageModal, setShowImageModal] = React.useState(false);
  const [fullscreenImage, setFullscreenImage] = React.useState<{url: string, name: string} | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  // Form state
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState<"high" | "medium" | "low">("medium");
  const [taskRisk, setTaskRisk] = useState<"dangerous" | "high" | "medium" | "low">("medium");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskMediaFiles, setTaskMediaFiles] = useState<File[]>([]);
  const [taskMediaUrls, setTaskMediaUrls] = useState<string[]>([]);
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

  const truncateDescription = (description: string, maxLength: number = 150) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength).trim() + "...";
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

  const toggleComments = (taskId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
      setShowCommentsTask(null);
    } else {
      newExpanded.add(taskId);
      setShowCommentsTask(taskId);
    }
    setExpandedComments(newExpanded);
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
    setTaskMediaUrls(task.mediaUrls || []);
    setTaskMediaFiles([]); // Reset files, they'll need to be re-selected
  };

  const handleToggleCompleted = (taskId: string) => {
    toggleTaskCompleted(taskId);
    loadTasks();
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
      loadTasks(); // Reload tasks from data store to reflect deletion
    }
  };

  const handleAddComment = async (taskId: string) => {
    const commentText = newComment[taskId]?.trim();

    if (commentText || (commentAttachments[taskId]?.length > 0) || (imageAttachments[taskId]?.[0]?.url.trim())) {
      const mediaUrls = [];

      // Process file attachments
      if (commentAttachments[taskId]?.length > 0) {
        const fileArray = commentAttachments[taskId];
        const fileNamesArray = mediaFileNames[taskId] || {};

        for (let index = 0; index < fileArray.length; index++) {
          const file = fileArray[index];
          const customName = fileNamesArray[index] || file.name;

          if (file.type.startsWith('image/')) {
            const dataUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.readAsDataURL(file);
            });
            mediaUrls.push(`${customName}:${dataUrl}`);
          } else {
            mediaUrls.push(`${customName}:mock-file-${Date.now()}-${file.name}`);
          }
        }
      }

      // Process URL attachments
      if (imageAttachments[taskId]?.[0]?.url.trim()) {
        imageAttachments[taskId].forEach(img => {
          if (img.url.trim()) {
            mediaUrls.push(img.name ? `${img.name}:${img.url}` : img.url);
          }
        });
      }

      const newCommentObj = addTaskComment(
        taskId,
        "current_user",
        "Current User",
        commentText || "",
        mediaUrls
      );

      if (newCommentObj) {
        loadTasks();
        setNewComment({ ...newComment, [taskId]: "" });
        setCommentAttachments({ ...commentAttachments, [taskId]: [] });
        setMediaFileNames({ ...mediaFileNames, [taskId]: {} });
        setImageAttachments({ ...imageAttachments, [taskId]: [{ url: "", name: "" }] });
      }
    }
  };

  const handleFileAttachment = (taskId: string, files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      const currentFiles = commentAttachments[taskId] || [];
      const startIndex = currentFiles.length;

      // Initialize file names for new files
      const newFileNames = { ...mediaFileNames[taskId] };
      newFiles.forEach((file, index) => {
        const fileIndex = startIndex + index;
        newFileNames[fileIndex] = file.name;
      });

      setCommentAttachments({
        ...commentAttachments,
        [taskId]: [...currentFiles, ...newFiles]
      });

      setMediaFileNames({
        ...mediaFileNames,
        [taskId]: newFileNames
      });
    }
  };

  const removeAttachment = (taskId: string, index: number) => {
    const newAttachments = [...(commentAttachments[taskId] || [])];
    newAttachments.splice(index, 1);

    // Clean up file names and reindex
    const newFileNames = { ...mediaFileNames[taskId] };
    delete newFileNames[index];

    // Reindex remaining file names
    const reindexedNames: {[index: number]: string} = {};
    Object.keys(newFileNames).sort().forEach(key => {
      const oldIndex = parseInt(key);
      const newIndex = oldIndex > index ? oldIndex - 1 : oldIndex;
      reindexedNames[newIndex] = newFileNames[oldIndex];
    });

    setCommentAttachments({ ...commentAttachments, [taskId]: newAttachments });
    setMediaFileNames({ ...mediaFileNames, [taskId]: reindexedNames });
  };

  const handleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleDeleteAttachment = (taskId: string, commentId: string, attachmentIndex: number) => {
    if (confirm('Are you sure you want to delete this attachment?')) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const comment = task.comments.find(c => c.id === commentId);
        if (comment && comment.mediaUrls) {
          comment.mediaUrls.splice(attachmentIndex, 1);
          updateTask(taskId, { comments: task.comments });
          loadTasks();
        }
      }
    }
  };

  const handleDeleteComment = (taskId: string, commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      // Use the data store function to delete the comment
      if (deleteTaskComment(taskId, commentId)) {
        // Reload tasks to get the updated state from the data store
        loadTasks();
      }
    }
  };

  
  const handleSubmitTask = () => {
    if (taskName.trim() && taskDeadline && selectedUsers.length > 0) {
      if (editingTask) {
        // Update existing task
        // Combine existing media URLs with new ones
        const allMediaUrls = [
          ...(editingTask.mediaUrls || []),
          ...taskMediaUrls.filter(url => !(editingTask.mediaUrls || []).includes(url))
        ];

        const success = updateTask(editingTask.id, {
          name: taskName.trim(),
          description: taskDescription.trim(),
          priority: taskPriority,
          risk: taskRisk,
          assignedUsers: selectedUsers,
          deadline: taskDeadline,
          mediaUrls: allMediaUrls.length > 0 ? allMediaUrls : undefined,
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
          "current_user", // In a real app, this would be the actual user ID
          taskMediaUrls.length > 0 ? taskMediaUrls : undefined
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
                  <Card className={`bg-gray-800 border-gray-700 transition-all-smooth hover:shadow-lg hover:border-blue-500 hover:scale-102 ${task.status === 'completed' ? 'bg-gray-900' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3 flex-1">
                        {getStatusIcon(task.status)}
                        <div className="flex-1">
                          <h3 className="font-medium text-white text-lg">{task.name}</h3>
                          <div className="mt-1">
                            <p className="text-gray-400 text-sm">
                              {expandedDescriptions.has(task.id) || task.description.length <= 150
                                ? task.description
                                : truncateDescription(task.description)}
                            </p>
                            {task.description.length > 150 && (
                              <button
                                onClick={() => toggleDescription(task.id)}
                                className="text-blue-400 hover:text-blue-300 text-xs mt-1 transition-colors"
                              >
                                {expandedDescriptions.has(task.id) ? "Show less" : "Show more"}
                              </button>
                            )}
                          </div>
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
                          onClick={() => handleToggleCompleted(task.id)}
                          className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                        >
                          {task.status === 'completed' ? <Clock className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleComments(task.id)}
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
                                  <button
                                    onClick={() => handleDeleteComment(task.id, comment.id)}
                                    className="text-red-400 hover:text-red-300 text-xs"
                                    title="Delete comment"
                                  >
                                    Delete
                                  </button>
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

                                        const handleViewFullImage = (url: string) => {
                                          setSelectedImageUrl(url);
                                          setShowImageModal(true);
                                        };

                                        return (
                                          <div key={index} className="relative group">
                                            <div className="aspect-square bg-gray-600 rounded-lg overflow-hidden flex items-center justify-center hover:bg-gray-500 transition-colors cursor-pointer" onClick={() => isImage ? setFullscreenImage({ url: displayUrl, name: fileName }) : handleViewFullImage(displayUrl)}>
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
                                                      <Eye className="w-6 h-6 text-white" />
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
                                            <button
                                              onClick={() => handleDeleteAttachment(task.id, comment.id, index)}
                                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                            >
                                              ×
                                            </button>
                                          </div>
                                        );
                                      })}
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
                        
                                                  {/* Unified Attachments Section */}
                                                  <div className="mt-3">
                                                    <div className="text-xs text-gray-400 mb-2">Add Attachments:</div>
                        
                                                    {/* File Upload */}
                                                    <div className="flex items-center space-x-2 mb-3">
                                                      <label
                                                        htmlFor={`file-${task.id}`}
                                                        className="cursor-pointer inline-flex items-center px-2 py-1 border border-gray-600 text-xs font-medium rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                      >
                                                        Upload File
                                                      </label>
                                                      <input
                                                        type="file"
                                                        id={`file-${task.id}`}
                                                        className="hidden"
                                                        multiple
                                                        onChange={(e) => handleFileAttachment(task.id, e.target.files)}
                                                      />
                                                      <span className="text-gray-500 text-xs">
                                                        {commentAttachments[task.id]?.length || 0} file(s) selected
                                                      </span>
                                                    </div>
                        
                                                    {/* URL Attachment */}
                                                    <div className="space-y-2 mb-3">
                                                      {(imageAttachments[task.id] || [{ url: "", name: "" }]).map((img, index) => (
                                                        <div key={index} className="flex gap-2 items-center">
                                                          <div className="flex-1">
                                                            <input
                                                              type="url"
                                                              value={img.url}
                                                              onChange={(e) => {
                                                                const currentImages = imageAttachments[task.id] || [{ url: "", name: "" }];
                                                                const newImages = [...currentImages];
                                                                newImages[index] = { ...newImages[index], url: e.target.value };
                                                                setImageAttachments({
                                                                  ...imageAttachments,
                                                                  [task.id]: newImages
                                                                });
                                                              }}
                                                              placeholder="https://example.com/image.jpg"
                                                              className="w-full p-1 bg-gray-600 border border-gray-500 text-white placeholder-gray-400 rounded text-xs"
                                                            />
                                                          </div>
                                                          <div className="flex-1 flex items-center gap-2">
                                                            <input
                                                              type="text"
                                                              value={img.name}
                                                              onChange={(e) => {
                                                                const currentImages = imageAttachments[task.id] || [{ url: "", name: "" }];
                                                                const newImages = [...currentImages];
                                                                newImages[index] = { ...newImages[index], name: e.target.value };
                                                                setImageAttachments({
                                                                  ...imageAttachments,
                                                                  [task.id]: newImages
                                                                });
                                                              }}
                                                              placeholder="Attachment name"
                                                              className="flex-1 p-1 bg-gray-600 border border-gray-500 text-white placeholder-gray-400 rounded text-xs"
                                                            />
                                                            {index === (imageAttachments[task.id]?.length || 1) - 1 && (
                                                              <button
                                                                onClick={() => {
                                                                  const currentImages = imageAttachments[task.id] || [{ url: "", name: "" }];
                                                                  setImageAttachments({
                                                                    ...imageAttachments,
                                                                    [task.id]: [...currentImages, { url: "", name: "" }]
                                                                  });
                                                                }}
                                                                className="w-6 h-6 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center text-xs font-bold"
                                                                title="Add another URL"
                                                              >
                                                                +
                                                              </button>
                                                            )}
                                                          </div>
                                                          {(imageAttachments[task.id]?.length || 1) > 1 && (
                                                            <button
                                                              onClick={() => {
                                                                const currentImages = imageAttachments[task.id] || [{ url: "", name: "" }];
                                                                const newImages = currentImages.filter((_, i) => i !== index);
                                                                setImageAttachments({
                                                                  ...imageAttachments,
                                                                  [task.id]: newImages.length > 0 ? newImages : [{ url: "", name: "" }]
                                                                });
                                                              }}
                                                              className="w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-xs"
                                                              title="Remove this URL"
                                                            >
                                                              ×
                                                            </button>
                                                          )}
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </div>
                        
                                                  <div className="flex justify-end items-center mt-2">
                                                    <Button
                                                      size="sm"
                                                      onClick={async () => await handleAddComment(task.id)}
                                                      disabled={!newComment[task.id]?.trim() && !commentAttachments[task.id]?.length && !(imageAttachments[task.id]?.[0]?.url.trim())}
                                                      className="bg-blue-600 hover:bg-blue-700 text-xs disabled:bg-gray-600"
                                                    >
                                                      Post Comment
                                                    </Button>
                                                  </div>                        </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/20">
          <div className="bg-gray-800 rounded-lg w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
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
                    setTaskMediaFiles([]);
                    setTaskMediaUrls([]);
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
                    type="datetime-local"
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
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

                {/* Media Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Media Attachments (Optional)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setTaskMediaFiles(files);

                        // Create mock URLs for preview
                        const urls = files.map(file => URL.createObjectURL(file));
                        setTaskMediaUrls(urls);
                      }}
                      className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-lg text-sm"
                    />
                    <p className="text-xs text-gray-400">
                      Supported: Images, Videos, PDFs, DOC/DOCX files
                    </p>

                    {/* Preview selected files */}
                    {taskMediaUrls.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {taskMediaUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            {taskMediaFiles[index] && taskMediaFiles[index].type.startsWith('image/') ? (
                              <Image
                                src={url}
                                alt={`Preview ${index + 1}`}
                                width={64}
                                height={64}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">
                                  {taskMediaFiles[index] && taskMediaFiles[index].type.startsWith('video/') ? '🎥' :
                                   taskMediaFiles[index] && taskMediaFiles[index].type.includes('pdf') ? '📄' : '📎'}
                                </span>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setTaskMediaFiles(prev => prev.filter((_, i) => i !== index));
                                setTaskMediaUrls(prev => prev.filter((_, i) => i !== index));
                              }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 backdrop-blur-sm bg-black/80" onClick={() => setFullscreenImage(null)}>
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