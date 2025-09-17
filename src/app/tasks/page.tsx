"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { mockGetSession } from "@/lib/mock-auth";
import { mockTasks } from "@/lib/mock-data";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Clock, AlertCircle, Plus, Search } from "lucide-react";
import { Task } from "@/lib/database";
import FadeInCard from "@/components/fade-in-card";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
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
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  }, [searchQuery, statusFilter, priorityFilter, tasks]);

  const loadTasks = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setTasks(mockTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "done": return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "in-progress": return <Clock className="h-4 w-4 text-blue-400" />;
      case "todo": return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "done": return "bg-green-600";
      case "in-progress": return "bg-blue-600";
      case "todo": return "bg-yellow-600";
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

  const handleCreateTask = () => {
    // In a real app, this would open a modal or navigate to create page
    console.log("Create task");
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

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-48 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
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
                          <h3 className="font-medium text-white text-lg">{task.title}</h3>
                          {task.description && (
                            <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">{task.percentComplete}%</span>
                      </div>
                      <Progress value={task.percentComplete} className="h-2" />
                    </div>

                    <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
                      <span>
                        Created: {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                      {task.dueDate && (
                        <span className="text-yellow-400">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
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
    </div>
  );
}