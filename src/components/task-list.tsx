import { Task } from "@/lib/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "todo": return "bg-gray-600";
      case "in-progress": return "bg-blue-600";
      case "done": return "bg-green-600";
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

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Recent Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 bg-gray-700 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-white">{task.title}</h3>
                <div className="flex space-x-2">
                  <Badge className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
              </div>

              {task.description && (
                <p className="text-sm text-gray-400 mb-3">{task.description}</p>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white">{task.percentComplete}%</span>
                </div>
                <Progress value={task.percentComplete} className="h-2" />
              </div>

              {task.dueDate && (
                <div className="mt-2 text-sm text-gray-400">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}