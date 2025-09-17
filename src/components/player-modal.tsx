"use client";

import React from "react";
import Image from "next/image";
import { Player, Asset, Mugshot, Media } from "@/lib/database";
import { getPlayerAssets, calculatePlayerAssetsValue, updatePlayer, addPlayer, getPlayerMugshots, setProfilePicture, getPlayerProfilePicture, addMugshot, getPlayerMedia, addMedia, mockAssets } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Package, FileText, Plus, Save, Camera, Upload, Star, Eye, Edit } from "lucide-react";

interface PlayerModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  onPlayerSaved?: (player: Player) => void;
  isEditMode?: boolean;
}

export default function PlayerModal({ player, isOpen, onClose, onPlayerSaved, isEditMode = false }: PlayerModalProps) {
  const [assets, setAssets] = React.useState<Asset[]>([]);
    const [mugshots, setMugshots] = React.useState<Mugshot[]>([]);
  const [media, setMedia] = React.useState<Media[]>([]);
  const [showUrlModal, setShowUrlModal] = React.useState(false);
  const [showMediaUrlModal, setShowMediaUrlModal] = React.useState(false);
  const [showHouseImageModal, setShowHouseImageModal] = React.useState(false);
  const [showHouseUrlModal, setShowHouseUrlModal] = React.useState(false);
  const [showVehicleModal, setShowVehicleModal] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState('');
  const [mediaUrl, setMediaUrl] = React.useState('');
  const [houseImageUrl, setHouseImageUrl] = React.useState('');

  // State for adding new vehicle
  const [newVehicleForm, setNewVehicleForm] = React.useState({
    vehicleName: '',
    vehicleReg: '',
    vehicleVin: '',
    vehicleColour: '',
    vehicleValue: 0,
    vehicleLocation: '',
    notes: ''
  });

  // State for editable fields
  const [editForm, setEditForm] = React.useState({
    name: '',
    alias: '',
    dna: '',
    fingerprint: '',
    phoneNumber: '',
    notes: '',
    status: 'active',
    houseAddress: '',
    houseImageUrl: ''
  });

  // State for vehicle editing
  const [editingVehicleId, setEditingVehicleId] = React.useState<string | null>(null);
  const [vehicleEditForm, setVehicleEditForm] = React.useState({
    vehicleName: '',
    vehicleReg: '',
    vehicleVin: '',
    vehicleColour: '',
    vehicleValue: 0,
    vehicleLocation: '',
    notes: ''
  });

  React.useEffect(() => {
    if (player) {
      // Editing existing player
      setAssets(getPlayerAssets(player.id));
      setMugshots(getPlayerMugshots(player.id));
      setMedia(getPlayerMedia(player.id));
      setEditForm({
        name: player.name || '',
        alias: player.alias || '',
        dna: player.dna || '',
        fingerprint: player.fingerprint || '',
        phoneNumber: player.phoneNumber || '',
        notes: player.notes || '',
        status: player.status || 'active',
        houseAddress: player.houseAddress || '',
        houseImageUrl: ''
      });
    } else {
      // Creating new player - reset form
      setAssets([]);
      setMugshots([]);
      setMedia([]);
      setEditForm({
        name: '',
        alias: '',
        dna: '',
        fingerprint: '',
        phoneNumber: '',
        notes: '',
        status: 'active',
        houseAddress: '',
        houseImageUrl: ''
      });
    }
  }, [player, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Vehicle editing functions
  const handleVehicleEdit = (vehicle: Asset) => {
    setEditingVehicleId(vehicle.id);
    setVehicleEditForm({
      vehicleName: vehicle.vehicleName,
      vehicleReg: vehicle.vehicleReg,
      vehicleVin: vehicle.vehicleVin,
      vehicleColour: vehicle.vehicleColour,
      vehicleValue: vehicle.vehicleValue,
      vehicleLocation: vehicle.vehicleLocation,
      notes: vehicle.notes || ''
    });
  };

  const handleVehicleSave = () => {
    if (editingVehicleId && player) {
      // Update the vehicle in both the local state and mockAssets array
      const updatedAssets = assets.map(asset =>
        asset.id === editingVehicleId
          ? { ...asset, ...vehicleEditForm }
          : asset
      );

      // Also update the mockAssets array
      const mockAssetIndex = mockAssets.findIndex(asset => asset.id === editingVehicleId);
      if (mockAssetIndex !== -1) {
        mockAssets[mockAssetIndex] = { ...mockAssets[mockAssetIndex], ...vehicleEditForm };
      }

      setAssets(updatedAssets);
      setEditingVehicleId(null);
      alert('Vehicle updated successfully!');
    }
  };

  const handleVehicleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicleEditForm(prev => ({
      ...prev,
      [name]: name === 'vehicleValue' ? parseInt(value) || 0 : value
    }));
  };

  const handleVehicleDelete = (vehicleId: string) => {
    if (player && confirm('Are you sure you want to delete this vehicle?')) {
      // Remove from both local state and mockAssets array
      const updatedAssets = assets.filter(asset => asset.id !== vehicleId);

      // Also remove from the mockAssets array
      const mockAssetIndex = mockAssets.findIndex(asset => asset.id === vehicleId);
      if (mockAssetIndex !== -1) {
        mockAssets.splice(mockAssetIndex, 1);
      }

      setAssets(updatedAssets);
      setEditingVehicleId(null);
      alert('Vehicle deleted successfully!');
    }
  };

  const handleSetProfilePicture = (mugshotId: string) => {
    if (player) {
      setProfilePicture(player.id, mugshotId);
      setMugshots(getPlayerMugshots(player.id));
      alert('Profile picture updated successfully!');
    }
  };

  const handleAddMugshot = () => {
    if (player && imageUrl.trim()) {
      const newMugshot = addMugshot(player.id, imageUrl.trim());
      if (newMugshot) {
        setMugshots(getPlayerMugshots(player.id));
        setImageUrl('');
        setShowUrlModal(false);
        alert('Mugshot added successfully!');
      } else {
        alert('Invalid image URL. Please use a URL ending with .jpg, .jpeg, .png, .gif, .bmp, or .webp');
      }
    }
  };

  const handleAddMedia = () => {
    if (player && mediaUrl.trim()) {
      const newMedia = addMedia(player.id, mediaUrl.trim());
      if (newMedia) {
        setMedia(getPlayerMedia(player.id));
        setMediaUrl('');
        setShowMediaUrlModal(false);
        alert('Media added successfully!');
      } else {
        alert('Invalid media URL. Please use a URL ending with .jpg, .jpeg, .png, .gif, .bmp, .webp, .mp4, .avi, .mov, .mp3, .wav, .pdf, .doc, or .docx');
      }
    }
  };

  // Vehicle addition handlers
  const handleNewVehicleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewVehicleForm(prev => ({
      ...prev,
      [name]: name === 'vehicleValue' ? parseInt(value) || 0 : value
    }));
  };

  const handleAddVehicle = () => {
    if (player && newVehicleForm.vehicleName.trim() && newVehicleForm.vehicleReg.trim()) {
      // Generate unique ID for new vehicle
      const newVehicle: Asset = {
        id: Date.now().toString(),
        playerId: player.id,
        vehicleName: newVehicleForm.vehicleName.trim(),
        vehicleReg: newVehicleForm.vehicleReg.trim(),
        vehicleVin: newVehicleForm.vehicleVin.trim(),
        vehicleColour: newVehicleForm.vehicleColour.trim(),
        vehicleValue: newVehicleForm.vehicleValue,
        vehicleLocation: newVehicleForm.vehicleLocation.trim(),
        acquiredAt: new Date().toISOString(),
        notes: newVehicleForm.notes.trim()
      };

      // Add to mock assets array and update local state
      mockAssets.push(newVehicle);
      setAssets([...assets, newVehicle]);

      // Reset form and close modal
      setNewVehicleForm({
        vehicleName: '',
        vehicleReg: '',
        vehicleVin: '',
        vehicleColour: '',
        vehicleValue: 0,
        vehicleLocation: '',
        notes: ''
      });
      setShowVehicleModal(false);
      alert('Vehicle added successfully!');
    } else {
      alert('Please fill in at least the Vehicle Name and Registration fields.');
    }
  };

  const handleSetHouseImage = () => {
    if (player && houseImageUrl.trim()) {
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
      const urlLower = houseImageUrl.toLowerCase();

      const hasValidExtension = validExtensions.some(ext =>
        urlLower.endsWith(ext) || urlLower.includes(ext + '?')
      );

      if (!hasValidExtension) {
        alert('Invalid image URL. Please use a URL ending with .jpg, .jpeg, .png, .gif, .bmp, or .webp');
        return;
      }

      setEditForm(prev => ({
        ...prev,
        houseImageUrl: houseImageUrl.trim()
      }));
      setHouseImageUrl('');
      setShowHouseUrlModal(false);
      alert('House image updated successfully!');
    }
  };

  const handleSave = () => {
    // Validate required fields
    if (!editForm.name.trim() || !editForm.alias.trim()) {
      alert('Name and alias are required fields.');
      return;
    }

    if (player) {
      // Update existing player
      updatePlayer(player.id, editForm as Partial<Player>);
      console.log('Player data updated successfully:', editForm);
      alert('Player information saved successfully!');
    } else {
      // Create new player
      const newPlayer = addPlayer({
        name: editForm.name,
        alias: editForm.alias,
        dna: editForm.dna,
        fingerprint: editForm.fingerprint,
        phoneNumber: editForm.phoneNumber,
        notes: editForm.notes,
        status: editForm.status as 'active' | 'inactive' | 'MIA',
        houseAddress: editForm.houseAddress,
        avatarUrl: undefined
      });

      console.log('New player created successfully:', newPlayer);
      alert('New player created successfully!');

      // Notify parent component
      if (onPlayerSaved) {
        onPlayerSaved(newPlayer);
      }
    }

    // Close the modal
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
      <div className="bg-gray-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto m-4 shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                {player ? (
                  <>
                    <AvatarImage src={getPlayerProfilePicture(player.id) || player.avatarUrl || undefined} alt={player.name} />
                    <AvatarFallback className="bg-blue-600 text-xl">
                      {player.name.charAt(0)}
                    </AvatarFallback>
                  </>
                ) : (
                  <AvatarFallback className="bg-blue-600 text-xl">
                    <Plus className="h-8 w-8" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-white">{player ? player.name : 'New Player'}</h2>
                <p className="text-gray-400 text-lg">{player ? player.alias : 'Create a new player record'}</p>
                </div>
            </div>
            <div className="flex space-x-2">
              {isEditMode && (
                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              )}
              <Button
                variant="outline"
                onClick={onClose}
                className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Player Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Full Name</p>
                    {isEditMode ? (
                      <Input
                        value={editForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="bg-gray-600 border-gray-500 text-white"
                        placeholder="Enter full name"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-white">{player?.name || ''}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Alias</p>
                    {isEditMode ? (
                      <Input
                        value={editForm.alias}
                        onChange={(e) => handleInputChange('alias', e.target.value)}
                        className="bg-gray-600 border-gray-500 text-white"
                        placeholder="Enter alias"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-white">{player?.alias || ''}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">DNA Sequence</p>
                    {isEditMode ? (
                      <Input
                        value={editForm.dna}
                        onChange={(e) => handleInputChange('dna', e.target.value)}
                        placeholder="Enter DNA sequence"
                        className="bg-gray-600 border-gray-500 text-white font-mono"
                      />
                    ) : (
                      <p className="text-lg font-mono text-white">{player?.dna || 'Not recorded'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Fingerprint ID</p>
                    {isEditMode ? (
                      <Input
                        value={editForm.fingerprint}
                        onChange={(e) => handleInputChange('fingerprint', e.target.value)}
                        placeholder="Enter fingerprint ID"
                        className="bg-gray-600 border-gray-500 text-white font-mono"
                      />
                    ) : (
                      <p className="text-lg font-mono text-white">{player?.fingerprint || 'Not recorded'}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Phone Number</p>
                    {isEditMode ? (
                      <Input
                        value={editForm.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        placeholder="Enter phone number"
                        className="bg-gray-600 border-gray-500 text-white"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-white">{player?.phoneNumber || 'Not recorded'}</p>
                    )}
                  </div>
                  </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Status</p>
                    {isEditMode ? (
                      <select
                        value={editForm.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full p-2 bg-gray-600 border-gray-500 text-white rounded-lg"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="MIA">MIA</option>
                      </select>
                    ) : (
                      <Badge className={
                        player?.status === 'active' ? 'bg-green-600' :
                        player?.status === 'inactive' ? 'bg-orange-600' :
                        player?.status === 'MIA' ? 'bg-red-600' :
                        'bg-green-600'
                      }>
                        {player?.status || 'active'}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Summary Cards - Only show for existing players */}
          {player && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Total Assets</p>
                      <p className="text-xl font-bold text-white">${calculatePlayerAssetsValue(player.id).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Asset Count</p>
                      <p className="text-xl font-bold text-white">{assets.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-gray-700">
              <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:bg-gray-600">
                Overview
              </TabsTrigger>
              {player && (
                <>
                  <TabsTrigger value="assets" className="text-gray-300 data-[state=active]:bg-gray-600">
                    Vehicles
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="text-gray-300 data-[state=active]:bg-gray-600">
                    Documents
                  </TabsTrigger>
                  <TabsTrigger value="mugshots" className="text-gray-300 data-[state=active]:bg-gray-600">
                    Mugshots
                  </TabsTrigger>
                  <TabsTrigger value="media" className="text-gray-300 data-[state=active]:bg-gray-600">
                    Media
                  </TabsTrigger>
                  <TabsTrigger value="house" className="text-gray-300 data-[state=active]:bg-gray-600">
                    House
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            <TabsContent value="overview">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Player Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-white mb-2">Notes</h3>
                      {isEditMode ? (
                        <textarea
                          value={editForm.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          placeholder="Enter player notes"
                          className="w-full p-3 bg-gray-600 border-gray-500 text-white rounded-lg resize-none h-32"
                          rows={4}
                        />
                      ) : (
                        <p className="text-gray-400">{player?.notes || "No notes available"}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

  
            {player ? (
              <>
              <TabsContent value="assets">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white">Vehicles</CardTitle>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowVehicleModal(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Vehicle
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {assets.map((asset) => (
                        <div key={asset.id} className="p-3 bg-gray-700 rounded-lg">
                          {editingVehicleId === asset.id ? (
                            // Edit mode
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <Input
                                  name="vehicleName"
                                  value={vehicleEditForm.vehicleName}
                                  onChange={handleVehicleEditInputChange}
                                  className="bg-gray-600 border-gray-500 text-white font-semibold"
                                  placeholder="Vehicle Name"
                                />
                                <div className="flex space-x-2">
                                  <Button size="sm" onClick={handleVehicleSave} className="bg-green-600 hover:bg-green-700">
                                    Save
                                  </Button>
                                  <Button size="sm" onClick={() => setEditingVehicleId(null)} variant="outline" className="bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500">
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <Input
                                  name="vehicleReg"
                                  value={vehicleEditForm.vehicleReg}
                                  onChange={handleVehicleEditInputChange}
                                  className="bg-gray-600 border-gray-500 text-white"
                                  placeholder="Registration"
                                />
                                <Input
                                  name="vehicleVin"
                                  value={vehicleEditForm.vehicleVin}
                                  onChange={handleVehicleEditInputChange}
                                  className="bg-gray-600 border-gray-500 text-white"
                                  placeholder="VIN"
                                />
                                <Input
                                  name="vehicleColour"
                                  value={vehicleEditForm.vehicleColour}
                                  onChange={handleVehicleEditInputChange}
                                  className="bg-gray-600 border-gray-500 text-white"
                                  placeholder="Colour"
                                />
                                <Input
                                  name="vehicleValue"
                                  value={vehicleEditForm.vehicleValue}
                                  onChange={handleVehicleEditInputChange}
                                  className="bg-gray-600 border-gray-500 text-white"
                                  placeholder="Value"
                                  type="number"
                                />
                              </div>
                              <Input
                                name="vehicleLocation"
                                value={vehicleEditForm.vehicleLocation}
                                onChange={handleVehicleEditInputChange}
                                className="bg-gray-600 border-gray-500 text-white text-sm"
                                placeholder="Location"
                              />
                              <Input
                                name="notes"
                                value={vehicleEditForm.notes}
                                onChange={handleVehicleEditInputChange}
                                className="bg-gray-600 border-gray-500 text-white text-sm"
                                placeholder="Notes"
                              />
                              <Button size="sm" onClick={() => handleVehicleDelete(editingVehicleId)} variant="destructive" className="w-full bg-red-600 hover:bg-red-700">
                                Delete Vehicle
                              </Button>
                            </div>
                          ) : (
                            // View mode
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-white">{asset.vehicleName}</h3>
                                <div className="flex space-x-2">
                                  <Button size="sm" onClick={() => handleVehicleEdit(asset)} variant="outline" className="bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500 h-7 w-7 p-0">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-400">Reg:</span>
                                  <span className="text-white ml-1">{asset.vehicleReg}</span>
                                </div>
                                <div>
                                  <span className="text-gray-400">VIN:</span>
                                  <span className="text-white ml-1">{asset.vehicleVin}</span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Colour:</span>
                                  <span className="text-white ml-1">{asset.vehicleColour}</span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Value:</span>
                                  <span className="text-white ml-1">${asset.vehicleValue.toLocaleString()}</span>
                                </div>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-400">Location:</span>
                                <span className="text-white ml-1">{asset.vehicleLocation}</span>
                              </div>
                              {asset.notes && (
                                <div className="text-sm">
                                  <span className="text-gray-400">Notes:</span>
                                  <span className="text-gray-300 ml-1">{asset.notes}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white">Documents</CardTitle>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Document
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-400">No documents attached to this player</p>
                      <p className="text-gray-500 text-sm mt-2">Upload or link documents to track player-related files</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="mugshots">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white">Mugshots</CardTitle>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowUrlModal(true)}>
                        <Upload className="mr-2 h-4 w-4" />
                        Add Mugshot
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {mugshots.length === 0 ? (
                      <div className="text-center py-12">
                        <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-400">No mugshots available for this player</p>
                        <p className="text-gray-500 text-sm mt-2">Upload images to create a mugshot gallery for this player</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {mugshots.map((mugshot) => (
                          <div key={mugshot.id} className="relative group">
                            <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                              <Image
                                src={mugshot.url}
                                alt={mugshot.filename}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <p className="text-sm text-gray-400 truncate">{mugshot.filename}</p>
                              {mugshot.isProfilePicture && (
                                <Badge className="bg-blue-600 text-xs">
                                  <Star className="mr-1 h-3 w-3" />
                                  Profile
                                </Badge>
                              )}
                            </div>
                            {!mugshot.isProfilePicture && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSetProfilePicture(mugshot.id)}
                                className="w-full mt-2 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 text-xs"
                              >
                                <Star className="mr-1 h-3 w-3" />
                                Set as Profile
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="media">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white">Media</CardTitle>
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowMediaUrlModal(true)}>
                        <Upload className="mr-2 h-4 w-4" />
                        Add Media
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {media.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-400">No media available for this player</p>
                        <p className="text-gray-500 text-sm mt-2">Upload media files to create a media gallery for this player</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {media.map((mediaItem) => (
                          <div key={mediaItem.id} className="relative group">
                            <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                              {mediaItem.filename.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ? (
                                <Image
                                  src={mediaItem.url}
                                  alt={mediaItem.filename}
                                  width={200}
                                  height={200}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FileText className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="mt-2">
                              <p className="text-sm text-gray-400 truncate">{mediaItem.filename}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="house">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white">House Information</CardTitle>
                      {isEditMode && (
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowHouseUrlModal(true)}>
                          <Upload className="mr-2 h-4 w-4" />
                          Add House Image
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Address
                        </label>
                        {isEditMode ? (
                          <Input
                            value={editForm.houseAddress}
                            onChange={(e) => handleInputChange('houseAddress', e.target.value)}
                            placeholder="Enter house address"
                            className="bg-gray-600 border-gray-500 text-white"
                          />
                        ) : (
                          <p className="text-lg text-white">{editForm.houseAddress || 'No address recorded'}</p>
                        )}
                      </div>

                      {editForm.houseImageUrl && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            House Image
                          </label>
                          <div className="relative">
                            <Image
                              src={editForm.houseImageUrl}
                              alt="House"
                              width={400}
                              height={300}
                              className="w-full max-w-md h-64 object-cover rounded-lg"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowHouseImageModal(true)}
                              className="absolute top-2 right-2 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              </>
            ) : null}
          </Tabs>
        </div>
      </div>

      {/* URL Input Modal - Only for existing players */}
      {player && showUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div className="bg-gray-800 rounded-lg w-full max-w-md m-4 shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Add Mugshot</h3>
                <Button
                  variant="outline"
                  onClick={() => setShowUrlModal(false)}
                  className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    URL must end with .jpg, .jpeg, .png, .gif, .bmp, or .webp
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setShowUrlModal(false)}
                    variant="outline"
                    className="flex-1 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddMugshot}
                    disabled={!imageUrl.trim()}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    Add Mugshot
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media URL Input Modal - Only for existing players */}
      {player && showMediaUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div className="bg-gray-800 rounded-lg w-full max-w-md m-4 shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Add Media</h3>
                <Button
                  variant="outline"
                  onClick={() => setShowMediaUrlModal(false)}
                  className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Media URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://example.com/media.jpg"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    URL must end with .jpg, .jpeg, .png, .gif, .bmp, .webp, .mp4, .avi, .mov, .mp3, .wav, .pdf, .doc, or .docx
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setShowMediaUrlModal(false)}
                    variant="outline"
                    className="flex-1 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddMedia}
                    disabled={!mediaUrl.trim()}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  >
                    Add Media
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal - Only for existing players */}
      {player && showVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div className="bg-gray-800 rounded-lg w-full max-w-md m-4 shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Add Vehicle</h3>
                <Button
                  variant="outline"
                  onClick={() => setShowVehicleModal(false)}
                  className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Vehicle Name *
                  </label>
                  <Input
                    type="text"
                    value={newVehicleForm.vehicleName}
                    onChange={handleNewVehicleInputChange}
                    name="vehicleName"
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter vehicle name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Registration *
                  </label>
                  <Input
                    type="text"
                    value={newVehicleForm.vehicleReg}
                    onChange={handleNewVehicleInputChange}
                    name="vehicleReg"
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter registration number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    VIN
                  </label>
                  <Input
                    type="text"
                    value={newVehicleForm.vehicleVin}
                    onChange={handleNewVehicleInputChange}
                    name="vehicleVin"
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter VIN"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Colour
                  </label>
                  <Input
                    type="text"
                    value={newVehicleForm.vehicleColour}
                    onChange={handleNewVehicleInputChange}
                    name="vehicleColour"
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter colour"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Value ($)
                  </label>
                  <Input
                    type="number"
                    value={newVehicleForm.vehicleValue}
                    onChange={handleNewVehicleInputChange}
                    name="vehicleValue"
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter value"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <Input
                    type="text"
                    value={newVehicleForm.vehicleLocation}
                    onChange={handleNewVehicleInputChange}
                    name="vehicleLocation"
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notes
                  </label>
                  <Input
                    type="text"
                    value={newVehicleForm.notes}
                    onChange={handleNewVehicleInputChange}
                    name="notes"
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter notes (optional)"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setShowVehicleModal(false)}
                    variant="outline"
                    className="flex-1 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddVehicle}
                    disabled={!newVehicleForm.vehicleName.trim() || !newVehicleForm.vehicleReg.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Add Vehicle
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* House Image Upload Modal - Only for existing players */}
      {player && showHouseUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div className="bg-gray-800 rounded-lg w-full max-w-md m-4 shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Upload House Image</h3>
                <Button
                  variant="outline"
                  onClick={() => setShowHouseUrlModal(false)}
                  className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    House Image URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://example.com/house.jpg"
                    value={houseImageUrl}
                    onChange={(e) => setHouseImageUrl(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    URL must end with .jpg, .jpeg, .png, .gif, .bmp, or .webp
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setShowHouseUrlModal(false)}
                    variant="outline"
                    className="flex-1 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSetHouseImage}
                    disabled={!houseImageUrl.trim()}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  >
                    Upload Image
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* House Image View Modal - Only for existing players */}
      {player && showHouseImageModal && editForm.houseImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div className="relative max-w-4xl max-h-[90vh] w-full m-4">
            <Button
              variant="outline"
              onClick={() => setShowHouseImageModal(false)}
              className="absolute top-4 right-4 z-10 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              <X className="h-6 w-6" />
            </Button>
            <Image
              src={editForm.houseImageUrl}
              alt="House"
              width={400}
              height={300}
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                e.currentTarget.src = '';
                e.currentTarget.alt = 'Failed to load image';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}