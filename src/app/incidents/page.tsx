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
import { Calendar, MapPin, Users, UserCheck, FileText, Plus, Edit, Trash2, AlertTriangle, Eye } from "lucide-react";
import FadeInCard from "@/components/fade-in-card";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
      const newIncident = addIncident(
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
    alert(`Incident Details:\n\nTitle: ${incident.title}\nDate: ${formatDate(incident.incidentDateTime)}\nStatus: ${incident.status.replace('_', ' ')}\n\nSuspects: ${incident.suspects.join(', ') || 'None'}\nOfficers: ${incident.officers.join(', ') || 'None'}\nOther Individuals: ${incident.otherIndividuals.join(', ') || 'None'}\n\nDescription: ${incident.description}`);
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
                        <SelectContent>
                          {mockPlayers.map(player => (
                            <SelectItem key={player.id} value={player.name}>{player.name}</SelectItem>
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
                      <Input
                        value={formData.officers.join(", ")}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (inputValue.endsWith(",")) {
                            const newOfficer = inputValue.slice(0, -1).trim().split(",").pop()?.trim();
                            if (newOfficer && !formData.officers.includes(newOfficer)) {
                              setFormData(prev => ({
                                ...prev,
                                officers: [...prev.officers, newOfficer]
                              }));
                            }
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              officers: inputValue.split(",").map(s => s.trim()).filter(Boolean)
                            }));
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const inputValue = (e.target as HTMLInputElement).value;
                            const newOfficer = inputValue.trim();
                            if (newOfficer && !formData.officers.includes(newOfficer)) {
                              setFormData(prev => ({
                                ...prev,
                                officers: [...prev.officers, newOfficer]
                              }));
                              (e.target as HTMLInputElement).value = "";
                            }
                          }
                        }}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Type officer name and press Enter"
                      />
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
                      <Input
                        value={formData.otherIndividuals.join(", ")}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (inputValue.endsWith(",")) {
                            const newIndividual = inputValue.slice(0, -1).trim().split(",").pop()?.trim();
                            if (newIndividual && !formData.otherIndividuals.includes(newIndividual)) {
                              setFormData(prev => ({
                                ...prev,
                                otherIndividuals: [...prev.otherIndividuals, newIndividual]
                              }));
                            }
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              otherIndividuals: inputValue.split(",").map(s => s.trim()).filter(Boolean)
                            }));
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const inputValue = (e.target as HTMLInputElement).value;
                            const newIndividual = inputValue.trim();
                            if (newIndividual && !formData.otherIndividuals.includes(newIndividual)) {
                              setFormData(prev => ({
                                ...prev,
                                otherIndividuals: [...prev.otherIndividuals, newIndividual]
                              }));
                              (e.target as HTMLInputElement).value = "";
                            }
                          }
                        }}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Type name and press Enter"
                      />
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
                        <SelectContent>
                          {mockPlayers.map(player => (
                            <SelectItem key={player.id} value={player.name}>{player.name}</SelectItem>
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
                      <Input
                        value={formData.officers.join(", ")}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (inputValue.endsWith(",")) {
                            const newOfficer = inputValue.slice(0, -1).trim().split(",").pop()?.trim();
                            if (newOfficer && !formData.officers.includes(newOfficer)) {
                              setFormData(prev => ({
                                ...prev,
                                officers: [...prev.officers, newOfficer]
                              }));
                            }
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              officers: inputValue.split(",").map(s => s.trim()).filter(Boolean)
                            }));
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const inputValue = (e.target as HTMLInputElement).value;
                            const newOfficer = inputValue.trim();
                            if (newOfficer && !formData.officers.includes(newOfficer)) {
                              setFormData(prev => ({
                                ...prev,
                                officers: [...prev.officers, newOfficer]
                              }));
                              (e.target as HTMLInputElement).value = "";
                            }
                          }
                        }}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Type officer name and press Enter"
                      />
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
                      <Input
                        value={formData.otherIndividuals.join(", ")}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (inputValue.endsWith(",")) {
                            const newIndividual = inputValue.slice(0, -1).trim().split(",").pop()?.trim();
                            if (newIndividual && !formData.otherIndividuals.includes(newIndividual)) {
                              setFormData(prev => ({
                                ...prev,
                                otherIndividuals: [...prev.otherIndividuals, newIndividual]
                              }));
                            }
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              otherIndividuals: inputValue.split(",").map(s => s.trim()).filter(Boolean)
                            }));
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const inputValue = (e.target as HTMLInputElement).value;
                            const newIndividual = inputValue.trim();
                            if (newIndividual && !formData.otherIndividuals.includes(newIndividual)) {
                              setFormData(prev => ({
                                ...prev,
                                otherIndividuals: [...prev.otherIndividuals, newIndividual]
                              }));
                              (e.target as HTMLInputElement).value = "";
                            }
                          }
                        }}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Type name and press Enter"
                      />
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
                              <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="under_investigation">Under Investigation</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
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