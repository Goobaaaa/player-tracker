"use client";

import { useState, useEffect } from "react";
import { mockStaffMembers } from "@/lib/mock-data";
import { StaffMember } from "@/lib/database";
import Image from "next/image";
import { User, Edit, Trash2, X, Plus } from "lucide-react";
import { NavigationLayout } from "@/components/navigation-layout";

export default function MarshallsPage() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);

  // Form state for adding/editing
  const [formData, setFormData] = useState({
    name: "",
    callsign: "",
    tagLine: "",
    description: "",
    bloodType: "",
    favouriteHobby: "",
    portraitUrl: ""
  });

  useEffect(() => {
    loadStaffMembers();
  }, []);

  const loadStaffMembers = () => {
    setStaffMembers(mockStaffMembers);
  };

  const handleMemberClick = (member: StaffMember) => {
    setSelectedMember(member);
  };

  const handleEditClick = (member: StaffMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      callsign: member.callsign,
      tagLine: member.tagLine,
      description: member.description,
      bloodType: member.bloodType,
      favouriteHobby: member.favouriteHobby,
      portraitUrl: member.portraitUrl || ''
    });
    setShowEditModal(true);
  };

  const handleAddClick = () => {
    setFormData({
      name: "",
      callsign: "",
      tagLine: "",
      description: "",
      bloodType: "",
      favouriteHobby: "",
      portraitUrl: ""
    });
    setShowAddModal(true);
  };

  const handleSaveMember = () => {
    if (!formData.name.trim()) return;

    if (editingMember) {
      // Update existing member
      const index = mockStaffMembers.findIndex(m => m.id === editingMember.id);
      if (index > -1) {
        mockStaffMembers[index] = {
          ...mockStaffMembers[index],
          name: formData.name.trim(),
          callsign: formData.callsign.trim(),
          tagLine: formData.tagLine.trim(),
          description: formData.description.trim(),
          bloodType: formData.bloodType.trim(),
          favouriteHobby: formData.favouriteHobby.trim(),
          portraitUrl: formData.portraitUrl.trim()
        };
      }
    } else {
      // Add new member
      const newMember: StaffMember = {
        id: `staff-${Date.now()}`,
        name: formData.name.trim(),
        callsign: formData.callsign.trim(),
        tagLine: formData.tagLine.trim(),
        description: formData.description.trim(),
        bloodType: formData.bloodType.trim(),
        favouriteHobby: formData.favouriteHobby.trim(),
        portraitUrl: formData.portraitUrl.trim(),
        createdAt: new Date().toISOString(),
        createdBy: "current-user"
      };
      mockStaffMembers.push(newMember);
    }

    loadStaffMembers();
    setShowEditModal(false);
    setShowAddModal(false);
    setEditingMember(null);
  };

  const handleDeleteMember = (member: StaffMember) => {
    if (confirm(`Are you sure you want to delete ${member.name}?`)) {
      const index = mockStaffMembers.findIndex(m => m.id === member.id);
      if (index > -1) {
        mockStaffMembers.splice(index, 1);
        loadStaffMembers();
      }
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
              <p className="text-gray-400 mt-1">Meet our team members and staff</p>
            </div>
            <button
              onClick={handleAddClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Marshall</span>
            </button>
          </div>
        </div>

        {/* Staff Grid */}
        <div className="max-w-7xl mx-auto p-6">
          {staffMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {staffMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-all duration-200 cursor-pointer group"
                  onClick={() => handleMemberClick(member)}
                >
                  {/* Portrait */}
                  <div className="aspect-square bg-gray-700 relative">
                    <Image
                      src={member.portraitUrl || '/placeholder-avatar.png'}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  {/* Member Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-white text-lg mb-1">{member.name}</h3>
                    <p className="text-blue-400 text-sm font-medium mb-2">{member.callsign}</p>
                    <p className="text-gray-400 text-sm italic mb-3 line-clamp-2">{member.tagLine}</p>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(member);
                        }}
                        className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMember(member);
                        }}
                        className="p-1 bg-red-600 hover:bg-red-700 rounded text-white transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-4">No staff members added yet</p>
              <button
                onClick={handleAddClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Add First Marshall</span>
              </button>
            </div>
          )}
        </div>

        {/* Member Detail Modal */}
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50" onClick={() => setSelectedMember(null)}>
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {/* Close button positioned absolutely */}
              <div className="relative">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white bg-gray-900/50 rounded-full p-2"
                >
                  <X className="h-6 w-6" />
                </button>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Portrait */}
                    <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                      <Image
                        src={selectedMember.portraitUrl || '/placeholder-avatar.png'}
                        alt={selectedMember.name}
                        width={400}
                        height={400}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* Member Details - Aligned with image height */}
                    <div className="flex flex-col justify-between h-full">
                      <div className="space-y-4">
                        {/* Name */}
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">{selectedMember.name}</h3>
                        </div>

                        {/* Callsign */}
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-1">Callsign</h4>
                          <p className="text-blue-400 font-medium text-lg">{selectedMember.callsign}</p>
                        </div>

                        {/* Tag Line */}
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-1">Tag Line</h4>
                          <p className="text-gray-300 italic">{selectedMember.tagLine}</p>
                        </div>

                        {/* Description */}
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-1">Description</h4>
                          <p className="text-gray-300">{selectedMember.description}</p>
                        </div>

                        {/* Blood Type */}
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-1">Blood Type</h4>
                          <p className="text-gray-300">{selectedMember.bloodType}</p>
                        </div>

                        {/* Favourite Hobby */}
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-1">Favourite Hobby</h4>
                          <p className="text-gray-300">{selectedMember.favouriteHobby}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Member Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingMember ? "Edit Marshall" : "Add Marshall"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setEditingMember(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

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
                    Callsign *
                  </label>
                  <input
                    type="text"
                    value={formData.callsign}
                    onChange={(e) => setFormData({...formData, callsign: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Enter callsign"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Tag Line
                  </label>
                  <input
                    type="text"
                    value={formData.tagLine}
                    onChange={(e) => setFormData({...formData, tagLine: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Enter tag line"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
                    placeholder="Enter description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Blood Type
                  </label>
                  <input
                    type="text"
                    value={formData.bloodType}
                    onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Enter blood type"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Favourite Hobby
                  </label>
                  <input
                    type="text"
                    value={formData.favouriteHobby}
                    onChange={(e) => setFormData({...formData, favouriteHobby: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Enter favourite hobby"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Portrait URL
                  </label>
                  <input
                    type="url"
                    value={formData.portraitUrl}
                    onChange={(e) => setFormData({...formData, portraitUrl: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    placeholder="https://example.com/portrait.jpg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setEditingMember(null);
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMember}
                  disabled={!formData.name.trim() || !formData.callsign.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingMember ? "Update" : "Add"} Marshall
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </NavigationLayout>
  );
}