"use client";

import { useState, useEffect } from "react";
import {
  mockUsers,
  getAllTemplates,
  assignTemplatePermission,
  removeTemplatePermission,
  hasTemplateAccess,
  createTemplate
} from "@/lib/mock-data";
import { Template, TemplatePermission } from "@/lib/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus, User as UserIcon, Shield, Trash2, UserPlus } from "lucide-react";

interface UserManagementProps {
  onClose: () => void;
}

interface NewUser {
  name: string;
  email: string;
  role: 'admin' | 'marshall';
}

export function UserManagement({ onClose }: UserManagementProps) {
  const [users, setUsers] = useState(mockUsers);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    email: "",
    role: "marshall"
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");

  useEffect(() => {
    setTemplates(getAllTemplates());
  }, []);

  const handleCreateUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) return;

    const user = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      username: newUser.email.toLowerCase().replace(/[^a-z0-9]/g, ''),
    };

    setUsers([...users, user]);
    setNewUser({ name: "", email: "", role: "marshall" });
    setShowCreateUser(false);
  };

  const handleAssignPermission = () => {
    if (!selectedTemplate || !selectedUser) return;

    const currentUser = users.find(u => u.name === 'Admin User');
    if (currentUser) {
      assignTemplatePermission(selectedTemplate, selectedUser, currentUser.id);
    }

    setSelectedTemplate("");
    setSelectedUser("");
  };

  const handleRemovePermission = (templateId: string, userId: string) => {
    removeTemplatePermission(templateId, userId);
  };

  const getUsersWithAccess = (templateId: string) => {
    return users.filter(user => hasTemplateAccess(templateId, user.id));
  };

  const getUsersWithoutAccess = (templateId: string) => {
    return users.filter(user => !hasTemplateAccess(templateId, user.id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">User Management</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Create New User Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-white">Users</h4>
            <Button
              onClick={() => setShowCreateUser(!showCreateUser)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </div>

          {showCreateUser && (
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  type="text"
                  placeholder="Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="bg-gray-600 border-gray-500 text-white"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="bg-gray-600 border-gray-500 text-white"
                />
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as 'admin' | 'marshall'})}
                  className="bg-gray-600 border-gray-500 text-white px-3 py-2 rounded"
                >
                  <option value="marshall">Marshall</option>
                  <option value="admin">Admin</option>
                </select>
                <Button
                  onClick={handleCreateUser}
                  disabled={!newUser.name.trim() || !newUser.email.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </Button>
              </div>
            </div>
          )}

          {/* Users List */}
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-gray-700 rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                  <Badge className={`${user.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'} text-white`}>
                    <Shield className="h-3 w-3 mr-1" />
                    {user.role}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Template Permissions Section */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Template Permissions</h4>

          {/* Assign Permission Form */}
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <h5 className="text-white font-medium mb-3">Assign Template Access</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="bg-gray-600 border-gray-500 text-white px-3 py-2 rounded"
              >
                <option value="">Select Template</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="bg-gray-600 border-gray-500 text-white px-3 py-2 rounded"
              >
                <option value="">Select User</option>
                {users.filter(u => u.role !== 'admin').map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <Button
                onClick={handleAssignPermission}
                disabled={!selectedTemplate || !selectedUser}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Assign Access
              </Button>
            </div>
          </div>

          {/* Template Access Overview */}
          <div className="space-y-4">
            {templates.map((template) => {
              const usersWithAccess = getUsersWithAccess(template.id);
              const usersWithoutAccess = getUsersWithoutAccess(template.id);

              return (
                <div key={template.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    {template.logoUrl && (
                      <img
                        src={template.logoUrl}
                        alt={template.name}
                        className="w-8 h-8 rounded"
                      />
                    )}
                    <h5 className="text-white font-medium">{template.name}</h5>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Users with access */}
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Users with access:</p>
                      <div className="space-y-1">
                        {usersWithAccess.length > 0 ? (
                          usersWithAccess.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center justify-between bg-gray-600 rounded px-2 py-1"
                            >
                              <span className="text-white text-sm">{user.name}</span>
                              {user.role !== 'admin' && (
                                <button
                                  onClick={() => handleRemovePermission(template.id, user.id)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm italic">No users assigned</p>
                        )}
                      </div>
                    </div>

                    {/* Users without access */}
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Users without access:</p>
                      <div className="space-y-1">
                        {usersWithoutAccess.length > 0 ? (
                          usersWithoutAccess.map((user) => (
                            <div
                              key={user.id}
                              className="text-gray-500 text-sm"
                            >
                              {user.name}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm italic">All users have access</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}