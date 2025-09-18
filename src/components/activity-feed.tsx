import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface AuditLogEntry {
  id: string;
  userId: string;
  username: string;
  action: 'create' | 'update' | 'delete' | 'add' | 'comment';
  entityType: 'suspect' | 'task' | 'document' | 'asset' | 'media' | 'comment' | 'incident';
  entityName: string;
  entityId: string;
  details?: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: AuditLogEntry[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case "create": return "➕";
      case "update": return "✏️";
      case "delete": return "🗑️";
      case "add": return "📎";
      case "comment": return "💬";
      default: return "📌";
    }
  };

  const getEntityTypeIcon = (entityType: string) => {
    switch (entityType) {
      case "suspect": return "👥";
      case "task": return "✅";
      case "document": return "📄";
      case "asset": return "🚗";
      case "media": return "🖼️";
      case "comment": return "💬";
      case "incident": return "🚨";
      default: return "📌";
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "create": return "bg-green-600";
      case "update": return "bg-blue-600";
      case "delete": return "bg-red-600";
      case "add": return "bg-purple-600";
      case "comment": return "bg-yellow-600";
      default: return "bg-gray-600";
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <span>🔍</span>
          <span className="ml-2">Audit Log</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((log) => (
            <div key={log.id} className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActionColor(log.action)}`}>
                <span className="text-sm">{getActionIcon(log.action)}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-white">
                    <span className="font-medium">{log.username}</span>
                    <span className="mx-1">{getActionIcon(log.action)}</span>
                    {getEntityTypeIcon(log.entityType)}
                    <span className="ml-1">{log.entityName}</span>
                  </p>
                  <div className="flex items-center space-x-1">
                    <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                      {log.entityType}
                    </Badge>
                    <Badge className={`text-xs ${getActionColor(log.action)}`}>
                      {log.action}
                    </Badge>
                  </div>
                </div>
                {log.details && (
                  <p className="text-xs text-gray-400 mb-1">{log.details}</p>
                )}
                <p className="text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No audit log entries yet</p>
              <p className="text-gray-500 text-sm mt-1">Actions will appear here as users interact with the system</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}