"use client";

import React from "react";

import Image from "next/image";
import { Player, Asset, Mugshot, Media, HouseMedia, Document, Weapon } from "@/lib/database";
import { getPlayerAssets, calculatePlayerAssetsValue, updatePlayer, addPlayer, deletePlayer, getPlayerMugshots, setProfilePicture, getPlayerProfilePicture, addMugshot, getPlayerMedia, addMedia, getPlayerHouseMedia, addHouseMedia, mockAssets, mockMugshots, mockMedia, mockHouseMedia, getPlayerDocuments, addPlayerDocument, deletePlayerDocument, getPlayerWeapons, mockWeapons, addVehicleImage, removeVehicleImage } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Package, FileText, Plus, Save, Camera, Upload, Star, Eye, Edit, Trash2, ExternalLink, Shield } from "lucide-react";
import { useNotification } from "@/components/notification-container";

interface PlayerModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  onPlayerSaved?: (player: Player) => void;
  onPlayerDeleted?: (playerId: string) => void;
  isEditMode?: boolean;
}

export default function PlayerModal({ player, isOpen, onClose, onPlayerSaved, onPlayerDeleted, isEditMode = false }: PlayerModalProps) {
  const { showSuccess, showError } = useNotification();
  const [assets, setAssets] = React.useState<Asset[]>([]);
    const [mugshots, setMugshots] = React.useState<Mugshot[]>([]);
  const [media, setMedia] = React.useState<Media[]>([]);
  const [houseMedia, setHouseMedia] = React.useState<HouseMedia[]>([]);
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [weapons, setWeapons] = React.useState<Weapon[]>([]);
  const [showUrlModal, setShowUrlModal] = React.useState(false);
  const [showMediaUrlModal, setShowMediaUrlModal] = React.useState(false);
  const [showHouseImageModal, setShowHouseImageModal] = React.useState(false);
  const [showHouseUrlModal, setShowHouseUrlModal] = React.useState(false);
  const [showHouseMediaModal, setShowHouseMediaModal] = React.useState(false);
  const [showVehicleModal, setShowVehicleModal] = React.useState(false);
  const [showWeaponModal, setShowWeaponModal] = React.useState(false);
  const [showDocumentModal, setShowDocumentModal] = React.useState(false);
  const [showGoogleDocModal, setShowGoogleDocModal] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState('');
  const [mediaUrl, setMediaUrl] = React.useState('');
  const [houseImageUrl, setHouseImageUrl] = React.useState('');
  const [houseMediaUrl, setHouseMediaUrl] = React.useState('');
  const [imageDisplayName, setImageDisplayName] = React.useState('');
  const [mediaDisplayName, setMediaDisplayName] = React.useState('');
  const [houseMediaDisplayName, setHouseMediaDisplayName] = React.useState('');
  // State for document upload
  const [documentFile, setDocumentFile] = React.useState<File | null>(null);
  const [documentFileName, setDocumentFileName] = React.useState('');
  const [documentDescription, setDocumentDescription] = React.useState('');
  // State for Google Doc linking
  const [googleDocUrl, setGoogleDocUrl] = React.useState('');
  const [googleDocName, setGoogleDocName] = React.useState('');
  const [googleDocDescription, setGoogleDocDescription] = React.useState('');
  const [selectedImageUrl, setSelectedImageUrl] = React.useState('');
  const [showImageModal, setShowImageModal] = React.useState(false);
  const [fullscreenImage, setFullscreenImage] = React.useState<{url: string, name: string} | null>(null);

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

  // State for vehicle image uploads
  const [showVehicleImageModal, setShowVehicleImageModal] = React.useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = React.useState<string | null>(null);
  const [vehicleImageUrl, setVehicleImageUrl] = React.useState('');

  // State for adding new weapon
  const [newWeaponForm, setNewWeaponForm] = React.useState({
    gunName: '',
    serialNumber: '',
    ballisticsReference: '',
    status: 'not_seized' as 'seized' | 'not_seized',
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

  // State for weapon editing
  const [editingWeaponId, setEditingWeaponId] = React.useState<string | null>(null);
  const [weaponEditForm, setWeaponEditForm] = React.useState({
    gunName: '',
    serialNumber: '',
    ballisticsReference: '',
    status: 'not_seized' as 'seized' | 'not_seized',
    notes: ''
  });

  React.useEffect(() => {
    if (player) {
      // Editing existing player
      setAssets(getPlayerAssets(player.id));
      setMugshots(getPlayerMugshots(player.id));
      setMedia(getPlayerMedia(player.id));
      setHouseMedia(getPlayerHouseMedia(player.id));
      setDocuments(getPlayerDocuments(player.id));
      setWeapons(getPlayerWeapons(player.id));
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
      setHouseMedia([]);
      setDocuments([]);
      setWeapons([]);
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

  const handleWeaponEdit = (weapon: Weapon) => {
    setEditingWeaponId(weapon.id);
    setWeaponEditForm({
      gunName: weapon.gunName,
      serialNumber: weapon.serialNumber,
      ballisticsReference: weapon.ballisticsReference,
      status: weapon.status,
      notes: weapon.notes || ''
    });
  };

  const handleWeaponSave = () => {
    if (editingWeaponId && player) {
      const weaponIndex = mockWeapons.findIndex(w => w.id === editingWeaponId);
      if (weaponIndex !== -1) {
        mockWeapons[weaponIndex] = {
          ...mockWeapons[weaponIndex],
          gunName: weaponEditForm.gunName,
          serialNumber: weaponEditForm.serialNumber,
          ballisticsReference: weaponEditForm.ballisticsReference,
          status: weaponEditForm.status,
          notes: weaponEditForm.notes
        };
        setWeapons(getPlayerWeapons(player.id));
        setEditingWeaponId(null);
        alert('Weapon updated successfully!');
      }
    }
  };

  const handleWeaponEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWeaponEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleWeaponDelete = (weaponId: string) => {
    if (player && confirm('Are you sure you want to delete this weapon?')) {
      const updatedWeapons = weapons.filter(weapon => weapon.id !== weaponId);
      const mockWeaponIndex = mockWeapons.findIndex(weapon => weapon.id === weaponId);
      if (mockWeaponIndex !== -1) {
        mockWeapons.splice(mockWeaponIndex, 1);
      }
      setWeapons(updatedWeapons);
      setEditingWeaponId(null);
      alert('Weapon deleted successfully!');
    }
  };

  const handleNewWeaponInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewWeaponForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddWeapon = () => {
    if (player && newWeaponForm.gunName && newWeaponForm.serialNumber) {
      const newWeapon: Weapon = {
        id: Date.now().toString(),
        playerId: player.id,
        gunName: newWeaponForm.gunName,
        serialNumber: newWeaponForm.serialNumber,
        ballisticsReference: newWeaponForm.ballisticsReference,
        status: newWeaponForm.status,
        notes: newWeaponForm.notes,
        createdAt: new Date().toISOString()
      };
      mockWeapons.push(newWeapon);
      setWeapons(getPlayerWeapons(player.id));
      setNewWeaponForm({
        gunName: '',
        serialNumber: '',
        ballisticsReference: '',
        status: 'not_seized',
        notes: ''
      });
      setShowWeaponModal(false);
      alert('Weapon added successfully!');
    }
  };

  const handleDeleteMugshot = (mugshotId: string) => {
    if (player && confirm('Are you sure you want to delete this mugshot?')) {
      // Remove from mockMugshots array
      const mugshotIndex = mockMugshots.findIndex(m => m.id === mugshotId);
      if (mugshotIndex !== -1) {
        mockMugshots.splice(mugshotIndex, 1);
      }

      // Update local state
      setMugshots(getPlayerMugshots(player.id));
      alert('Mugshot deleted successfully!');
    }
  };

  const handleDeleteMedia = (mediaId: string) => {
    if (player && confirm('Are you sure you want to delete this media?')) {
      // Remove from mockMedia array
      const mediaIndex = mockMedia.findIndex(m => m.id === mediaId);
      if (mediaIndex !== -1) {
        mockMedia.splice(mediaIndex, 1);
      }

      // Update local state
      setMedia(getPlayerMedia(player.id));
      alert('Media deleted successfully!');
    }
  };

  const handleDeleteHouseMedia = (houseMediaId: string) => {
    if (player && confirm('Are you sure you want to delete this house media?')) {
      // Remove from mockHouseMedia array
      const houseMediaIndex = mockHouseMedia.findIndex(hm => hm.id === houseMediaId);
      if (houseMediaIndex !== -1) {
        mockHouseMedia.splice(houseMediaIndex, 1);
      }

      // Update local state
      setHouseMedia(getPlayerHouseMedia(player.id));
      alert('House media deleted successfully!');
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
      const newMugshot = addMugshot(player.id, imageUrl.trim(), imageDisplayName.trim() || undefined);
      if (newMugshot) {
        setMugshots(getPlayerMugshots(player.id));
        setImageUrl('');
        setImageDisplayName('');
        setShowUrlModal(false);
        alert('Mugshot added successfully!');
      } else {
        alert('Invalid image URL. Please use a URL ending with .jpg, .jpeg, .png, .gif, .bmp, or .webp');
      }
    }
  };

  const handleAddMedia = () => {
    if (player && mediaUrl.trim()) {
      const newMedia = addMedia(player.id, mediaUrl.trim(), mediaDisplayName.trim() || undefined);
      if (newMedia) {
        setMedia(getPlayerMedia(player.id));
        setMediaUrl('');
        setMediaDisplayName('');
        setShowMediaUrlModal(false);
        alert('Media added successfully!');
      } else {
        alert('Invalid media URL. Please use a URL ending with .jpg, .jpeg, .png, .gif, .bmp, .webp, .mp4, .avi, .mov, .mp3, .wav, .pdf, .doc, or .docx');
      }
    }
  };

  const handleAddHouseMedia = () => {
    if (player && houseMediaUrl.trim()) {
      const newHouseMedia = addHouseMedia(player.id, houseMediaUrl.trim(), houseMediaDisplayName.trim() || undefined);
      if (newHouseMedia) {
        setHouseMedia(getPlayerHouseMedia(player.id));
        setHouseMediaUrl('');
        setHouseMediaDisplayName('');
        setShowHouseMediaModal(false);
        alert('House media added successfully!');
      } else {
        alert('Invalid image URL. Please use a URL ending with .jpg, .jpeg, .png, .gif, .bmp, or .webp');
      }
    }
  };

  // Document handling functions
  const handleDocumentFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (allowedTypes.includes(file.type)) {
        setDocumentFile(file);
      } else {
        alert('Please select a valid file type (PDF, DOC, DOCX, XLS, XLSX)');
      }
    }
  };

  const handleAddDocument = () => {
    if (player && documentFile) {
      // Use custom name if provided, otherwise use original filename
      const displayName = documentFileName.trim() || documentFile.name;

      const newDocument = addPlayerDocument(
        player.id,
        URL.createObjectURL(documentFile), // In real app, this would be server URL
        displayName,
        false, // isGoogleDoc
        documentDescription.trim() || undefined,
        documentFile.name
      );

      if (newDocument) {
        setDocuments(getPlayerDocuments(player.id));
        setDocumentFile(null);
        setDocumentFileName('');
        setDocumentDescription('');
        setShowDocumentModal(false);
        alert('Document uploaded successfully!');
      }
    }
  };

  const handleAddGoogleDoc = () => {
    if (player && googleDocUrl.trim() && googleDocName.trim()) {
      // Validate Google Doc URL
      const isValidGoogleDocUrl = googleDocUrl.includes('docs.google.com/document');

      if (!isValidGoogleDocUrl) {
        alert('Please enter a valid Google Docs URL');
        return;
      }

      const newDocument = addPlayerDocument(
        player.id,
        googleDocUrl.trim(),
        googleDocName.trim(),
        true, // isGoogleDoc
        googleDocDescription.trim() || undefined
      );

      if (newDocument) {
        setDocuments(getPlayerDocuments(player.id));
        setGoogleDocUrl('');
        setGoogleDocName('');
        setGoogleDocDescription('');
        setShowGoogleDocModal(false);
        alert('Google Doc linked successfully!');
      }
    } else {
      alert('Please fill in both URL and document name');
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    if (player && confirm('Are you sure you want to delete this document?')) {
      const success = deletePlayerDocument(documentId);
      if (success) {
        setDocuments(getPlayerDocuments(player.id));
        alert('Document deleted successfully!');
      } else {
        alert('Failed to delete document.');
      }
    }
  };

  const handleSaveHouseAddress = () => {
    if (player) {
      updatePlayer(player.id, { houseAddress: editForm.houseAddress });
      alert('House address saved successfully!');
    }
  };

  const handleViewFullImage = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setShowImageModal(true);
  };

  const handleDeletePlayer = () => {
    if (player) {
      if (confirm(`Are you sure you want to delete ${player.name}? This action cannot be undone and will remove all associated data including assets, transactions, and media.`)) {
        const success = deletePlayer(player.id);
        if (success) {
          alert('Player deleted successfully!');
          // Notify parent component to update UI
          if (onPlayerDeleted) {
            onPlayerDeleted(player.id);
          }
          onClose();
        } else {
          alert('Failed to delete player.');
        }
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
      showSuccess('Player information saved successfully!');
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
      showSuccess('New player created successfully!');

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
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center backdrop-blur-sm bg-black/20 pt-8">
        <div className="bg-gray-800 rounded-lg w-full max-w-6xl m-4 shadow-2xl">
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
                  <>
                    <Button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button
                      onClick={handleDeletePlayer}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </>
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
                    <TabsTrigger value="weapons" className="text-gray-300 data-[state=active]:bg-gray-600">
                      Weapons
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
                <div className="flex justify-end mb-4">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowVehicleModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Button>
              </div>
                  <Card className="bg-gray-800 border-gray-700 h-full">
                    <CardContent className="overflow-y-auto max-h-[120vh]">
                      <div className="space-y-3">
                        {assets.map((asset) => (
                          <div key={asset.id} className="p-3 bg-gray-700 rounded-lg w-full mt-3">
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

                                {/* Vehicle Images Section */}
                                <div className="pt-4 border-t border-gray-600 min-h-[200px]">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-400 text-sm">Images:</span>
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        setSelectedVehicleId(asset.id);
                                        setShowVehicleImageModal(true);
                                      }}
                                      className="bg-blue-600 hover:bg-blue-700 h-6 px-2 text-xs"
                                    >
                                      <Upload className="h-3 w-3 mr-1" />
                                      Add Image
                                    </Button>
                                  </div>

                                  {asset.vehicleImages && asset.vehicleImages.length > 0 ? (
                                    <div className="grid grid-cols-4 gap-3 h-full">
                                      {asset.vehicleImages.map((imageUrl, index) => (
                                        <div key={index} className="relative group h-full">
                                          <Image
                                            src={imageUrl}
                                            alt={`Vehicle ${index + 1}`}
                                            width={216}
                                            height={216}
                                            className="w-full h-[216px] object-cover rounded border border-gray-600 cursor-pointer"
                                            onClick={() => setFullscreenImage({ url: imageUrl, name: `Vehicle ${index + 1}` })}
                                          />
                                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => setFullscreenImage({ url: imageUrl, name: `Vehicle ${index + 1}` })}>
                                            <Eye className="h-8 w-8 text-white" />
                                          </div>
                                          <button
                                            onClick={() => {
                                              if (confirm('Remove this image?')) {
                                                removeVehicleImage(asset.id, index);
                                                // Update local state
                                                const updatedAssets = assets.map(a =>
                                                  a.id === asset.id
                                                    ? { ...a, vehicleImages: a.vehicleImages?.filter((_, i) => i !== index) }
                                                    : a
                                                );
                                                setAssets(updatedAssets);
                                              }
                                            }}
                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                          >
                                            ×
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-gray-500 text-xs">No images uploaded</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="weapons">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-white">Weapons</CardTitle>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowWeaponModal(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Weapon
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {weapons.length === 0 ? (
                        <div className="text-center py-12">
                          <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-gray-400">No weapons registered for this player</p>
                          <p className="text-gray-500 text-sm mt-2">Add weapons to track player&apos;s armaments</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {weapons.map((weapon) => (
                            <div key={weapon.id} className="p-3 bg-gray-700 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <h3 className="text-white font-medium">{weapon.gunName}</h3>
                                    <Badge className={
                                      weapon.status === 'seized'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-yellow-600 text-white'
                                    }>
                                      {weapon.status === 'seized' ? 'Seized' : 'Not Seized'}
                                    </Badge>
                                  </div>
                                  <div className="mt-1 space-y-1">
                                    <div className="text-sm">
                                      <span className="text-gray-400">Serial:</span>
                                      <span className="text-white ml-1">{weapon.serialNumber}</span>
                                    </div>
                                    <div className="text-sm">
                                      <span className="text-gray-400">Ballistics:</span>
                                      <span className="text-white ml-1">{weapon.ballisticsReference}</span>
                                    </div>
                                    {weapon.notes && (
                                      <div className="text-sm">
                                        <span className="text-gray-400">Notes:</span>
                                        <span className="text-gray-300 ml-1">{weapon.notes}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleWeaponEdit(weapon)}
                                    className="border-gray-600 text-gray-300 hover:bg-gray-600"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleWeaponDelete(weapon.id)}
                                    className="border-red-600 text-red-400 hover:bg-red-600/20"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-white">Documents</CardTitle>
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowDocumentModal(true)}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => setShowGoogleDocModal(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Link Google Doc
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {documents.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-gray-400">No documents attached to this player</p>
                          <p className="text-gray-500 text-sm mt-2">Upload files or link Google Docs to track player-related documents</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {documents.map((document) => (
                            <div key={document.id} className="p-3 bg-gray-700 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-white">{document.filename}</h3>
                                  {document.originalFilename && document.originalFilename !== document.filename && (
                                    <p className="text-xs text-gray-500 mt-1">Original: {document.originalFilename}</p>
                                  )}
                                  {document.description && (
                                    <p className="text-sm text-gray-400 mt-1">{document.description}</p>
                                  )}
                                  <div className="flex items-center space-x-2 mt-2">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                      document.isGoogleDoc
                                        ? 'bg-green-600 text-white'
                                        : 'bg-blue-600 text-white'
                                    }`}>
                                      {document.isGoogleDoc ? 'Google Doc' : 'Uploaded'}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {new Date(document.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(document.url, '_blank')}
                                    className="bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500 h-7 w-7 p-0"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeleteDocument(document.id)}
                                    className="bg-red-600 hover:bg-red-700 border-red-600 text-white h-7 w-7 p-0"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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
                              <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden relative">
                                <Image
                                  src={mugshot.url}
                                  alt={mugshot.filename}
                                  width={200}
                                  height={200}
                                  className="w-full h-full object-cover cursor-pointer"
                                  onClick={() => handleViewFullImage(mugshot.url)}
                                  onError={(e) => {
                                    const container = e.currentTarget.parentElement;
                                    if (container) {
                                      container.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-600"><svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                                    }
                                  }}
                                />
                                <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => handleViewFullImage(mugshot.url)}>
                                  <Eye className="h-8 w-8 text-white" />
                                </div>
                              </div>
                              <div className="mt-2 flex items-center justify-between">
                                <p className="text-sm text-gray-400 truncate">{mugshot.displayName || mugshot.filename}</p>
                                <div className="flex items-center space-x-2">
                                  {mugshot.isProfilePicture && (
                                    <Badge className="bg-blue-600 text-xs">
                                      <Star className="mr-1 h-3 w-3" />
                                      Profile
                                    </Badge>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeleteMugshot(mugshot.id)}
                                    className="bg-red-600 hover:bg-red-700 border-red-600 text-white p-1 h-6 w-6"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
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
                              <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden relative">
                                {mediaItem.filename.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ? (
                                  <>
                                    <Image
                                      src={mediaItem.url}
                                      alt={mediaItem.filename}
                                      width={200}
                                      height={200}
                                      className="w-full h-full object-cover cursor-pointer"
                                      onClick={() => handleViewFullImage(mediaItem.url)}
                                      onError={(e) => {
                                        const container = e.currentTarget.parentElement;
                                        if (container) {
                                          container.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-600"><svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                                        }
                                      }}
                                    />
                                    <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => handleViewFullImage(mediaItem.url)}>
                                      <Eye className="h-8 w-8 text-white" />
                                    </div>
                                  </>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <FileText className="h-8 w-8 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="mt-2 flex items-center justify-between">
                                <p className="text-sm text-gray-400 truncate">{mediaItem.displayName || mediaItem.filename}</p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteMedia(mediaItem.id)}
                                  className="bg-red-600 hover:bg-red-700 border-red-600 text-white p-1 h-6 w-6"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
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
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowHouseMediaModal(true)}>
                          <Upload className="mr-2 h-4 w-4" />
                          Add House Media
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Address
                          </label>
                          <div className="flex space-x-2">
                            <Input
                              value={editForm.houseAddress}
                              onChange={(e) => handleInputChange('houseAddress', e.target.value)}
                              placeholder="Enter house address"
                              className="flex-1 bg-gray-600 border-gray-500 text-white"
                            />
                            <Button
                              size="sm"
                              onClick={handleSaveHouseAddress}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Save
                            </Button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-4">
                            House Media Gallery
                          </label>
                          {houseMedia.length === 0 ? (
                            <div className="text-center py-8 border-2 border-dashed border-gray-600 rounded-lg">
                              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                              <p className="text-gray-400">No house media uploaded</p>
                              <p className="text-gray-500 text-sm mt-1">Click &quot;Add House Media&quot; to upload house pictures</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {houseMedia.map((houseMediaItem) => (
                                <div key={houseMediaItem.id} className="relative group">
                                  <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden relative">
                                    <Image
                                      src={houseMediaItem.url}
                                      alt={houseMediaItem.filename}
                                      width={200}
                                      height={200}
                                      className="w-full h-full object-cover cursor-pointer"
                                      onClick={() => handleViewFullImage(houseMediaItem.url)}
                                      onError={(e) => {
                                        const container = e.currentTarget.parentElement;
                                        if (container) {
                                          container.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-600"><svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                                        }
                                      }}
                                    />
                                    <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => handleViewFullImage(houseMediaItem.url)}>
                                      <Eye className="h-8 w-8 text-white" />
                                    </div>
                                  </div>
                                  <div className="mt-2 flex items-center justify-between">
                                    <p className="text-sm text-gray-400 truncate">{houseMediaItem.displayName || houseMediaItem.filename}</p>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDeleteHouseMedia(houseMediaItem.id)}
                                      className="bg-red-600 hover:bg-red-700 border-red-600 text-white p-1 h-6 w-6"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                </>
              ) : null}
            </Tabs>
          </div>
        </div>
      </div>

      {/* URL Input Modal - Only for existing players */}
      {player && showUrlModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm bg-black/20">
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
                  <p className="text-xs text-blue-400 mt-1">
                    Try: https://i.gyazo.com/70dfc2ed73318392bc4c39ba973c7db8.png
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Display Name (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter a custom name for this image"
                    value={imageDisplayName}
                    onChange={(e) => setImageDisplayName(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm bg-black/20">
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
                  <p className="text-xs text-blue-400 mt-1">
                    Try: https://i.gyazo.com/70dfc2ed73318392bc4c39ba973c7db8.png
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Display Name (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter a custom name for this media"
                    value={mediaDisplayName}
                    onChange={(e) => setMediaDisplayName(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm bg-black/20">
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

      {/* Vehicle Image Upload Modal */}
      {player && showVehicleImageModal && selectedVehicleId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div className="bg-gray-800 rounded-lg w-full max-w-md m-4 shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Add Vehicle Image</h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowVehicleImageModal(false);
                    setSelectedVehicleId(null);
                    setVehicleImageUrl('');
                  }}
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
                    type="text"
                    value={vehicleImageUrl}
                    onChange={(e) => setVehicleImageUrl(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter image URL"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => {
                      setShowVehicleImageModal(false);
                      setSelectedVehicleId(null);
                      setVehicleImageUrl('');
                    }}
                    variant="outline"
                    className="flex-1 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (vehicleImageUrl.trim()) {
                        addVehicleImage(selectedVehicleId, vehicleImageUrl.trim());
                        // Refresh assets from mockAssets to get the updated data
                        setAssets([...mockAssets.filter(asset => asset.playerId === player?.id)]);
                        setShowVehicleImageModal(false);
                        setSelectedVehicleId(null);
                        setVehicleImageUrl('');
                        alert('Vehicle image added successfully!');
                      }
                    }}
                    disabled={!vehicleImageUrl.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Add Image
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Weapon Modal - Only for existing players */}
      {player && showWeaponModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div className="bg-gray-800 rounded-lg w-full max-w-md m-4 shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Add Weapon</h3>
                <Button
                  variant="outline"
                  onClick={() => setShowWeaponModal(false)}
                  className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gun Name *
                  </label>
                  <Input
                    type="text"
                    value={newWeaponForm.gunName}
                    onChange={handleNewWeaponInputChange}
                    name="gunName"
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter gun name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Serial Number *
                  </label>
                  <Input
                    type="text"
                    value={newWeaponForm.serialNumber}
                    onChange={handleNewWeaponInputChange}
                    name="serialNumber"
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter serial number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ballistics Reference
                  </label>
                  <Input
                    type="text"
                    value={newWeaponForm.ballisticsReference}
                    onChange={handleNewWeaponInputChange}
                    name="ballisticsReference"
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter ballistics reference"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={newWeaponForm.status}
                    onChange={handleNewWeaponInputChange}
                    name="status"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="not_seized">Not Seized</option>
                    <option value="seized">Seized</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notes
                  </label>
                  <Textarea
                    value={newWeaponForm.notes}
                    onChange={handleNewWeaponInputChange}
                    name="notes"
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter additional notes"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowWeaponModal(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddWeapon}
                    disabled={!newWeaponForm.gunName || !newWeaponForm.serialNumber}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Add Weapon
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Weapon Modal */}
      {editingWeaponId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div className="bg-gray-800 rounded-lg w-full max-w-md m-4 shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Edit Weapon</h3>
                <Button
                  variant="outline"
                  onClick={() => setEditingWeaponId(null)}
                  className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gun Name *
                  </label>
                  <Input
                    type="text"
                    value={weaponEditForm.gunName}
                    onChange={handleWeaponEditInputChange}
                    name="gunName"
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter gun name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Serial Number *
                  </label>
                  <Input
                    type="text"
                    value={weaponEditForm.serialNumber}
                    onChange={handleWeaponEditInputChange}
                    name="serialNumber"
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter serial number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ballistics Reference
                  </label>
                  <Input
                    type="text"
                    value={weaponEditForm.ballisticsReference}
                    onChange={handleWeaponEditInputChange}
                    name="ballisticsReference"
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter ballistics reference"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={weaponEditForm.status}
                    onChange={handleWeaponEditInputChange}
                    name="status"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="not_seized">Not Seized</option>
                    <option value="seized">Seized</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notes
                  </label>
                  <Textarea
                    value={weaponEditForm.notes}
                    onChange={handleWeaponEditInputChange}
                    name="notes"
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter additional notes"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingWeaponId(null)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleWeaponSave}
                    disabled={!weaponEditForm.gunName || !weaponEditForm.serialNumber}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* House Image Upload Modal - Only for existing players */}
      {player && showHouseUrlModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm bg-black/20">
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm bg-black/20">
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

      {/* House Media Upload Modal - Only for existing players */}
      {player && showHouseMediaModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div className="bg-gray-800 rounded-lg w-full max-w-md m-4 shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Upload House Media</h3>
                <Button
                  variant="outline"
                  onClick={() => setShowHouseMediaModal(false)}
                  className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    House Media URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://example.com/house-image.jpg"
                    value={houseMediaUrl}
                    onChange={(e) => setHouseMediaUrl(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    URL must end with .jpg, .jpeg, .png, .gif, .bmp, or .webp
                  </p>
                  <p className="text-xs text-blue-400 mt-1">
                    Try: https://i.gyazo.com/70dfc2ed73318392bc4c39ba973c7db8.png
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Display Name (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter a custom name for this house media"
                    value={houseMediaDisplayName}
                    onChange={(e) => setHouseMediaDisplayName(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setShowHouseMediaModal(false)}
                    variant="outline"
                    className="flex-1 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddHouseMedia}
                    disabled={!houseMediaUrl.trim()}
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

      {/* Document Upload Modal - Only for existing players */}
      {player && showDocumentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div className="bg-gray-800 rounded-lg w-full max-w-md m-4 shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Upload Document</h3>
                <Button
                  variant="outline"
                  onClick={() => setShowDocumentModal(false)}
                  className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Document
                  </label>
                  <input
                    type="file"
                    onChange={handleDocumentFileSelect}
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    className="w-full p-2 bg-gray-700 border-gray-600 text-white rounded-lg"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Supported formats: PDF, DOC, DOCX, XLS, XLSX
                  </p>
                </div>
                {documentFile && (
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <p className="text-sm text-white">Selected: {documentFile.name}</p>
                    <p className="text-xs text-gray-400">Size: {(documentFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                )}
                {documentFile && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Document Name (Optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter a custom name for this document"
                      value={documentFileName}
                      onChange={(e) => setDocumentFileName(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      If empty, original filename will be used
                    </p>
                  </div>
                )}
                {documentFile && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description (Optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter a description for this document"
                      value={documentDescription}
                      onChange={(e) => setDocumentDescription(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                )}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setShowDocumentModal(false)}
                    variant="outline"
                    className="flex-1 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddDocument}
                    disabled={!documentFile}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Upload
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Google Doc Link Modal - Only for existing players */}
      {player && showGoogleDocModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div className="bg-gray-800 rounded-lg w-full max-w-md m-4 shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Link Google Doc</h3>
                <Button
                  variant="outline"
                  onClick={() => setShowGoogleDocModal(false)}
                  className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Google Doc URL *
                  </label>
                  <Input
                    type="url"
                    placeholder="https://docs.google.com/document/d/..."
                    value={googleDocUrl}
                    onChange={(e) => setGoogleDocUrl(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Document Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter document name"
                    value={googleDocName}
                    onChange={(e) => setGoogleDocName(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter document description"
                    value={googleDocDescription}
                    onChange={(e) => setGoogleDocDescription(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setShowGoogleDocModal(false)}
                    variant="outline"
                    className="flex-1 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddGoogleDoc}
                    disabled={!googleDocUrl.trim() || !googleDocName.trim()}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Link Document
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Size Image View Modal */}
      {showImageModal && selectedImageUrl && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm bg-black/20" onClick={() => setShowImageModal(false)}>
          <div className="relative max-w-6xl max-h-[90vh] w-full m-4" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 z-10 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="bg-gray-800 rounded-lg p-4 max-h-[85vh] overflow-auto">
              <Image
                src={selectedImageUrl}
                alt="Full size view"
                width={1000}
                height={1000}
                className="max-w-full max-h-[75vh] object-contain mx-auto rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = '';
                  e.currentTarget.alt = 'Failed to load image';
                }}
              />
              <div className="mt-4 text-center">
                <p className="text-gray-400 text-sm">Click anywhere outside the image or press X to close</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm bg-black/80" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }} onClick={() => setFullscreenImage(null)}>
          <div className="relative">
            {/* Image container with background */}
            <div className="relative bg-gray-900 border-2 border-gray-700 rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <Image
                src={fullscreenImage.url}
                alt={fullscreenImage.name}
                width={1200}
                height={800}
                className="max-w-[90vw] max-h-[80vh] object-contain"
                unoptimized
                onError={(e) => {
                  // Fallback for failed image loads
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>

            {/* Image name overlay */}
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg">
              <p className="text-sm font-medium truncate max-w-md">{fullscreenImage.name}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
