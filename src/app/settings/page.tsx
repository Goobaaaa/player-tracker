"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { mockGetSession } from "@/lib/mock-auth";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, User, Shield, Database, Upload, X, Save } from "lucide-react";
import Image from "next/image";
import { useAppSettings } from "@/contexts/app-settings-context";
import { useNotification } from "@/components/notification-container";

export default function SettingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputAppName, setInputAppName] = useState("");
  const { settings, updateSetting } = useAppSettings();
  const handleLogoUpload = (file: File) => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };
  const { appName, appLogo, theme, sessionTimeout } = settings;
  const { showSuccess, showError, showInfo } = useNotification();

  // Initialize input with current app name
  useEffect(() => {
    if (appName) {
      setInputAppName(appName);
    }
  }, [appName]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [users, setUsers] = useState([
    {
      id: "1",
      displayName: "Admin User",
      username: "admin@usmsdashboard.com",
      role: "Admin",
      avatar: "A"
    },
    {
      id: "2",
      displayName: "User Account",
      username: "user@usmsdashboard.com",
      role: "User",
      avatar: "U"
    }
  ]);
  const [newUser, setNewUser] = useState({
    displayName: "",
    username: "",
    password: "",
    role: "User",
    permissions: ["read"]
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    const { data: { session }, error } = await mockGetSession();
    if (error || !session) {
      router.push("/login");
      return;
    }

    setIsAuthenticated(true);
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <div className="h-8 bg-gray-700 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-64"></div>
              </div>
              <div className="space-y-6">
                <div className="flex space-x-2 mb-6">
                  <div className="h-10 bg-gray-700 rounded w-24"></div>
                  <div className="h-10 bg-gray-700 rounded w-20"></div>
                  <div className="h-10 bg-gray-700 rounded w-24"></div>
                  <div className="h-10 bg-gray-700 rounded w-28"></div>
                </div>
                <div className="bg-gray-800 border-gray-700 rounded-lg p-6">
                  <div className="h-6 bg-gray-700 rounded w-40 mb-6"></div>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <div className="h-5 bg-gray-700 rounded w-40 mb-2"></div>
                        <div className="h-10 bg-gray-700 rounded w-full"></div>
                      </div>
                      <div>
                        <div className="h-5 bg-gray-700 rounded w-20 mb-2"></div>
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-700 rounded"></div>
                          <div className="h-10 bg-gray-700 rounded w-32"></div>
                        </div>
                      </div>
                      <div>
                        <div className="h-5 bg-gray-700 rounded w-16 mb-2"></div>
                        <div className="flex items-center space-x-4">
                          <div className="h-10 bg-gray-700 rounded w-40"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 border-gray-700 rounded-lg p-6">
                  <div className="h-6 bg-gray-700 rounded w-48 mb-6"></div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="h-5 bg-gray-700 rounded w-32"></div>
                      <div className="h-10 bg-gray-700 rounded w-24"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                          <div>
                            <div className="h-4 bg-gray-600 rounded w-24 mb-1"></div>
                            <div className="h-3 bg-gray-600 rounded w-40"></div>
                          </div>
                        </div>
                        <div className="w-16 h-6 bg-gray-600 rounded"></div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                          <div>
                            <div className="h-4 bg-gray-600 rounded w-28 mb-1"></div>
                            <div className="h-3 bg-gray-600 rounded w-40"></div>
                          </div>
                        </div>
                        <div className="w-16 h-6 bg-gray-600 rounded"></div>
                      </div>
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
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-gray-400 mt-2">Manage your application settings and preferences</p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="bg-gray-700">
                <TabsTrigger value="general" className="text-gray-300 data-[state=active]:bg-gray-600">
                  <Settings className="mr-2 h-4 w-4" />
                  General
                </TabsTrigger>
                <TabsTrigger value="users" className="text-gray-300 data-[state=active]:bg-gray-600">
                  <User className="mr-2 h-4 w-4" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="security" className="text-gray-300 data-[state=active]:bg-gray-600">
                  <Shield className="mr-2 h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="database" className="text-gray-300 data-[state=active]:bg-gray-600">
                  <Database className="mr-2 h-4 w-4" />
                  Database
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">General Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Application Name
                        </label>
                        <div className="flex space-x-2">
                          <Input
                            value={inputAppName}
                            onChange={(e) => setInputAppName(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                          <Button
                            onClick={() => {
                              updateSetting('appName', inputAppName);
                              showSuccess(`Application name updated to: ${inputAppName}`);
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Update
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Logo
                        </label>
                        <div className="flex items-center space-x-4">
                          <Image src={appLogo} alt="App Logo" width={48} height={48} className="w-12 h-12" />
                          <div className="flex items-center space-x-2">
                            <input
                              type="file"
                              id="logo-upload"
                              className="hidden"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setIsUploadingLogo(true);
                                  try {
                                    const logoUrl = await handleLogoUpload(file);
                                    updateSetting('appLogo', logoUrl);
                                    setLogoFile(file);
                                    showSuccess(`Logo uploaded: ${file.name}`);
                                  } catch (error) {
                                    showError('Failed to upload logo. Please try again.');
                                    console.error('Logo upload error:', error);
                                  } finally {
                                    setIsUploadingLogo(false);
                                  }
                                }
                              }}
                            />
                            <Button
                              onClick={() => document.getElementById('logo-upload')?.click()}
                              variant="outline"
                              className="bg-gray-700 border-gray-600 text-gray-300"
                              disabled={isUploadingLogo}
                            >
                              {isUploadingLogo ? (
                                <>
                                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="mr-2 h-4 w-4" />
                                  Upload Logo
                                </>
                              )}
                            </Button>
                            {logoFile && (
                              <Badge className="bg-green-600">{logoFile.name}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Theme
                        </label>
                        <div className="flex items-center space-x-4">
                          <div className="flex bg-gray-700 rounded-lg p-1">
                            <button
                              onClick={() => updateSetting('theme', 'light')}
                              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                theme === "light" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
                              }`}
                            >
                              Light
                            </button>
                            <button
                              onClick={() => updateSetting('theme', 'dark')}
                              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                theme === "dark" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
                              }`}
                            >
                              Dark
                            </button>
                          </div>
                          <Badge className={theme === "dark" ? "bg-blue-600" : "bg-yellow-600"}>
                            {theme.charAt(0).toUpperCase() + theme.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">User Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-white">Current Users</h3>
                        <Button onClick={() => setShowAddUserModal(true)} className="bg-blue-600 hover:bg-blue-700">
                          Add User
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {users.map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                user.role === "Admin" ? "bg-purple-600" : "bg-green-600"
                              }`}>
                                <span className="text-white text-sm">{user.avatar}</span>
                              </div>
                              <div>
                                <p className="text-white font-medium">{user.displayName}</p>
                                <p className="text-gray-400 text-sm">{user.username}</p>
                              </div>
                            </div>
                            <Badge className={user.role === "Admin" ? "bg-purple-600" : "bg-green-600"}>
                              {user.role}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Session Timeout
                        </label>
                        <select
                          value={sessionTimeout}
                          onChange={(e) => {
                            const newTimeout = parseInt(e.target.value, 10);
                            updateSetting('sessionTimeout', newTimeout);
                            showSuccess(`Session timeout updated to ${newTimeout} minutes`);
                          }}
                          className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={45}>45 minutes</option>
                          <option value={60}>60 minutes</option>
                        </select>
                        <p className="text-xs text-gray-400 mt-1">
                          User will be automatically logged out after {sessionTimeout} minutes of inactivity
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Password Requirements
                        </label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-gray-300 text-sm">Minimum 8 characters</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-gray-300 text-sm">At least one uppercase letter</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-gray-300 text-sm">At least one number</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="database">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Database Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Database Status
                        </label>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-green-400 text-sm">Connected</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Backup & Restore
                        </label>
                        <div className="flex space-x-2">
                          <Button onClick={() => showSuccess('Backup initiated successfully!')} className="bg-green-600 hover:bg-green-700">
                            Backup Now
                          </Button>
                          <Button variant="outline" className="bg-gray-700 border-gray-600 text-gray-300">
                            Restore
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Data Export
                        </label>
                        <div className="flex space-x-2">
                          <Button onClick={() => showInfo('Exporting data as PDF...', 'Your data export will begin shortly.')} variant="outline" className="bg-gray-700 border-gray-600 text-gray-300">
                            Export PDF
                          </Button>
                          <Button onClick={() => showInfo('Exporting data as CSV...', 'Your data export will begin shortly.')} variant="outline" className="bg-gray-700 border-gray-600 text-gray-300">
                            Export CSV
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Add New User</h3>
              <Button
                onClick={() => setShowAddUserModal(false)}
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Display Name
                </label>
                <Input
                  value={newUser.displayName}
                  onChange={(e) => setNewUser({...newUser, displayName: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter display name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Username
                </label>
                <Input
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Password
                </label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="Moderator">Moderator</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Permissions
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newUser.permissions.includes('read')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewUser({...newUser, permissions: [...newUser.permissions, 'read']});
                        } else {
                          setNewUser({...newUser, permissions: newUser.permissions.filter(p => p !== 'read')});
                        }
                      }}
                      className="rounded border-gray-600"
                    />
                    <span className="text-gray-300">Read Access</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newUser.permissions.includes('write')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewUser({...newUser, permissions: [...newUser.permissions, 'write']});
                        } else {
                          setNewUser({...newUser, permissions: newUser.permissions.filter(p => p !== 'write')});
                        }
                      }}
                      className="rounded border-gray-600"
                    />
                    <span className="text-gray-300">Write Access</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newUser.permissions.includes('admin')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewUser({...newUser, permissions: [...newUser.permissions, 'admin']});
                        } else {
                          setNewUser({...newUser, permissions: newUser.permissions.filter(p => p !== 'admin')});
                        }
                      }}
                      className="rounded border-gray-600"
                    />
                    <span className="text-gray-300">Admin Access</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      showInfo(`Profile picture selected: ${file.name}`);
                    }
                  }}
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                onClick={() => setShowAddUserModal(false)}
                variant="outline"
                className="bg-gray-700 border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (newUser.displayName && newUser.username && newUser.password) {
                    const userToAdd = {
                      id: Date.now().toString(),
                      displayName: newUser.displayName,
                      username: newUser.username,
                      role: newUser.role,
                      avatar: newUser.displayName.charAt(0).toUpperCase()
                    };
                    setUsers([...users, userToAdd]);
                    setNewUser({
                      displayName: "",
                      username: "",
                      password: "",
                      role: "User",
                      permissions: ["read"]
                    });
                    setShowAddUserModal(false);
                    showSuccess(`User ${newUser.displayName} added successfully!`);
                  } else {
                    showError('Please fill in all required fields');
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}