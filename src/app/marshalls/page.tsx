"use client";

import { useState, useEffect } from "react";

// Disable static generation to prevent SessionProvider issues during build
export const dynamic = 'force-dynamic';
import { usersApi } from "@/lib/api-client";
import { useSession } from "@/contexts/session-context";
import { User, X, Plus, Mail, Calendar, Phone, Heart, Briefcase, Shield } from "lucide-react";
import { NavigationLayout } from "@/components/navigation-layout";

interface StaffMember {
  id: string;
  username: string;
  name: string;
  role: string;
  isSuspended: boolean;
  createdAt: string;
  tagLine?: string | null;
  description?: string | null;
  bloodType?: string | null;
  hobby?: string | null;
  portraitUrl?: string | null;
}

export default function MarshallsPage() {
  const { user: currentUser } = useSession();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for adding users
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    role: "MARSHALL" as 'ADMIN' | 'MARSHALL'
  });

  useEffect(() => {
    loadStaffMembers();
  }, []);

  const loadStaffMembers = async () => {
    try {
      const response = await usersApi.getUsers();
      if (response.data && typeof response.data === 'object' && 'users' in response.data) {
        const allUsers = (response.data as { users: StaffMember[] }).users;
        // Filter out the System Administrator account
        const filteredUsers = allUsers.filter(user => user.username !== 'admin');
        setStaffMembers(filteredUsers);
      } else if (response.error) {
        setError(response.error);
      }
    } catch {
      setError('Failed to load staff members');
    }
  };

  const handleAddClick = () => {
    setFormData({
      name: "",
      username: "",
      password: "",
      role: "MARSHALL"
    });
    setShowAddModal(true);
    setError(null);
  };

  const handleMemberClick = (member: StaffMember) => {
    setSelectedMember(member);
    setShowPreviewModal(true);
  };

  const handleClosePreview = () => {
    setShowPreviewModal(false);
    setSelectedMember(null);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClosePreview();
    }
  };

  const handleSaveMember = async () => {
    if (!formData.name.trim() || !formData.username.trim() || !formData.password.trim()) {
      setError('All required fields must be filled');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await usersApi.createUser({
        name: formData.name.trim(),
        username: formData.username.trim().toLowerCase(),
        password: formData.password.trim(),
        role: formData.role
      });

      if (response.error) {
        setError(response.error);
      } else {
        await loadStaffMembers();
        setShowAddModal(false);
        setFormData({
          name: "",
          username: "",
          password: "",
          role: "MARSHALL"
        });
      }
    } catch {
      setError('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <NavigationLayout>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Marshalls</h1>
              <p className="text-gray-400 mt-1">Manage user accounts and team members</p>
              {error && (
                <div className="text-red-400 text-sm mt-2">{error}</div>
              )}
            </div>
                      </div>
        </div>

        {/* Staff Grid */}
        <div className="max-w-7xl mx-auto p-6">
          {staffMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {staffMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => handleMemberClick(member)}
                  className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 hover:scale-105 transition-all duration-200 cursor-pointer shadow-lg"
                >
                  {/* Profile Picture */}
                  <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 overflow-hidden border-2 border-gray-600">
                    {member.portraitUrl ? (
                      <img
                        src={member.portraitUrl}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-12 w-12 text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Member Info */}
                  <div className="text-center">
                    <h3 className="font-semibold text-white text-lg mb-1">{member.name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        member.role === 'ADMIN'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {member.role === 'ADMIN' && <Shield className="h-3 w-3 mr-1" />}
                        {member.role}
                      </span>
                      {member.isSuspended && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Suspended
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{member.username}</p>
                    {member.tagLine && (
                      <p className="text-gray-300 text-xs italic mb-2">"{member.tagLine}"</p>
                    )}
                    <p className="text-gray-500 text-xs">Click to view details</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-4">No staff members found</p>
                          </div>
          )}
        </div>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
            <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Add New User</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setError(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {error && (
                <div className="text-red-400 text-sm mb-4">{error}</div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Enter password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as 'ADMIN' | 'MARSHALL'})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="MARSHALL">Marshall</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setError(null);
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMember}
                  disabled={!formData.name.trim() || !formData.username.trim() || !formData.password.trim() || loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create User"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Staff Member Preview Modal */}
        {showPreviewModal && selectedMember && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/30"
            onClick={handleBackdropClick}
          >
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 shadow-2xl border border-gray-700">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Staff Member Details</h2>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-600">
                    {selectedMember.portraitUrl ? (
                      <img
                        src={selectedMember.portraitUrl}
                        alt={selectedMember.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-16 w-16 text-gray-500" />
                    )}
                  </div>
                </div>

                {/* Information Section */}
                <div className="flex-1 space-y-4">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{selectedMember.name}</h3>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedMember.role === 'ADMIN'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedMember.role === 'ADMIN' && <Shield className="h-4 w-4 mr-2" />}
                        {selectedMember.role}
                      </span>
                      <span className="text-gray-400 text-sm">@{selectedMember.username}</span>
                      {selectedMember.isSuspended && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                          Suspended
                        </span>
                      )}
                    </div>
                    {selectedMember.tagLine && (
                      <p className="text-gray-300 italic">"{selectedMember.tagLine}"</p>
                    )}
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Heart className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">Blood Type:</span>
                        <span className="text-white font-medium">{selectedMember.bloodType || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">Hobby:</span>
                        <span className="text-white font-medium">{selectedMember.hobby || 'Not specified'}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">Joined:</span>
                        <span className="text-white font-medium">
                          {new Date(selectedMember.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedMember.description && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Description</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{selectedMember.description}</p>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-400 text-sm text-center mt-6">Click outside to close</p>
            </div>
          </div>
        )}
      </div>
    </NavigationLayout>
  );
}