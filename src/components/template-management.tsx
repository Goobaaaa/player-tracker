"use client";

import { useState } from "react";
import { createTemplate, updateTemplate } from "@/lib/mock-data";
import { Template } from "@/lib/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Save } from "lucide-react";
import Image from "next/image";

interface TemplateManagementProps {
  template?: Template;
  onClose: () => void;
  onSave: (template: Template) => void;
}

export function TemplateManagement({ template, onClose, onSave }: TemplateManagementProps) {
  const [name, setName] = useState(template?.name || "");
  const [description, setDescription] = useState(template?.description || "");
  const [logoUrl, setLogoUrl] = useState(template?.logoUrl || "");
  const [logoPreview, setLogoPreview] = useState(template?.logoUrl || "");
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);

      // In a real implementation, you would upload to a server
      // For now, we'll create a local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setLogoUrl(result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;

    let savedTemplate: Template;

    if (template) {
      // Update existing template
      updateTemplate(template.id, {
        name,
        description,
        logoUrl
      });
      savedTemplate = { ...template, name, description, logoUrl };
    } else {
      // Create new template
      savedTemplate = createTemplate({
        name,
        description,
        logoUrl,
        isActive: true,
        createdBy: 'current-user'
      });
    }

    onSave(savedTemplate);
    onClose();
  };

  const handleRemoveLogo = () => {
    setLogoUrl("");
    setLogoPreview("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">
            {template ? "Edit Template" : "Create New Template"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Template Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Template Name *
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              placeholder="Enter template name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
              rows={3}
              placeholder="Enter template description"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Template Logo
            </label>

            {logoPreview ? (
              <div className="relative">
                <Image
                  src={logoPreview}
                  alt="Template logo preview"
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-600"
                />
                <button
                  onClick={handleRemoveLogo}
                  className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <label
                  htmlFor="logo-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2 text-gray-400 hover:text-white transition-colors"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8" />
                      <span>Click to upload logo</span>
                      <span className="text-xs">PNG, JPG up to 10MB</span>
                    </>
                  )}
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || isUploading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {template ? "Update" : "Create"} Template
          </Button>
        </div>
      </div>
    </div>
  );
}