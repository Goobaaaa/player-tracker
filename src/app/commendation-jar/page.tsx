"use client";

import { useState, useEffect } from "react";
import { NavigationLayout } from "@/components/navigation-layout";
import { getCommendations, createCommendation } from "@/lib/data";
import { createClient } from "@/lib/supabase";
import { Commendation } from "@/lib/database";
import Image from "next/image";
import { Award, Plus, X, Calendar, User, Trophy } from "lucide-react";

export default function CommendationJarPage() {
  const [user, setUser] = useState<any>(null);
  const [commendations, setCommendations] = useState<Commendation[]>([]);
  const [selectedCommendation, setSelectedCommendation] = useState<Commendation | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    recipientName: "",
    shortReason: "",
    fullExplanation: "",
    imageUrl: ""
  });
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndCommendations = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      loadCommendations();
    };
    fetchUserAndCommendations();
  }, [supabase.auth]);

  const loadCommendations = async () => {
    const data = await getCommendations();
    setCommendations(data.sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()));
  };

  const handleAddCommendation = async () => {
    if (!formData.recipientName.trim() || !formData.shortReason.trim() || !user) return;

    const newCommendation: Omit<Commendation, 'id' | 'issuedAt'> = {
      recipientName: formData.recipientName.trim(),
      shortReason: formData.shortReason.trim(),
      fullExplanation: formData.fullExplanation.trim(),
      issuedBy: user.id,
      issuedByName: user.user_metadata?.name || 'Unknown User',
      imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
    };

    await createCommendation(newCommendation);
    await loadCommendations();
    setShowAddModal(false);
    setFormData({
      recipientName: "",
      shortReason: "",
      fullExplanation: "",
      imageUrl: ""
    });
  };

  const handleCommendationClick = (commendation: Commendation) => {
    setSelectedCommendation(commendation);
  };

  return (
    <NavigationLayout>
      <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Commendation Jar</h1>
            <p className="text-gray-400 mt-1">Recognizing outstanding service and achievements</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Issue Commendation</span>
          </button>
        </div>
      </div>

      {/* Commendations Grid */}
      <div className="max-w-7xl mx-auto p-6">
        {commendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {commendations.map((commendation) => (
              <div
                key={commendation.id}
                onClick={() => handleCommendationClick(commendation)}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all duration-200 cursor-pointer group"
              >
                {/* Medal/Trophy Image */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-24 h-24">
                    <Image
                      src={commendation.imageUrl}
                      alt="Commendation"
                      fill
                      className="object-cover rounded-full group-hover:scale-110 transition-transform duration-200"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-yellow-500 rounded-full p-2">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Commendation Info */}
                <div className="text-center">
                  <h3 className="font-semibold text-white text-lg mb-1">{commendation.recipientName}</h3>
                  <p className="text-gray-400 text-sm mb-3 italic">{commendation.shortReason}</p>

                  <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(commendation.issuedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Hover Indicator */}
                <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-blue-400 text-sm">Click for details</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">No commendations issued yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Issue First Commendation</span>
            </button>
          </div>
        )}
      </div>

      {/* Commendation Detail Modal */}
      {selectedCommendation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50" onClick={() => setSelectedCommendation(null)}>
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">Commendation Details</h2>
                <button
                  onClick={() => setSelectedCommendation(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image
                    src={selectedCommendation.imageUrl}
                    alt="Commendation"
                    fill
                    className="object-cover rounded-full"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-yellow-500 rounded-full p-3">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{selectedCommendation.recipientName}</h3>
                <p className="text-xl text-blue-400 italic mb-4">{selectedCommendation.shortReason}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Full Explanation</h4>
                  <p className="text-gray-300 leading-relaxed">{selectedCommendation.fullExplanation}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                  <div>
                    <p className="text-gray-500 text-sm">Issued by</p>
                    <p className="text-white font-medium flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{selectedCommendation.issuedByName}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Date issued</p>
                    <p className="text-white font-medium flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(selectedCommendation.issuedAt).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Commendation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Issue Commendation</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter the name of the person being commended"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Short Reason *
                </label>
                <input
                  type="text"
                  value={formData.shortReason}
                  onChange={(e) => setFormData({...formData, shortReason: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Brief description of the achievement"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Full Explanation
                </label>
                <textarea
                  value={formData.fullExplanation}
                  onChange={(e) => setFormData({...formData, fullExplanation: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Detailed explanation of why this commendation is being issued"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Award Image URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="https://example.com/award-image.jpg"
                />
                <p className="text-gray-500 text-xs mt-1">Default award image will be used if not provided</p>
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
                onClick={handleAddCommendation}
                disabled={!formData.recipientName.trim() || !formData.shortReason.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Issue Commendation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </NavigationLayout>
  );
}