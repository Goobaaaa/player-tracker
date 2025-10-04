"use client";

import { useState, useEffect } from "react";

// Disable static generation to prevent SessionProvider issues during build
export const dynamic = 'force-dynamic';
import { usersApi } from "@/lib/api-client";
import { useSession } from "@/contexts/session-context";
import { User, X, Plus } from "lucide-react";
import { NavigationLayout } from "@/components/navigation-layout";

interface StaffMember {
  id: string;
  username: string;
  name: string;
  role: string;
  isSuspended: boolean;
  createdAt: string;
}

export default function MarshallsPage() {
  const { user: currentUser } = useSession();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
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
                  className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-all duration-200"
                >
                  {/* Avatar placeholder */}
                  <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="h-10 w-10 text-gray-500" />
                  </div>

                  {/* Member Info */}
                  <div className="text-center">
                    <h3 className="font-semibold text-white text-lg mb-1">{member.name}</h3>
                    <p className="text-blue-400 text-sm font-medium mb-2">{member.role}</p>
                    <p className="text-gray-400 text-sm mb-3">{member.username}</p>
                    {member.isSuspended && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Suspended
                      </span>
                    )}
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
      </div>
    </NavigationLayout>
  );
}