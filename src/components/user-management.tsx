"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  mockStaffMembers,
  getAllTemplates,
  assignTemplatePermission,
  removeTemplatePermission,
  hasTemplateAccess,
  updateUser,
  updateUserRole,
  updateUserName,
  suspendUser,
  unsuspendUser,
  getVisibleStaffMembers,
  saveStaffMembers,
  HIDDEN_ADMIN
} from "@/lib/mock-data";
import { Template, StaffMember } from "@/lib/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Shield, Trash2, UserPlus, Edit2, Save, XCircle, Ban, UserCheck } from "lucide-react";

interface UserManagementProps {
  onClose: () => void;
}

interface NewUser {
  name: string;
  username: string;
  password: string;
  tagLine: string;
  description: string;
  bloodType: string;
  favouriteHobby: string;
  role: 'admin' | 'marshall';
}

export function UserManagement({ onClose }: UserManagementProps) {
  const [users, setUsers] = useState(getVisibleStaffMembers());
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    username: "",
    password: "",
    tagLine: "",
    description: "",
    bloodType: "",
    favouriteHobby: "",
    role: "marshall"
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<NewUser>>({});

  useEffect(() => {
    setTemplates(getAllTemplates());
  }, []);

  // Update templates and user access whenever templates change
  useEffect(() => {
    const interval = setInterval(() => {
      setTemplates(getAllTemplates());
      setUsers([...getVisibleStaffMembers()]);
    }, 1000); // Check every second for template changes

    return () => clearInterval(interval);
  }, []);

  const handleCreateUser = () => {
    if (!newUser.name.trim() || !newUser.username.trim() || !newUser.password.trim()) return;

    const user = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      username: newUser.username,
      password: newUser.password,
      role: newUser.role,
      tagLine: newUser.tagLine || "USMS Staff",
      description: newUser.description || "United States Marshall Service Staff Member",
      bloodType: newUser.bloodType || "O+",
      favouriteHobby: newUser.favouriteHobby || "Serving Justice",
      portraitUrl: "",
      isSuspended: false,
      createdAt: new Date().toISOString(),
      createdBy: "admin"
    };

    mockStaffMembers.push(user);
    saveStaffMembers(mockStaffMembers);
    setUsers([...getVisibleStaffMembers()]);
    setNewUser({ name: "", username: "", password: "", tagLine: "", description: "", bloodType: "", favouriteHobby: "", role: "marshall" });
    setShowCreateUser(false);
  };

  const handleAssignPermission = () => {
    if (!selectedTemplate || !selectedUser) return;

    const currentUser = users.find(u => u.role === 'admin');
    if (currentUser) {
      assignTemplatePermission(selectedUser, selectedTemplate);
    }

    setSelectedTemplate("");
    setSelectedUser("");
  };

  const handleRemovePermission = (templateId: string, userId: string) => {
    removeTemplatePermission(templateId, userId);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getUsersWithAccess = (templateId: string) => {
    return users.filter(user => hasTemplateAccess(templateId, user.id));
  };

  const getUsersWithoutAccess = (templateId: string) => {
    return users.filter(user => !hasTemplateAccess(templateId, user.id));
  };

  const startEditingUser = (user: typeof mockStaffMembers[0]) => {
    setEditingUser(user.id);
    setEditingData({
      name: user.name,
      username: user.username,
      password: user.password,
      role: user.role,
      tagLine: user.tagLine,
      description: user.description,
      bloodType: user.bloodType,
      favouriteHobby: user.favouriteHobby
    });
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setEditingData({});
  };

  const saveUserChanges = () => {
    if (!editingUser) return;

    if (editingData.name && editingData.name.trim()) {
      updateUserName(editingUser, editingData.name.trim());
    }
    if (editingData.role) {
      updateUserRole(editingUser, editingData.role);
    }

    // Update other fields including authentication fields
    const updates: Partial<StaffMember> = {};
    if (editingData.username !== undefined) updates.username = editingData.username;
    if (editingData.password !== undefined) updates.password = editingData.password;
    if (editingData.tagLine !== undefined) updates.tagLine = editingData.tagLine;
    if (editingData.description !== undefined) updates.description = editingData.description;
    if (editingData.bloodType !== undefined) updates.bloodType = editingData.bloodType;
    if (editingData.favouriteHobby !== undefined) updates.favouriteHobby = editingData.favouriteHobby;

    if (Object.keys(updates).length > 0) {
      updateUser(editingUser, updates);
    }

    setEditingUser(null);
    setEditingData({});
    setUsers([...getVisibleStaffMembers()]);
  };

  const deleteUser = (userId: string) => {
    // Prevent deletion of hidden admin
    if (userId === HIDDEN_ADMIN.id) return;

    const userIndex = mockStaffMembers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      mockStaffMembers.splice(userIndex, 1);
      saveStaffMembers(mockStaffMembers);
      setUsers([...getVisibleStaffMembers()]);
    }
  };

  const toggleUserSuspension = (user: StaffMember) => {
    // Prevent suspension of hidden admin
    if (user.id === HIDDEN_ADMIN.id) return;

    if (user.isSuspended) {
      unsuspendUser(user.id);
    } else {
      suspendUser(user.id);
    }
    setUsers([...getVisibleStaffMembers()]);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 rounded-lg max-w-6xl w-full p-6 max-h-[90vh] overflow-y-auto">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="bg-gray-600 border-gray-500 text-white"
                />
                <Input
                  type="text"
                  placeholder="Username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  className="bg-gray-600 border-gray-500 text-white"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
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
                <Input
                  type="text"
                  placeholder="Tag Line"
                  value={newUser.tagLine}
                  onChange={(e) => setNewUser({...newUser, tagLine: e.target.value})}
                  className="bg-gray-600 border-gray-500 text-white"
                />
                <Input
                  type="text"
                  placeholder="Blood Type"
                  value={newUser.bloodType}
                  onChange={(e) => setNewUser({...newUser, bloodType: e.target.value})}
                  className="bg-gray-600 border-gray-500 text-white"
                />
                <Input
                  type="text"
                  placeholder="Description"
                  value={newUser.description}
                  onChange={(e) => setNewUser({...newUser, description: e.target.value})}
                  className="bg-gray-600 border-gray-500 text-white md:col-span-2"
                />
                <Input
                  type="text"
                  placeholder="Favourite Hobby"
                  value={newUser.favouriteHobby}
                  onChange={(e) => setNewUser({...newUser, favouriteHobby: e.target.value})}
                  className="bg-gray-600 border-gray-500 text-white md:col-span-2"
                />
                <Button
                  onClick={handleCreateUser}
                  disabled={!newUser.name.trim() || !newUser.username.trim() || !newUser.password.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </Button>
              </div>
            </div>
          )}

          {/* Users List */}
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-gray-700 rounded-lg p-4"
              >
                {editingUser === user.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        type="text"
                        placeholder="Name"
                        value={editingData.name || ''}
                        onChange={(e) => setEditingData({...editingData, name: e.target.value})}
                        className="bg-gray-600 border-gray-500 text-white"
                      />
                      <Input
                        type="text"
                        placeholder="Username"
                        value={editingData.username || ''}
                        onChange={(e) => setEditingData({...editingData, username: e.target.value})}
                        className="bg-gray-600 border-gray-500 text-white"
                      />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={editingData.password || ''}
                        onChange={(e) => setEditingData({...editingData, password: e.target.value})}
                        className="bg-gray-600 border-gray-500 text-white"
                      />
                      <select
                        value={editingData.role || 'marshall'}
                        onChange={(e) => setEditingData({...editingData, role: e.target.value as 'admin' | 'marshall'})}
                        className="bg-gray-600 border-gray-500 text-white px-3 py-2 rounded"
                      >
                        <option value="marshall">Marshall</option>
                        <option value="admin">Admin</option>
                      </select>
                      <Input
                        type="text"
                        placeholder="Tag Line"
                        value={editingData.tagLine || ''}
                        onChange={(e) => setEditingData({...editingData, tagLine: e.target.value})}
                        className="bg-gray-600 border-gray-500 text-white"
                      />
                      <Input
                        type="text"
                        placeholder="Blood Type"
                        value={editingData.bloodType || ''}
                        onChange={(e) => setEditingData({...editingData, bloodType: e.target.value})}
                        className="bg-gray-600 border-gray-500 text-white"
                      />
                      <Input
                        type="text"
                        placeholder="Favourite Hobby"
                        value={editingData.favouriteHobby || ''}
                        onChange={(e) => setEditingData({...editingData, favouriteHobby: e.target.value})}
                        className="bg-gray-600 border-gray-500 text-white"
                      />
                      <Input
                        type="text"
                        placeholder="Description"
                        value={editingData.description || ''}
                        onChange={(e) => setEditingData({...editingData, description: e.target.value})}
                        className="bg-gray-600 border-gray-500 text-white"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={saveUserChanges}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        onClick={cancelEditing}
                        variant="outline"
                        className="bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500"
                        size="sm"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-lg font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-lg truncate">{user.name}</p>
                        {user.isSuspended && user.suspendedAt && (
                          <p className="text-gray-400 text-sm">
                            Suspended on {new Date(user.suspendedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0 px-4">
                      {user.isSuspended && (
                        <Badge className="bg-red-600 text-white whitespace-nowrap">
                          <Ban className="h-3 w-3 mr-1" />
                          Suspended
                        </Badge>
                      )}
                      <Badge className={`${user.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'} text-white whitespace-nowrap`}>
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Button
                        onClick={() => startEditingUser(user)}
                        variant="outline"
                        size="sm"
                        className="bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500"
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => toggleUserSuspension(user)}
                        variant="outline"
                        size="sm"
                        className={`${user.isSuspended
                          ? 'bg-green-600 border-green-500 text-green-300 hover:bg-green-500'
                          : 'bg-orange-600 border-orange-500 text-orange-300 hover:bg-orange-500'
                        }`}
                        title={user.isSuspended ? 'Unsuspend user' : 'Suspend user'}
                      >
                        {user.isSuspended ? (
                          <>
                            <UserCheck className="h-4 w-4 mr-1" />
                            Unsuspend
                          </>
                        ) : (
                          <>
                            <Ban className="h-4 w-4 mr-1" />
                            Suspend
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => deleteUser(user.id)}
                        variant="outline"
                        size="sm"
                        className="bg-red-600 border-red-500 text-red-300 hover:bg-red-500"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
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
                      <Image
                        src={template.logoUrl}
                        alt={template.name}
                        width={32}
                        height={32}
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