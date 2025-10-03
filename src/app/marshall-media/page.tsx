"use client";

import { useState, useEffect, useRef } from "react";
import { NavigationLayout } from "@/components/navigation-layout";
import { createClient } from "@/lib/supabase";
import { getMediaItems, createMediaItem, deleteMediaItem, uploadMediaFile } from "@/lib/data";
import { MediaItem } from "@/lib/database";
import Image from "next/image";
import { Camera, Upload, X, Plus, Eye, Trash2 } from "lucide-react";

export default function MarshallMediaPage() {
  const [user, setUser] = useState<any>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [newMediaDescription, setNewMediaDescription] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndMedia = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      loadMediaItems();
    };
    fetchUserAndMedia();
  }, [supabase.auth]);

  const loadMediaItems = async () => {
    const data = await getMediaItems();
    setMediaItems(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const handleAddClick = () => {
    setNewMediaUrl("");
    setNewMediaDescription("");
    setPreviewImage(null);
    setShowAddModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const url = await uploadMediaFile(file);
        setNewMediaUrl(url);
        setPreviewImage(url);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleAddMedia = async () => {
    if (!newMediaUrl.trim() || !user) return;

    const newMedia: Omit<MediaItem, 'id' | 'createdAt'> = {
      url: newMediaUrl,
      description: newMediaDescription.trim() || "No description provided",
      uploaderId: user.id,
      uploaderName: user.user_metadata?.name || 'Unknown User',
    };

    await createMediaItem(newMedia);
    await loadMediaItems();
    setShowAddModal(false);
    setNewMediaUrl("");
    setNewMediaDescription("");
    setPreviewImage(null);
  };

  const handleDeleteMedia = async (media: MediaItem) => {
    if (confirm(`Are you sure you want to delete this media item?`)) {
      await deleteMediaItem(media.id);
      await loadMediaItems();
    }
  };

  const canDeleteMedia = (media: MediaItem) => {
    return media.uploaderId === user?.id || user?.user_metadata?.role === 'admin';
  };

  return (
    <NavigationLayout>
      <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Marshall Media</h1>
            <p className="text-gray-400 mt-1">Gallery of team photos, events, and operational media</p>
          </div>
          <button
            onClick={handleAddClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Upload Media</span>
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div className="max-w-7xl mx-auto p-6">
        {mediaItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {mediaItems.map((media) => (
              <div
                key={media.id}
                className="relative group aspect-square bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedMedia(media)}
              >
                {/* Media Image */}
                <div className="w-full h-full relative">
                  <Image
                    src={media.url}
                    alt={media.description}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Overlay with info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-xs font-medium line-clamp-2">{media.description}</p>
                    <p className="text-gray-300 text-xs mt-1">by {media.uploaderName}</p>
                  </div>
                </div>

                {/* View Icon */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-black/50 rounded-full p-2">
                    <Eye className="h-4 w-4 text-white" />
                  </div>
                </div>

                {/* Delete Icon */}
                {canDeleteMedia(media) && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMedia(media);
                      }}
                      className="bg-red-600 hover:bg-red-700 rounded-full p-2 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">No media items found</p>
            <button
              onClick={handleAddClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Upload First Media</span>
            </button>
          </div>
        )}
      </div>

      {/* Full Screen Media Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/90"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedMedia.url}
              alt={selectedMedia.description}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Close Button */}
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Media Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-white font-semibold text-lg mb-2">{selectedMedia.description}</h3>
              <div className="flex justify-between items-center text-sm text-gray-300">
                <span>Uploaded by {selectedMedia.uploaderName}</span>
                <span>{new Date(selectedMedia.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Media Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Upload Media</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Upload Options */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Choose Upload Method</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* File Upload */}
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full bg-gray-700 hover:bg-gray-600 border-2 border-dashed border-gray-600 rounded-lg p-6 text-center transition-colors disabled:opacity-50"
                    >
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-300">Upload from device</p>
                      <p className="text-gray-500 text-xs mt-1">JPG, PNG up to 10MB</p>
                    </button>
                  </div>

                  {/* URL Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Or enter image URL</label>
                    <input
                      type="url"
                      value={newMediaUrl}
                      onChange={(e) => {
                        setNewMediaUrl(e.target.value);
                        setPreviewImage(e.target.value);
                      }}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              {previewImage && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Preview</label>
                  <div className="relative aspect-video bg-gray-700 rounded-lg overflow-hidden">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={newMediaDescription}
                  onChange={(e) => setNewMediaDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Describe this media item..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMedia}
                disabled={!newMediaUrl.trim() || isUploading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Upload Media'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </NavigationLayout>
  );
}