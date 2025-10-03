"use client";

import { useState, useEffect } from "react";
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from "@/lib/data";
import { Vehicle } from "@/lib/database";
import Image from "next/image";
import { Car, Edit, Trash2, X, Plus, Eye } from "lucide-react";
import { NavigationLayout } from "@/components/navigation-layout";

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<Vehicle | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form state for adding/editing
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    details: ""
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    const vehicles = await getVehicles();
    setVehicles(vehicles);
  };

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleEditClick = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      description: vehicle.description,
      imageUrl: vehicle.imageUrl,
      details: vehicle.details
    });
    setShowEditModal(true);
  };

  const handleAddClick = () => {
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
      details: ""
    });
    setShowAddModal(true);
  };

  const handleSaveVehicle = async () => {
    if (!formData.name.trim()) return;

    if (editingVehicle) {
      await updateVehicle(editingVehicle.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim(),
        details: formData.details.trim()
      });
    } else {
      await createVehicle({
        name: formData.name.trim(),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim(),
        details: formData.details.trim(),
        status: "available",
        createdBy: "current-user" // TODO: Get actual user from auth
      });
    }

    await loadVehicles();
    setShowEditModal(false);
    setShowAddModal(false);
    setEditingVehicle(null);
  };

  const handleDeleteVehicle = async (vehicle: Vehicle) => {
    if (confirm(`Are you sure you want to delete ${vehicle.name}?`)) {
      await deleteVehicle(vehicle.id);
      await loadVehicles();
    }
  };

  return (
    <NavigationLayout>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Fleet Management</h1>
              <p className="text-gray-400 mt-1">Manage your team&apos;s vehicles and equipment</p>
            </div>
            <button
              onClick={handleAddClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="max-w-7xl mx-auto p-6">
          {vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-all duration-200 cursor-pointer group"
                  onClick={() => handleVehicleClick(vehicle)}
                >
                  {/* Vehicle Image */}
                  <div className="aspect-video bg-gray-700 relative">
                    <Image
                      src={vehicle.imageUrl}
                      alt={vehicle.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  {/* Vehicle Info */}
                  <div
                    className="p-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVehicle(vehicle);
                    }}
                  >
                    <h3 className="font-semibold text-white text-lg mb-2">{vehicle.name}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{vehicle.description}</p>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(vehicle);
                        }}
                        className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteVehicle(vehicle);
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
              <Car className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-4">No vehicles in fleet</p>
              <button
                onClick={handleAddClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Add First Vehicle</span>
              </button>
            </div>
          )}
        </div>

        {/* Vehicle Detail Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50" onClick={() => setSelectedVehicle(null)}>
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
    
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Vehicle Image - Clickable for full screen */}
                <div
                  className="aspect-video bg-gray-700 rounded-lg overflow-hidden cursor-pointer group relative"
                  onClick={() => setFullscreenImage(selectedVehicle)}
                >
                  <Image
                    src={selectedVehicle.imageUrl}
                    alt={selectedVehicle.name}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                  />

                  {/* View Icon Overlay */}
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-black/50 rounded-full p-2">
                      <Eye className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Click to view text */}
                  <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-black/50 rounded px-2 py-1">
                      <span className="text-white text-xs">Click to view full screen</span>
                    </div>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{selectedVehicle.name}</h3>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Description</h4>
                      <p className="text-gray-300">{selectedVehicle.description}</p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Specifications</h4>
                      <p className="text-gray-300 whitespace-pre-wrap">{selectedVehicle.details || 'No specifications available'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Image Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/90"
          onClick={() => setFullscreenImage(null)}
        >
          <div
            className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={fullscreenImage.imageUrl}
              alt={fullscreenImage.name}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Close Button */}
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

        {/* Add/Edit Vehicle Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingVehicle ? "Edit Vehicle" : "Add Vehicle"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setEditingVehicle(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Vehicle Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Enter vehicle name"
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
                    placeholder="Enter vehicle description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    placeholder="https://example.com/vehicle-image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Specifications
                  </label>
                  <textarea
                    value={formData.details}
                    onChange={(e) => setFormData({...formData, details: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
                    placeholder="Enter vehicle specifications, features, etc."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setEditingVehicle(null);
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveVehicle}
                  disabled={!formData.name.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingVehicle ? "Update" : "Add"} Vehicle
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </NavigationLayout>
  );
}