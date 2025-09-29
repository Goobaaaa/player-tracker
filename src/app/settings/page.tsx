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
import { Settings, User, Shield, Database, Palette, Upload } from "lucide-react";
import Image from "next/image";

export default function SettingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
                        <Input
                          defaultValue="USMS Dashboard"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Logo
                        </label>
                        <div className="flex items-center space-x-4">
                          <Image src="/media/usmsbadge.png" alt="USMS Badge" width={48} height={48} className="w-12 h-12" />
                          <Button variant="outline" className="bg-gray-700 border-gray-600 text-gray-300">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Logo
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Theme
                        </label>
                        <div className="flex items-center space-x-4">
                          <Button variant="outline" className="bg-gray-700 border-gray-600 text-white">
                            <Palette className="mr-2 h-4 w-4" />
                            Dark (Default)
                          </Button>
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
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Add User
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm">A</span>
                            </div>
                            <div>
                              <p className="text-white font-medium">Admin User</p>
                              <p className="text-gray-400 text-sm">admin@usmsdashboard.com</p>
                            </div>
                          </div>
                          <Badge className="bg-purple-600">Admin</Badge>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm">U</span>
                            </div>
                            <div>
                              <p className="text-white font-medium">User Account</p>
                              <p className="text-gray-400 text-sm">user@usmsdashboard.com</p>
                            </div>
                          </div>
                          <Badge className="bg-green-600">User</Badge>
                        </div>
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
                        <Input
                          defaultValue="24 hours"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
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
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Two-Factor Authentication
                        </label>
                        <Button variant="outline" className="bg-gray-700 border-gray-600 text-gray-300">
                          Enable 2FA
                        </Button>
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
                          <Button variant="outline" className="bg-gray-700 border-gray-600 text-gray-300">
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
                        <Button variant="outline" className="bg-gray-700 border-gray-600 text-gray-300">
                          Export All Data
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}