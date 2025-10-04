"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAllTemplates, getUserTemplates } from "@/lib/mock-data";
import { Template } from "@/lib/database";
import Image from "next/image";
import { Plus, Users, LogOut, Home, Car, MessageSquare, Camera, Quote, Gift, Calendar } from "lucide-react";
import { UserManagement } from "@/components/user-management";
import { CreateTemplateModal } from "@/components/create-template-modal";
import { useSession } from "@/contexts/session-context";

export default function HomePage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading, signOut } = useSession();

  const loadTemplates = useCallback(() => {
    if (!user) return;

    if (user.role === 'ADMIN') {
      const allTemplates = getAllTemplates();
      setTemplates(allTemplates);
    } else {
      const userTemplates = getUserTemplates(user.id);
      setTemplates(userTemplates);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      loadTemplates();
    }
  }, [user, loading, router, loadTemplates]);

  const handleCreateTemplate = () => {
    setShowCreateTemplateModal(true);
  };

  const handleTemplateCreated = (template: Template) => {
    // Reload templates to show the new one
    loadTemplates();

    // Navigate to the new template
    router.push(`/template/${template.id}`);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    router.push(`/template/${templateId}`);
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const navItems = [
    { icon: Home, label: "Homepage", active: true, href: "/homepage" },
    { icon: Users, label: "Marshalls", href: "/marshalls" },
    { icon: Car, label: "Fleet", href: "/fleet" },
    { icon: MessageSquare, label: "Marshall Chatroom", href: "/marshall-chatroom" },
    { icon: Camera, label: "Marshall Media", href: "/marshall-media" },
    { icon: Quote, label: "Quote Wall", href: "/quote-wall" },
    { icon: Gift, label: "Commendation Jar", href: "/commendation-jar" },
    { icon: Calendar, label: "Upcoming Events", href: "/upcoming-events" },
  ];

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left-hand navigation menu */}
      <div className="w-64 bg-gray-800 border-r border-gray-700">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Image src="/media/USMSBadge.png" alt="USMS Badge" width={40} height={40} className="object-contain" />
            <h2 className="text-2xl font-bold text-white">USMS</h2>
          </div>
          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors block ${
                  item.active
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          {user?.role === 'ADMIN' && (
            <div className="mt-8 pt-8 border-t border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Admin Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={handleCreateTemplate}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Template</span>
                </button>
                <button
                  onClick={() => setShowUserManagement(true)}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <Users className="h-5 w-5" />
                  <span>Manage Users</span>
                </button>
              </div>
            </div>
          )}

          {/* User Actions - Available to all users */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header with dropdown */}
        <header className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            {/* Template dropdown */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedTemplate || ""}
                onChange={(e) => e.target.value && handleTemplateSelect(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="">USMS Homepage</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {/* User info */}
            <div className="flex items-center space-x-4">
              <span className="text-white">Welcome, {user?.name}</span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-4xl w-full text-center">
            {/* USMS Logo centered */}
            <div className="mb-8">
              <Image
                src="/USMSBadge.png"
                alt="USMS Logo"
                width={200}
                height={200}
                className="mx-auto"
              />
            </div>

            {/* Introductory text */}
            <div className="bg-gray-800 rounded-lg p-8 mb-8">
              <h1 className="text-3xl font-bold text-white mb-6">
                United States Marshall Service Homepage
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed">
                This is the United States Marshall Service Homepage, this website is used to track and record on-going and concluded investigations by the Marshall Service. This page is developed and maintained by Silas Marshall with the San Andreas State Troopers. If you have any questions/concerns or suggestions, please direct them to Silas Marshall (email: gooba).
              </p>
            </div>

            {/* Template selection or no templates message */}
            {templates.length > 0 ? (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Available Templates
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors relative group"
                    >
                      <div
                        onClick={() => handleTemplateSelect(template.id)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          {template.logoUrl && (
                            <Image
                              src={template.logoUrl}
                              alt={template.name}
                              width={40}
                              height={40}
                              className="rounded"
                            />
                          )}
                          <h3 className="text-white font-semibold">{template.name}</h3>
                        </div>
                        {template.description && (
                          <p className="text-gray-400 text-sm">{template.description}</p>
                        )}
                      </div>
                      </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-gray-400">
                  No templates available. {user?.role === 'ADMIN' && 'Create a template to get started.'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      
      {/* User Management Modal */}
      {showUserManagement && (
        <UserManagement onClose={() => setShowUserManagement(false)} />
      )}

      {/* Create Template Modal */}
      {user && (
        <CreateTemplateModal
          isOpen={showCreateTemplateModal}
          onClose={() => setShowCreateTemplateModal(false)}
          onTemplateCreated={handleTemplateCreated}
          currentUserId={user.id}
          isAdmin={user.role === 'ADMIN'}
        />
      )}
    </div>
  );
}