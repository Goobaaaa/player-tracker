"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { mockGetSession } from "@/lib/mock-auth";
import { getTemplateById, hasTemplateAccess, initializeBlankTemplate, getTemplateDashboardSummary, getTemplateTasks, getTemplateAuditLog } from "@/lib/template-aware-data";
import { Task, DashboardSummary, Template } from "@/lib/database";
import { AuditLogEntry } from "@/components/activity-feed";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { SummaryCard } from "@/components/summary-card";
import { TaskList } from "@/components/task-list";
import { ActivityFeed } from "@/components/activity-feed";
import FadeInCard from "@/components/fade-in-card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Calendar, MessageSquare, Eye, FolderOpen, Shield } from "lucide-react";
import Image from "next/image";
import { useTemplate } from "@/contexts/template-context";

export default function TemplatePage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const [template, setTemplate] = useState<Template | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { setCurrentTemplate } = useTemplate();

  const loadDashboardData = useCallback(async () => {
    try {
      const templateId = params.templateId as string;

      // Load template-specific data
      const templateSummary = getTemplateDashboardSummary(templateId);
      const templateTasks = getTemplateTasks(templateId);
      const templateLog = getTemplateAuditLog(templateId);

      setSummary(templateSummary);
      setTasks(templateTasks);
      setAuditLog(templateLog);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  }, [params.templateId]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session, user }, error } = await mockGetSession();
      if (error || !session) {
        router.push("/login");
        return;
      }

      const templateId = params.templateId as string;
      if (!templateId) {
        router.push("/homepage");
        return;
      }

      // Check if user has access to this template
      const hasAccess = hasTemplateAccess(templateId, user.id);
      if (!hasAccess) {
        setAccessDenied(true);
        return;
      }

      // Load template data
      const templateData = getTemplateById(templateId);
      if (!templateData) {
        router.push("/homepage");
        return;
      }

      setTemplate(templateData);
      setCurrentTemplate(templateData); // Set template in context

      // Initialize blank template data if this is a new template
      initializeBlankTemplate(templateId);

      // Add template parameter to URL for persistence
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('template', templateId);
        window.history.replaceState({}, '', url.toString());
      }

      setIsAuthenticated(true);
      loadDashboardData();
    };
    checkAuth();
  }, [router, params.templateId, setCurrentTemplate, loadDashboardData]);

  useEffect(() => {
    const interval = setInterval(() => {
      const templateId = params.templateId as string;
      const templateLog = getTemplateAuditLog(templateId);
      setAuditLog(templateLog);
    }, 1000);
    return () => clearInterval(interval);
  }, [params.templateId]);

  const handleTaskClick = (task: Task) => {
    console.log("Task clicked:", task);
    setSelectedTask(task);
  };

  // handleBackToHomepage is now handled by the header component

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

  const getDeadlineDisplay = (deadline: string, taskStatus?: Task["status"]) => {
    if (taskStatus === "completed") {
      return { text: "Complete", color: "text-green-400" };
    }

    const daysUntil = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
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

  if (accessDenied) {
    router.push("/access-denied");
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Template not found</div>
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
            {/* Template Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  {template.logoUrl && (
                    <Image
                      src={template.logoUrl}
                      alt={template.name}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-white">{template.name}</h1>
                    {template.description && (
                      <p className="text-gray-400 text-sm">{template.description}</p>
                    )}
                  </div>
                  <Badge className="bg-green-600 text-white flex items-center space-x-1">
                    <Shield className="h-3 w-3" />
                    <span>Template</span>
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <FadeInCard delay={1}>
                <SummaryCard
                  title="Total Suspects"
                  value={summary?.totalPlayers || 0}
                  icon="👥"
                />
              </FadeInCard>
              <FadeInCard delay={2}>
                <SummaryCard
                  title="Total Assets Value"
                  value={`$${(summary?.totalAssetsValue || 0).toLocaleString()}`}
                  icon="💎"
                />
              </FadeInCard>
              <FadeInCard delay={3}>
                <SummaryCard
                  title="Total Officers"
                  value={5}
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
                  showFullLog={false}
                  onToggleFullLog={() => router.push("/audit-log")}
                />
              </FadeInCard>
            </div>
          </div>
        </main>
      </div>

      {/* Task Detail Modal - Reusing from dashboard */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-start pt-8 p-4 backdrop-blur-sm bg-black/50" onClick={() => setSelectedTask(null)}>
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[85vh] shadow-2xl overflow-y-auto mx-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
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

                <div className="flex-1 border-t border-gray-700 pt-6 min-h-0">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Comments ({selectedTask.comments.length})
                  </h4>

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
    </div>
  );
}