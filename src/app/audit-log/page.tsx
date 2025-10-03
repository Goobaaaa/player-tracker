"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockGetSession } from "@/lib/mock-auth";
import { getCurrentAuditLog, getVisibleStaffMembers } from "@/lib/mock-data";
import { StaffMember } from "@/lib/database";
import { AuditLogEntry } from "@/components/activity-feed";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Filter } from "lucide-react";

const auditActions = ['create', 'update', 'delete', 'add', 'comment'] as const;
const entityTypes = ['suspect', 'task', 'document', 'asset', 'media', 'comment', 'incident'] as const;

export default function AuditLogPage() {
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [filteredLog, setFilteredLog] = useState<AuditLogEntry[]>([]);
  const [users, setUsers] = useState<StaffMember[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [selectedEntityType, setSelectedEntityType] = useState<string>("all");
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await mockGetSession();
      if (error || !session) {
        router.push("/login");
        return;
      }
      setIsAuthenticated(true);
      loadAuditLogData();
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentLog = getCurrentAuditLog();
      setAuditLog(currentLog);
      applyFilters(currentLog, selectedAction, selectedUser, selectedEntityType);
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedAction, selectedUser, selectedEntityType]);

  const loadAuditLogData = async () => {
    try {
      const currentLog = getCurrentAuditLog();
      const visibleUsers = getVisibleStaffMembers();
      setAuditLog(currentLog);
      setFilteredLog(currentLog);
      setUsers(visibleUsers);
    } catch (error) {
      console.error("Error loading audit log data:", error);
    }
  };

  const applyFilters = (log: AuditLogEntry[], action: string, user: string, entityType: string) => {
    let filtered = log;

    if (action !== "all") {
      filtered = filtered.filter(entry => entry.action === action);
    }

    if (user !== "all") {
      filtered = filtered.filter(entry => entry.userId === user);
    }

    if (entityType !== "all") {
      filtered = filtered.filter(entry => entry.entityType === entityType);
    }

    setFilteredLog(filtered);
  };

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

  const exportToCSV = () => {
    const csvContent = [
      ["Timestamp", "User", "Action", "Entity Type", "Entity Name", "Details"],
      ...filteredLog.map(entry => [
        new Date(entry.timestamp).toLocaleString(),
        entry.username,
        entry.action,
        entry.entityType,
        entry.entityName,
        entry.details || ""
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `audit-log-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleActionChange = (value: string) => {
    setSelectedAction(value);
    applyFilters(auditLog, value, selectedUser, selectedEntityType);
  };

  const handleUserChange = (value: string) => {
    setSelectedUser(value);
    applyFilters(auditLog, selectedAction, value, selectedEntityType);
  };

  const handleEntityTypeChange = (value: string) => {
    setSelectedEntityType(value);
    applyFilters(auditLog, selectedAction, selectedUser, value);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-6">
                <div className="h-8 bg-gray-700 rounded w-32"></div>
                <div className="h-10 bg-gray-700 rounded w-32"></div>
              </div>
              <div className="bg-gray-800 border-gray-700 rounded-lg mb-6">
                <div className="p-6">
                  <div className="h-6 bg-gray-700 rounded w-40 mb-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                      <div className="h-10 bg-gray-700 rounded w-full"></div>
                    </div>
                    <div>
                      <div className="h-4 bg-gray-700 rounded w-16 mb-2"></div>
                      <div className="h-10 bg-gray-700 rounded w-full"></div>
                    </div>
                    <div>
                      <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
                      <div className="h-10 bg-gray-700 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <div className="h-4 bg-gray-700 rounded w-48"></div>
                <div className="h-10 bg-gray-700 rounded w-24"></div>
              </div>
              <div className="bg-gray-800 border-gray-700 rounded-lg">
                <div className="p-6">
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
                        <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="h-4 bg-gray-600 rounded w-64"></div>
                            <div className="flex items-center space-x-1">
                              <div className="w-16 h-5 bg-gray-600 rounded"></div>
                              <div className="w-12 h-5 bg-gray-600 rounded"></div>
                            </div>
                          </div>
                          <div className="h-3 bg-gray-600 rounded w-48 mb-1"></div>
                          <div className="h-3 bg-gray-600 rounded w-32"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              </div>
            </div>
          </main>
        </div>
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
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-white">Audit Log</h1>
              <Button
                onClick={exportToCSV}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {/* Filters */}
            <Card className="bg-gray-800 border-gray-700 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Action Type</label>
                    <Select value={selectedAction} onValueChange={handleActionChange}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select action type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="all">All Actions</SelectItem>
                        {auditActions.map(action => (
                          <SelectItem key={action} value={action}>
                            {action.charAt(0).toUpperCase() + action.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">User</label>
                    <Select value={selectedUser} onValueChange={handleUserChange}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="all">All Users</SelectItem>
                        {users.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Entity Type</label>
                    <Select value={selectedEntityType} onValueChange={handleEntityTypeChange}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select entity type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="all">All Entity Types</SelectItem>
                        {entityTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-300">
                Showing {filteredLog.length} of {auditLog.length} entries
              </p>
              {(selectedAction !== "all" || selectedUser !== "all" || selectedEntityType !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedAction("all");
                    setSelectedUser("all");
                    setSelectedEntityType("all");
                    setFilteredLog(auditLog);
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Audit Log Entries */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="space-y-3">
                  {filteredLog.map((log) => (
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
                  {filteredLog.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No audit log entries found</p>
                      <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}