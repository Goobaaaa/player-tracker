"use client";

import { useState } from "react";
import { X, Users, ImageIcon, Save } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockStaffMembers } from "@/lib/mock-data";
import { createNewTemplate } from "@/lib/template-aware-data";
import { assignTemplatePermission } from "@/lib/mock-data";
import { Template } from "@/lib/database";

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateCreated: (template: Template) => void;
  currentUserId: string;
  isAdmin: boolean;
}


export function CreateTemplateModal({
  isOpen,
  onClose,
  onTemplateCreated,
  currentUserId,
  isAdmin
}: CreateTemplateModalProps) {
  const [templateName, setTemplateName] = useState("");
  const [customIconUrl, setCustomIconUrl] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([currentUserId]); // Always include current user
  const [isCreating, setIsCreating] = useState(false);

  const availableUsers = isAdmin ? mockStaffMembers : [];

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        // Don't allow removing the current user
        if (userId === currentUserId) return prev;
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleCreateTemplate = async () => {
    if (!templateName.trim()) {
      alert("Please enter a template name");
      return;
    }

    setIsCreating(true);
    try {
      // Create the template
      const newTemplate = createNewTemplate({
        name: templateName.trim(),
        logoUrl: customIconUrl.trim() || '/media/USMSBadge.png', // Default fallback
        createdBy: currentUserId,
        isActive: true,
        description: `Investigation template: ${templateName.trim()}`
      });

      // Assign permissions to selected users
      selectedUsers.forEach(userId => {
        assignTemplatePermission(userId, newTemplate.id);
      });

      onTemplateCreated(newTemplate);
      onClose();

      // Reset form
      setTemplateName("");
      setCustomIconUrl("");
      setSelectedUsers([currentUserId]);
    } catch (error) {
      console.error("Error creating template:", error);
      alert("Failed to create template. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold text-white">Create New Template</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isCreating}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Template Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Template Name
            </label>
            <Input
              type="text"
              placeholder="Enter template name..."
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              disabled={isCreating}
            />
          </div>

          {/* Custom Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <ImageIcon className="inline h-4 w-4 mr-2" />
              Template Icon URL
            </label>
            <div className="space-y-4">
              <div>
                <Input
                  type="url"
                  placeholder="https://example.com/image.png"
                  value={customIconUrl}
                  onChange={(e) => setCustomIconUrl(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  disabled={isCreating}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Enter a valid image URL for your template icon. Supports PNG, JPG, GIF, and other image formats.
                  <br />
                  If no URL is provided, a default USMS badge will be used.
                </p>
              </div>

              {/* Preview */}
              {customIconUrl.trim() && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Preview
                  </label>
                  <div className="bg-gray-700 rounded-lg p-4 flex items-center justify-center">
                    <Image
                      src={customIconUrl}
                      alt="Custom icon preview"
                      width={64}
                      height={64}
                      className="w-16 h-16 object-contain rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const errorDiv = target.nextElementSibling as HTMLElement;
                        if (errorDiv) errorDiv.style.display = 'flex';
                      }}
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'block';
                        const errorDiv = target.nextElementSibling as HTMLElement;
                        if (errorDiv) errorDiv.style.display = 'none';
                      }}
                    />
                    <div className="hidden flex-col items-center justify-center text-gray-400">
                      <X className="h-8 w-8 mb-2" />
                      <p className="text-xs text-center">Failed to load image</p>
                      <p className="text-xs text-center">Check the URL and try again</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Access (Admin only) */}
          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Users className="inline h-4 w-4 mr-2" />
                User Access
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto bg-gray-700 rounded-lg p-3">
                {availableUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserToggle(user.id)}
                    className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${
                      selectedUsers.includes(user.id)
                        ? "bg-blue-500/20 border border-blue-500"
                        : "bg-gray-600 hover:bg-gray-500"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => {}}
                      disabled={user.id === currentUserId}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-500 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.role}</p>
                    </div>
                    {user.id === currentUserId && (
                      <span className="text-xs text-blue-400 font-medium">You</span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Selected users: {selectedUsers.length} {selectedUsers.length === 1 ? 'user' : 'users'}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
              className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTemplate}
              disabled={isCreating || !templateName.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Template
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}