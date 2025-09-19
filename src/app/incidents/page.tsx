"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockGetSession } from "@/lib/mock-auth";
import { getAllIncidents, addIncident, updateIncident, deleteIncident, mockPlayers } from "@/lib/mock-data";
import { Incident } from "@/lib/database";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar, Users, UserCheck, FileText, Plus, Edit, Trash2, AlertTriangle, Eye } from "lucide-react";
import FadeInCard from "@/components/fade-in-card";
import Image from "next/image";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [incidentToView, setIncidentToView] = useState<Incident | null>(null);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    incidentDateTime: "",
    suspects: [] as string[],
    officers: [] as string[],
    otherIndividuals: [] as string[],
    description: "",
    mediaUrls: [] as string[]
  });

  // Input states for Add button functionality
  const [officerInput, setOfficerInput] = useState("");
  const [individualInput, setIndividualInput] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await mockGetSession();
      if (error || !session) {
        router.push("/login");
        return;
      }

      loadIncidents();
    };

    checkAuth();
  }, [router]);

  const loadIncidents = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setIncidents(getAllIncidents());
    } catch (error) {
      console.error("Error loading incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIncident = async () => {
    try {
      addIncident(
        formData.title,
        formData.incidentDateTime,
        formData.suspects,
        formData.officers,
        formData.otherIndividuals,
        formData.description,
        formData.mediaUrls
      );

      setIncidents(getAllIncidents());
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error("Error creating incident:", error);
    }
  };

  const handleUpdateIncident = async (id: string, updates: Partial<Incident>) => {
    try {
      const updated = updateIncident(id, updates);
      if (updated) {
        setIncidents(getAllIncidents());
      }
    } catch (error) {
      console.error("Error updating incident:", error);
    }
  };

  const handleDeleteIncident = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this incident?")) {
      try {
        deleteIncident(id);
        setIncidents(getAllIncidents());
      } catch (error) {
        console.error("Error deleting incident:", error);
      }
    }
  };

  const handleViewIncident = (incident: Incident) => {
    setIncidentToView(incident);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      incidentDateTime: "",
      suspects: [],
      officers: [],
      otherIndividuals: [],
      description: "",
      mediaUrls: []
    });
    setOfficerInput("");
    setIndividualInput("");
    setSelectedIncident(null);
    setIncidentToView(null);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
  };

  const handleEditIncident = (incident: Incident) => {
    setSelectedIncident(incident);
    setFormData({
      title: incident.title,
      incidentDateTime: incident.incidentDateTime,
      suspects: [...incident.suspects],
      officers: [...incident.officers],
      otherIndividuals: [...incident.otherIndividuals],
      description: incident.description,
      mediaUrls: [...incident.mediaUrls]
    });
    setOfficerInput("");
    setIndividualInput("");
    setIsEditModalOpen(true);
  };

  const handleUpdateIncidentInEdit = async () => {
    if (!selectedIncident) return;

    try {
      const updated = updateIncident(selectedIncident.id, {
        title: formData.title,
        incidentDateTime: formData.incidentDateTime,
        suspects: formData.suspects,
        officers: formData.officers,
        otherIndividuals: formData.otherIndividuals,
        description: formData.description,
        mediaUrls: formData.mediaUrls
      });

      if (updated) {
        setIncidents(getAllIncidents());
        setIsEditModalOpen(false);
        setSelectedIncident(null);
        resetForm();
      }
    } catch (error) {
      console.error("Error updating incident:", error);
    }
  };

  const getStatusColor = (status: Incident["status"]) => {
    switch (status) {
      case "open": return "bg-green-600";
      case "closed": return "bg-red-600";
      case "under_investigation": return "bg-orange-600";
      default: return "bg-gray-600";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Incidents</h1>
                <p className="text-gray-400">Manage and track incident reports</p>
              </div>

              <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Incident
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create New Incident</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-white">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Enter incident title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="incidentDateTime" className="text-white">Date & Time</Label>
                      <Input
                        id="incidentDateTime"
                        type="datetime-local"
                        value={formData.incidentDateTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, incidentDateTime: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-white">Suspects</Label>
                      <Select onValueChange={(value) => {
                        if (value && !formData.suspects.includes(value)) {
                          setFormData(prev => ({
                            ...prev,
                            suspects: [...prev.suspects, value]
                          }));
                        }
                      }}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Add suspect" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600 text-white">
                          {mockPlayers.map(player => (
                            <SelectItem key={player.id} value={player.name} className="text-white hover:bg-gray-700 focus:bg-gray-700">{player.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.suspects.map((suspect, index) => (
                          <Badge key={index} variant="secondary" className="bg-gray-600 text-white">
                            {suspect}
                            <button
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                suspects: prev.suspects.filter((_, i) => i !== index)
                              }))}
                              className="ml-2 text-xs hover:text-red-400"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-white">Officers</Label>
                      <div className="flex space-x-2">
                        <Input
                          value={officerInput}
                          onChange={(e) => setOfficerInput(e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Type officer name"
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            const newOfficer = officerInput.trim();
                            if (newOfficer && !formData.officers.includes(newOfficer)) {
                              setFormData(prev => ({
                                ...prev,
                                officers: [...prev.officers, newOfficer]
                              }));
                              setOfficerInput("");
                            }
                          }}
                          className="bg-blue-600 hover:bg-blue-700 px-3"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.officers.map((officer, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-600 text-white">
                            {officer}
                            <button
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                officers: prev.officers.filter((_, i) => i !== index)
                              }))}
                              className="ml-2 text-xs hover:text-red-400"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-white">Other Individuals</Label>
                      <div className="flex space-x-2">
                        <Input
                          value={individualInput}
                          onChange={(e) => setIndividualInput(e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Type individual name"
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            const newIndividual = individualInput.trim();
                            if (newIndividual && !formData.otherIndividuals.includes(newIndividual)) {
                              setFormData(prev => ({
                                ...prev,
                                otherIndividuals: [...prev.otherIndividuals, newIndividual]
                              }));
                              setIndividualInput("");
                            }
                          }}
                          className="bg-blue-600 hover:bg-blue-700 px-3"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.otherIndividuals.map((individual, index) => (
                          <Badge key={index} variant="secondary" className="bg-gray-600 text-white">
                            {individual}
                            <button
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                otherIndividuals: prev.otherIndividuals.filter((_, i) => i !== index)
                              }))}
                              className="ml-2 text-xs hover:text-red-400"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-white">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Enter detailed description of the incident"
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowCreateModal(false);
                          resetForm();
                        }}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateIncident}
                        disabled={!formData.title || !formData.description}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Create Incident
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Edit Incident Modal */}
              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-white">Edit Incident</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-title" className="text-white">Title</Label>
                      <Input
                        id="edit-title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Enter incident title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-incidentDateTime" className="text-white">Date & Time</Label>
                      <Input
                        id="edit-incidentDateTime"
                        type="datetime-local"
                        value={formData.incidentDateTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, incidentDateTime: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-white">Suspects</Label>
                      <Select onValueChange={(value) => {
                        if (value && !formData.suspects.includes(value)) {
                          setFormData(prev => ({
                            ...prev,
                            suspects: [...prev.suspects, value]
                          }));
                        }
                      }}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Add suspect" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600 text-white">
                          {mockPlayers.map(player => (
                            <SelectItem key={player.id} value={player.name} className="text-white hover:bg-gray-700 focus:bg-gray-700">{player.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.suspects.map((suspect, index) => (
                          <Badge key={index} variant="secondary" className="bg-gray-600 text-white">
                            {suspect}
                            <button
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                suspects: prev.suspects.filter((_, i) => i !== index)
                              }))}
                              className="ml-2 text-xs hover:text-red-400"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-white">Officers</Label>
                      <div className="flex space-x-2">
                        <Input
                          value={officerInput}
                          onChange={(e) => setOfficerInput(e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Type officer name"
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            const newOfficer = officerInput.trim();
                            if (newOfficer && !formData.officers.includes(newOfficer)) {
                              setFormData(prev => ({
                                ...prev,
                                officers: [...prev.officers, newOfficer]
                              }));
                              setOfficerInput("");
                            }
                          }}
                          className="bg-blue-600 hover:bg-blue-700 px-3"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.officers.map((officer, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-600 text-white">
                            {officer}
                            <button
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                officers: prev.officers.filter((_, i) => i !== index)
                              }))}
                              className="ml-2 text-xs hover:text-red-400"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-white">Other Individuals</Label>
                      <div className="flex space-x-2">
                        <Input
                          value={individualInput}
                          onChange={(e) => setIndividualInput(e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Type individual name"
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            const newIndividual = individualInput.trim();
                            if (newIndividual && !formData.otherIndividuals.includes(newIndividual)) {
                              setFormData(prev => ({
                                ...prev,
                                otherIndividuals: [...prev.otherIndividuals, newIndividual]
                              }));
                              setIndividualInput("");
                            }
                          }}
                          className="bg-blue-600 hover:bg-blue-700 px-3"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.otherIndividuals.map((individual, index) => (
                          <Badge key={index} variant="secondary" className="bg-gray-600 text-white">
                            {individual}
                            <button
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                otherIndividuals: prev.otherIndividuals.filter((_, i) => i !== index)
                              }))}
                              className="ml-2 text-xs hover:text-red-400"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="edit-description" className="text-white">Description</Label>
                      <Textarea
                        id="edit-description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Enter detailed description of the incident"
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditModalOpen(false);
                          setSelectedIncident(null);
                          resetForm();
                        }}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUpdateIncidentInEdit}
                        disabled={!formData.title || !formData.description}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Update Incident
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* View Incident Modal */}
              <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="bg-gray-800 border-gray-700 max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-white text-xl">Incident Details</DialogTitle>
                  </DialogHeader>

                  {incidentToView && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Title</h3>
                          <p className="text-white font-semibold text-lg">{incidentToView.title}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Status</h3>
                          <Badge className={`${getStatusColor(incidentToView.status)} text-white`}>
                            {incidentToView.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Date & Time</h3>
                          <p className="text-white">{formatDate(incidentToView.incidentDateTime)}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Created At</h3>
                          <p className="text-white">{formatDate(incidentToView.createdAt)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Suspects ({incidentToView.suspects.length})
                          </h3>
                          <div className="space-y-1">
                            {incidentToView.suspects.length > 0 ? (
                              incidentToView.suspects.map((suspect, index) => (
                                <div key={index} className="bg-gray-700 text-white px-3 py-1 rounded text-sm">
                                  {suspect}
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 text-sm">No suspects</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                            <UserCheck className="h-4 w-4 mr-2" />
                            Officers ({incidentToView.officers.length})
                          </h3>
                          <div className="space-y-1">
                            {incidentToView.officers.length > 0 ? (
                              incidentToView.officers.map((officer, index) => (
                                <div key={index} className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded text-sm border border-blue-600/30">
                                  {officer}
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 text-sm">No officers assigned</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Other Individuals ({incidentToView.otherIndividuals.length})
                          </h3>
                          <div className="space-y-1">
                            {incidentToView.otherIndividuals.length > 0 ? (
                              incidentToView.otherIndividuals.map((individual, index) => (
                                <div key={index} className="bg-gray-700 text-white px-3 py-1 rounded text-sm">
                                  {individual}
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 text-sm">No other individuals</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Description
                        </h3>
                        <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                          <p className="text-white whitespace-pre-wrap">{incidentToView.description}</p>
                        </div>
                      </div>

                      {incidentToView.mediaUrls && incidentToView.mediaUrls.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-2">Media Files</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {incidentToView.mediaUrls.map((url, index) => (
                              <div key={index} className="bg-gray-700 rounded-lg overflow-hidden">
                                <Image
                                  src={url}
                                  alt={`Incident media ${index + 1}`}
                                  width={96}
                                  height={96}
                                  className="w-full h-24 object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end space-x-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsViewModalOpen(false)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          Close
                        </Button>
                        <Button
                          onClick={() => {
                            setIsViewModalOpen(false);
                            handleEditIncident(incidentToView);
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Incident
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            {incidents.length === 0 ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-8 text-center">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No incidents yet</h3>
                  <p className="text-gray-400 mb-4">Create your first incident report to get started</p>
                  <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Incident
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {incidents.map((incident, index) => (
                  <FadeInCard key={incident.id} delay={index + 1}>
                    <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-white text-lg">{incident.title}</CardTitle>
                          <Badge className={`${getStatusColor(incident.status)} text-white`}>
                            {incident.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(incident.incidentDateTime)}
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-300">
                            <Users className="h-4 w-4 mr-2" />
                            <span className="font-medium">Suspects:</span>
                            <span className="ml-auto">
                              {incident.suspects.length > 0 ? incident.suspects.join(", ") : "None"}
                            </span>
                          </div>

                          <div className="flex items-center text-sm text-gray-300">
                            <UserCheck className="h-4 w-4 mr-2" />
                            <span className="font-medium">Officers:</span>
                            <span className="ml-auto">
                              {incident.officers.length > 0 ? incident.officers.join(", ") : "None"}
                            </span>
                          </div>

                          <div className="text-sm text-gray-400 line-clamp-3">
                            <FileText className="h-4 w-4 inline mr-1" />
                            {incident.description}
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewIncident(incident)}
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditIncident(incident)}
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteIncident(incident.id)}
                                className="border-red-600 text-red-400 hover:bg-red-600/20"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>

                            <Select
                              value={incident.status}
                              onValueChange={(value: Incident["status"]) =>
                                handleUpdateIncident(incident.id, { status: value })
                              }
                            >
                              <SelectTrigger className="w-32 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600 text-white">
                                <SelectItem value="open" className="text-white hover:bg-gray-700 focus:bg-gray-700">Open</SelectItem>
                                <SelectItem value="under_investigation" className="text-white hover:bg-gray-700 focus:bg-gray-700">Under Investigation</SelectItem>
                                <SelectItem value="closed" className="text-white hover:bg-gray-700 focus:bg-gray-700">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </FadeInCard>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}