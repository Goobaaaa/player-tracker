"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "@/contexts/session-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Shield } from "lucide-react";

interface UserManagementProps {
  onClose: () => void;
}

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  isSuspended: boolean;
  tagLine?: string | null;
  description?: string | null;
  bloodType?: string | null;
  hobby?: string | null;
  portraitUrl?: string | null;
  createdAt: string;
}

interface NewUser {
  name: string;
  username: string;
  password: string;
  tagLine: string;
  description: string;
  bloodType: string;
  favouriteHobby: string;
  portraitUrl: string;
  role: 'admin' | 'marshall';
}

export function UserManagement({ onClose }: UserManagementProps) {
  const { user: currentUser } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    username: "",
    password: "",
    tagLine: "",
    description: "",
    bloodType: "",
    favouriteHobby: "",
    portraitUrl: "",
    role: "marshall"
  });
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users and templates from API
  useEffect(() => {
    fetchUsers();
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      // For now, use mock templates since we don't have a real template API yet
      const { getAllTemplates } = await import("@/lib/mock-data");
      const allTemplates = getAllTemplates();
      setTemplates(allTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.name.trim() || !newUser.username.trim() || !newUser.password.trim()) return;

    try {
      setLoading(true);
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const data = await response.json();
        setUsers([...users, data.user]);
        setNewUser({
          name: "",
          username: "",
          password: "",
          tagLine: "",
          description: "",
          bloodType: "",
          favouriteHobby: "",
          portraitUrl: "",
          role: "marshall"
        });
        setShowCreateUser(false);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Error creating user');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTemplate = () => {
    if (!selectedTemplate || !selectedUser) return;

    // Template assignment logic using mock data for now
    console.log('Assigning template', selectedTemplate, 'to user', selectedUser);
    // In a real implementation, this would call an API to assign template access

    setSelectedTemplate("");
    setSelectedUser("");
  };

  const handleRemoveTemplate = (templateId: string, userId: string) => {
    // Template removal logic using mock data for now
    console.log('Removing template', templateId, 'from user', userId);
    // In a real implementation, this would call an API to remove template access
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (currentUser?.role !== 'ADMIN') {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={handleBackdropClick}
      >
        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center text-white">
            <h2 className="text-xl font-bold mb-4">Access Denied</h2>
            <p>Admin access required to manage users.</p>
            <Button onClick={onClose} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <Button
            onClick={() => setShowCreateUser(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New User
          </Button>
        </div>

        {showCreateUser && (
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Create New User</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="bg-gray-600 border-gray-500 text-white"
              />
              <Input
                placeholder="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="bg-gray-600 border-gray-500 text-white"
              />
              <Input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="bg-gray-600 border-gray-500 text-white"
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'marshall' })}
                className="bg-gray-600 border-gray-500 text-white px-3 py-2 rounded"
              >
                <option value="marshall">Marshall</option>
                <option value="admin">Admin</option>
              </select>
              <Input
                placeholder="Tag Line"
                value={newUser.tagLine}
                onChange={(e) => setNewUser({ ...newUser, tagLine: e.target.value })}
                className="bg-gray-600 border-gray-500 text-white"
              />
              <Input
                placeholder="Blood Type"
                value={newUser.bloodType}
                onChange={(e) => setNewUser({ ...newUser, bloodType: e.target.value })}
                className="bg-gray-600 border-gray-500 text-white"
              />
              <Input
                placeholder="Favourite Hobby"
                value={newUser.favouriteHobby}
                onChange={(e) => setNewUser({ ...newUser, favouriteHobby: e.target.value })}
                className="bg-gray-600 border-gray-500 text-white"
              />
              <Input
                placeholder="Picture URL"
                value={newUser.portraitUrl}
                onChange={(e) => setNewUser({ ...newUser, portraitUrl: e.target.value })}
                className="bg-gray-600 border-gray-500 text-white"
              />
              <div className="md:col-span-2">
                <textarea
                  placeholder="Description"
                  value={newUser.description}
                  onChange={(e) => setNewUser({ ...newUser, description: e.target.value })}
                  className="w-full bg-gray-600 border-gray-500 text-white px-3 py-2 rounded min-h-[80px] resize-y"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleCreateUser}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Creating...' : 'Create User'}
              </Button>
              <Button
                onClick={() => setShowCreateUser(false)}
                variant="outline"
                className="border-gray-500 text-gray-300 hover:bg-gray-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Template Access Control */}
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Template Access Control</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Template</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full bg-gray-600 border-gray-500 text-white px-3 py-2 rounded"
              >
                <option value="">Choose a template...</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select User</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full bg-gray-600 border-gray-500 text-white px-3 py-2 rounded"
              >
                <option value="">Choose a user...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} (@{user.username})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleAssignTemplate}
                disabled={!selectedTemplate || !selectedUser}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Assign Template
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {loading && users.length === 0 ? (
            <div className="text-center text-gray-400 py-8">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No users found</div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                      {user.portraitUrl ? (
                        <Image
                          src={user.portraitUrl}
                          alt={user.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{user.name}</h3>
                      <p className="text-gray-400 text-sm">@{user.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                      className={user.role === 'ADMIN' ? 'bg-red-600' : 'bg-blue-600'}
                    >
                      {user.role === 'ADMIN' && <Shield className="h-3 w-3 mr-1" />}
                      {user.role}
                    </Badge>
                    {user.isSuspended && (
                      <Badge variant="destructive" className="bg-orange-600">
                        Suspended
                      </Badge>
                    )}
                  </div>
                </div>
                {user.tagLine && (
                  <p className="text-gray-300 text-sm mt-2 italic">"{user.tagLine}"</p>
                )}
                {user.description && (
                  <p className="text-gray-400 text-sm mt-1">{user.description}</p>
                )}
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
                  <div>
                    <span className="font-medium">Blood Type:</span> {user.bloodType || 'Not specified'}
                  </div>
                  <div>
                    <span className="font-medium">Hobby:</span> {user.hobby || 'Not specified'}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}