"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { mockGetSession } from "@/lib/mock-auth";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, ExternalLink, Plus } from "lucide-react";
import FadeInCard from "@/components/fade-in-card";

interface Document {
  id: string;
  filename: string;
  url: string;
  isGoogleDoc: boolean;
  createdAt: string;
  description?: string;
}

const mockDocuments: Document[] = [
  {
    id: "1",
    filename: "Mission Brief - Operation Silent Night",
    url: "https://docs.google.com/document/d/example1",
    isGoogleDoc: true,
    createdAt: "2024-12-16T10:30:00Z",
    description: "Detailed mission brief for the stealth operation"
  },
  {
    id: "2",
    filename: "Player Evaluation - Shadow",
    url: "https://docs.google.com/document/d/example2",
    isGoogleDoc: true,
    createdAt: "2024-12-15T15:20:00Z",
    description: "Performance evaluation and skill assessment"
  },
  {
    id: "3",
    filename: "Equipment Manifest",
    url: "https://docs.google.com/document/d/example3",
    isGoogleDoc: true,
    createdAt: "2024-12-14T09:45:00Z",
    description: "Complete inventory of all equipment and assets"
  },
  {
    id: "4",
    filename: "Security Protocol v2.1",
    url: "https://docs.google.com/document/d/example4",
    isGoogleDoc: true,
    createdAt: "2024-12-13T14:15:00Z",
    description: "Updated security procedures and access controls"
  },
  {
    id: "5",
    filename: "Training Schedule Q4",
    url: "https://docs.google.com/document/d/example5",
    isGoogleDoc: true,
    createdAt: "2024-12-12T11:30:00Z",
    description: "Quarterly training program and schedule"
  },
  {
    id: "6",
    filename: "Asset Valuation Report",
    url: "https://docs.google.com/document/d/example6",
    isGoogleDoc: true,
    createdAt: "2024-12-11T16:00:00Z",
    description: "Current asset valuations and market analysis"
  }
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    const { data: { session }, error } = await mockGetSession();
    if (error || !session) {
      router.push("/login");
      return;
    }

    loadDocuments();
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const loadDocuments = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setDocuments(mockDocuments);
    } catch (error) {
      console.error("Error loading documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = () => {
    // In a real app, this would open a file upload dialog
    console.log("Upload document");
  };

  const handleLinkGoogleDoc = () => {
    // In a real app, this would open Google OAuth flow
    console.log("Link Google Doc");
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
                        <CardTitle className="text-white text-sm truncate">
                          {document.filename}
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
                    {document.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {document.description}
                      </p>
                    )}

                    <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                      <span>Created: {new Date(document.createdAt).toLocaleDateString()}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(document.url, '_blank')}
                      className="w-full bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open Document
                    </Button>
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
    </div>
  );
}