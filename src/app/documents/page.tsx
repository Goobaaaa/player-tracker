"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { mockGetSession } from "@/lib/mock-auth";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, ExternalLink, Plus, X, Trash2 } from "lucide-react";
import FadeInCard from "@/components/fade-in-card";
import { Document } from "@/lib/database";

// Mock documents data - made mutable for adding new documents
const mockDocuments: Document[] = [];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showGoogleDocModal, setShowGoogleDocModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [googleDocUrl, setGoogleDocUrl] = useState('');
  const [googleDocName, setGoogleDocName] = useState('');
  const [googleDocDescription, setGoogleDocDescription] = useState('');
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    const { data: { session }, error } = await mockGetSession();
    if (error || !session) {
      router.push("/login");
      return;
    }

    setIsAuthenticated(true);
    loadDocuments();
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const loadDocuments = async () => {
    try {
      // Make a copy of the mutable array
      setDocuments([...mockDocuments]);
    } catch (error) {
      console.error("Error loading documents:", error);
    }
  };

  const handleUpload = () => {
    setShowUploadModal(true);
  };

  const handleLinkGoogleDoc = () => {
    setShowGoogleDocModal(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        setUploadFile(file);
      } else {
        alert('Please select a valid file type (PDF, DOC, DOCX, XLS, XLSX)');
      }
    }
  };

  const handleFileUpload = () => {
    if (uploadFile) {
      // Use custom name if provided, otherwise use original filename
      const displayName = uploadFileName.trim() || uploadFile.name;

      const newDocument: Document = {
        id: Date.now().toString(),
        ownerUserId: "1", // Mock user ID
        filename: displayName,
        url: URL.createObjectURL(uploadFile), // In real app, this would be server URL
        isGoogleDoc: false,
        createdAt: new Date().toISOString(),
        description: uploadDescription.trim() || undefined,
        originalFilename: uploadFile.name
      };

      mockDocuments.push(newDocument);
      setDocuments([...mockDocuments]);
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadFileName('');
      setUploadDescription('');
      alert('Document uploaded successfully!');
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      const index = mockDocuments.findIndex(doc => doc.id === documentId);
      if (index !== -1) {
        mockDocuments.splice(index, 1);
        setDocuments([...mockDocuments]);
        alert('Document deleted successfully!');
      }
    }
  };

  const handleGoogleDocLink = () => {
    if (googleDocUrl.trim() && googleDocName.trim()) {
      // Validate Google Doc URL
      const isValidGoogleDocUrl = googleDocUrl.includes('docs.google.com/document');

      if (!isValidGoogleDocUrl) {
        alert('Please enter a valid Google Docs URL');
        return;
      }

      const newDocument: Document = {
        id: Date.now().toString(),
        ownerUserId: "1", // Mock user ID
        filename: googleDocName.trim(),
        url: googleDocUrl.trim(),
        isGoogleDoc: true,
        createdAt: new Date().toISOString(),
        description: googleDocDescription.trim() || undefined
      };

      mockDocuments.push(newDocument);
      setDocuments([...mockDocuments]);
      setShowGoogleDocModal(false);
      setGoogleDocUrl('');
      setGoogleDocName('');
      setGoogleDocDescription('');
      alert('Google Doc linked successfully!');
    } else {
      alert('Please fill in both URL and document name');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div className="h-8 bg-gray-700 rounded w-32"></div>
                <div className="flex space-x-2">
                  <div className="h-10 bg-gray-700 rounded w-32"></div>
                  <div className="h-10 bg-gray-700 rounded w-40"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-800 border-gray-700 rounded-lg p-6 animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-gray-700 rounded"></div>
                        <div className="h-5 bg-gray-700 rounded w-32"></div>
                      </div>
                      <div className="w-16 h-6 bg-gray-700 rounded"></div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-gray-700 rounded w-full"></div>
                      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-8 bg-gray-700 rounded flex-1"></div>
                      <div className="h-8 bg-gray-700 rounded w-8"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
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
              <h1 className="text-3xl font-bold text-white">Documents</h1>
              <div className="flex space-x-2">
                <Button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
                <Button onClick={handleLinkGoogleDoc} className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Link Google Doc
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((document, index) => (
                <FadeInCard key={document.id} delay={index + 1}>
                  <Card className="bg-gray-800 border-gray-700 transition-all-smooth hover:shadow-lg hover:border-blue-500 hover:scale-102">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-400" />
                        <CardTitle
                          className="text-white text-sm cursor-pointer group relative max-w-[200px]"
                          title={document.filename}
                        >
                          <span className="truncate block group-hover:whitespace-normal group-hover:break-words transition-all">
                            {document.filename}
                          </span>
                        </CardTitle>
                      </div>
                      {document.isGoogleDoc && (
                        <div className="px-2 py-1 bg-green-600 rounded text-xs text-white">
                          Google Doc
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {document.description && (
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {document.description}
                        </p>
                      )}
                      {document.originalFilename && document.originalFilename !== document.filename && (
                        <p className="text-gray-500 text-xs truncate">
                          Original: {document.originalFilename}
                        </p>
                      )}
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>Created: {new Date(document.createdAt).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          document.isGoogleDoc
                            ? 'bg-green-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}>
                          {document.isGoogleDoc ? 'Google Doc' : 'Uploaded'}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(document.url, '_blank')}
                        className="flex-1 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDocument(document.id)}
                        className="bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                </FadeInCard>
              ))}
            </div>

            {documents.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-400 text-lg">No documents found</p>
                <p className="text-gray-500 text-sm mt-2">Upload files or link Google Docs to get started</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div className="bg-gray-800 rounded-lg w-full max-w-md m-4 shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Upload Document</h3>
                <Button
                  variant="outline"
                  onClick={() => setShowUploadModal(false)}
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
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    className="w-full p-2 bg-gray-700 border-gray-600 text-white rounded-lg"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Supported formats: PDF, DOC, DOCX, XLS, XLSX
                  </p>
                </div>
                {uploadFile && (
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <p className="text-sm text-white">Selected: {uploadFile.name}</p>
                    <p className="text-xs text-gray-400">Size: {(uploadFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                )}
                {uploadFile && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Document Name (Optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter a custom name for this document"
                      value={uploadFileName}
                      onChange={(e) => setUploadFileName(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      If empty, original filename will be used
                    </p>
                  </div>
                )}
                {uploadFile && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description (Optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter a description for this document"
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                )}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setShowUploadModal(false)}
                    variant="outline"
                    className="flex-1 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleFileUpload}
                    disabled={!uploadFile}
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

      {/* Google Doc Link Modal */}
      {showGoogleDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
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
                    onClick={handleGoogleDocLink}
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
    </div>
  );
}