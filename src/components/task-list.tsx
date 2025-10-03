import { Task, StaffMember } from "@/lib/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertCircle, User, Calendar } from "lucide-react";
import { getDaysUntilDeadline, toggleTaskCompleted } from "@/lib/mock-data";

interface TaskListProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  isDashboard?: boolean;
  users?: StaffMember[];
}

export function TaskList({ tasks, onTaskClick, isDashboard = false, users = [] }: TaskListProps) {
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

  const getAssignedUserNames = (userIds: string[]) => {
    return userIds.map(id => users.find(user => user.id === id)?.name || id).join(", ");
  };

  const handleToggleCompleted = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTaskCompleted(taskId);
    // Refresh the task list
    if (onTaskClick) {
      const updatedTasks = tasks.map(task => task.id === taskId ? { ...task, status: (task.status === 'completed' ? 'active' : 'completed') as Task["status"] } : task);
      const clickedTask = updatedTasks.find(t => t.id === taskId);
      if (clickedTask) {
        onTaskClick(clickedTask);
      }
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <CheckCircle className="mr-2 h-5 w-5" />
          {isDashboard ? 'Active Tasks' : 'All Tasks'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-400">No tasks yet</p>
              <p className="text-gray-500 text-sm">Create your first task to get started</p>
            </div>
          ) : (
            tasks
              .sort((a, b) => {
                if (a.status === 'completed' && b.status !== 'completed') return 1;
                if (a.status !== 'completed' && b.status === 'completed') return -1;
                return 0;
              })
              .filter(task => isDashboard ? task.status !== 'completed' : true) // Hide completed tasks on dashboard
              .slice(0, isDashboard ? 5 : undefined) // Limit to 5 on dashboard
              .map((task) => (
              <div
                key={task.id}
                className={`p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer ${task.status === 'completed' ? 'opacity-50' : ''}`}
                onClick={() => onTaskClick?.(task)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    {getStatusIcon(task.status)}
                    <h3 className="font-medium text-white text-sm truncate">{task.name}</h3>
                  </div>
                  <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                    <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                      {task.priority}
                    </Badge>
                    <Badge className={`${getRiskColor(task.risk)} text-xs`}>
                      {task.risk}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-green-400 hover:text-green-300 hover:bg-green-900/20"
                      onClick={(e) => handleToggleCompleted(task.id, e)}
                      title={task.status === 'completed' ? 'Mark as active' : 'Mark as complete'}
                    >
                      {task.status === 'completed' ? <Clock className="h-4 w-4" /> : null}
                    </Button>
                  </div>
                </div>

                {task.description && (
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">{task.description}</p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{getAssignedUserNames(task.assignedUsers)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span className={getDeadlineDisplay(task.deadline).color}>
                      {getDeadlineDisplay(task.deadline).text}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}