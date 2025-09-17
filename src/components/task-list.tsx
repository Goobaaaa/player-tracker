import { Task } from "@/lib/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, User, Calendar } from "lucide-react";
import { mockUsers, getDaysUntilDeadline } from "@/lib/mock-data";

interface TaskListProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export function TaskList({ tasks, onTaskClick }: TaskListProps) {
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
    return userIds.map(id => mockUsers.find(user => user.id === id)?.name || id).join(", ");
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <CheckCircle className="mr-2 h-5 w-5" />
          Recent Tasks
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
            tasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => onTaskClick?.(task)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2 flex-1">
                    {getStatusIcon(task.status)}
                    <h3 className="font-medium text-white text-sm">{task.name}</h3>
                  </div>
                  <div className="flex space-x-1">
                    <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                      {task.priority}
                    </Badge>
                    <Badge className={`${getRiskColor(task.risk)} text-xs`}>
                      {task.risk}
                    </Badge>
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

                {/* Media Attachments */}
                {task.comments.some(comment => comment.mediaUrls && comment.mediaUrls.length > 0) && (
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <div className="flex items-center space-x-2 overflow-x-auto">
                      {task.comments
                        .filter(comment => comment.mediaUrls && comment.mediaUrls.length > 0)
                        .flatMap(comment => comment.mediaUrls || [])
                        .slice(0, 6)
                        .map((url, index) => (
                          <div
                            key={index}
                            className="flex-shrink-0 w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              // In a real app, this would open the media file
                              alert(`Media file: ${url.split('-').pop()?.substring(0, 20) || 'File'}${index + 1}`);
                            }}
                          >
                            <span className="text-gray-400 text-xs">
                              {url.includes('image') ? '🖼️' :
                               url.includes('video') ? '🎥' :
                               url.includes('pdf') ? '📄' : '📎'}
                            </span>
                          </div>
                        ))
                      }
                      {task.comments.reduce((total, comment) =>
                        total + (comment.mediaUrls?.length || 0), 0) > 6 && (
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">
                            +{task.comments.reduce((total, comment) =>
                              total + (comment.mediaUrls?.length || 0), 0) - 6}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}