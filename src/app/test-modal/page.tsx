"use client";

import { useState } from "react";
import { TaskComment } from "@/lib/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, CheckCircle, Clock, AlertCircle, User, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  risk: 'dangerous' | 'high' | 'medium' | 'low';
  assignedUsers: string[];
  deadline: string;
  createdBy: string;
  createdAt: string;
  status: 'active' | 'completed' | 'overdue';
  comments: TaskComment[];
}

export default function TestModalPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const mockTask: Task = {
    id: "test-1",
    name: "Test Task Modal",
    description: "This is a test task to verify modal positioning and functionality.",
    priority: "high",
    risk: "medium",
    assignedUsers: ["user-1", "user-2"],
    deadline: "2024-12-31",
    createdBy: "admin",
    createdAt: "2024-01-01",
    status: "active",
    comments: []
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

  const handleTaskClick = (task: Task) => {
    console.log("Task clicked:", task);
    setSelectedTask(task);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-white">Modal Position Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            Click the button below to test the modal positioning fix from AddOn9.md.
          </p>
          <Button
            onClick={() => handleTaskClick(mockTask)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Open Task Modal
          </Button>
        </CardContent>
      </Card>

      {/* Task Detail Modal - Updated with responsive positioning */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] shadow-2xl overflow-y-auto">
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
                      <span>Assigned: {selectedTask.assignedUsers.join(", ")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Deadline: {new Date(selectedTask.deadline).toLocaleDateString()}</span>
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

              <div className="border-t border-gray-700 pt-6">
                <h4 className="text-lg font-semibold text-white mb-4">Modal Positioning Test</h4>
                <p className="text-gray-300">
                  This modal uses the updated positioning from AddOn9.md:
                </p>
                <ul className="text-gray-300 list-disc list-inside mt-2">
                  <li>Fixed: inset-0 (full viewport)</li>
                  <li>Centered: items-center justify-center</li>
                  <li>Padding: p-4 for mobile responsiveness</li>
                  <li>Max height: max-h-[90vh] for better viewport usage</li>
                </ul>
                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-400">
                    Previous positioning: fixed inset-x-0 top-0 z-50 flex justify-center pt-8
                  </p>
                  <p className="text-sm text-green-400 mt-2">
                    ✅ Updated positioning: fixed inset-0 z-50 flex items-center justify-center p-4
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}