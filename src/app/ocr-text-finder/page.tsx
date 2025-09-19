"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { mockGetSession } from "@/lib/mock-auth";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Search, Download, Eye, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { createWorker } from 'tesseract.js';
import Image from "next/image";

interface OCRResult {
  id: string;
  fileName: string;
  extractedText: string;
  uploadDate: string;
  fileSize: number;
  processingTime: number;
  confidence: number;
}

export default function OCRTextFinderPage() {
  const [results, setResults] = useState<OCRResult[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Real OCR processing function using Tesseract.js
  const processOCR = async (file: File): Promise<OCRResult> => {
    const startTime = Date.now();

    try {
      const worker = await createWorker('eng');

      const { data: { text, confidence } } = await worker.recognize(file);

      await worker.terminate();

      const processingTime = Date.now() - startTime;

      return {
        id: Date.now().toString(),
        fileName: file.name,
        extractedText: text.trim() || "No text could be extracted from this image.",
        uploadDate: new Date().toISOString(),
        fileSize: file.size,
        processingTime,
        confidence: Math.round(confidence)
      };
    } catch (error) {
      console.error('OCR processing failed:', error);
      throw new Error('Failed to process image with OCR');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleProcessFile = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const result = await processOCR(selectedFile);
      setResults(prev => [result, ...prev]);
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('OCR processing failed:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteResult = (id: string) => {
    if (confirm('Are you sure you want to delete this OCR result?')) {
      setResults(prev => prev.filter(result => result.id !== id));
    }
  };

  const handleExportResult = (result: OCRResult) => {
    const blob = new Blob([result.extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ocr-${result.fileName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredResults = results.filter(result =>
    result.extractedText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-600 text-white';
    if (confidence >= 70) return 'bg-yellow-600 text-white';
    return 'bg-red-600 text-white';
  };

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await mockGetSession();
      if (error || !session) {
        router.push("/login");
        return;
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">OCR Text Finder</h1>
              <p className="text-gray-400">Extract text from images and search through scanned documents</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Section */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Image for OCR
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-400 mb-2">Click to upload or drag and drop</p>
                      <p className="text-gray-500 text-sm">PNG, JPG, GIF up to 10MB</p>
                    </label>
                  </div>

                  {previewUrl && (
                    <div className="space-y-2">
                      <h3 className="text-white font-medium">Preview:</h3>
                      <div className="relative">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          width={192}
                          height={192}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedFile && (
                    <Button
                      onClick={handleProcessFile}
                      disabled={isProcessing}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Extract Text
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Search Section */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Search className="mr-2 h-5 w-5" />
                    Search Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search extracted text..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white pl-10"
                    />
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>

                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Total Results: {results.length}</span>
                    <span>Filtered: {filteredResults.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            {filteredResults.length > 0 && (
              <Card className="bg-gray-800 border-gray-700 mt-6">
                <CardHeader>
                  <CardTitle className="text-white">Extracted Text Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredResults.map((result) => (
                      <div key={result.id} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-white font-medium flex items-center">
                              <FileText className="mr-2 h-4 w-4" />
                              {result.fileName}
                            </h3>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                              <span>{formatFileSize(result.fileSize)}</span>
                              <span>•</span>
                              <span>{formatDate(result.uploadDate)}</span>
                              <span>•</span>
                              <Badge className={getConfidenceColor(result.confidence)}>
                                {result.confidence}% confidence
                              </Badge>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExportResult(result)}
                              className="border-gray-600 text-gray-300 hover:bg-gray-600"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteResult(result.id)}
                              className="border-red-600 text-red-400 hover:bg-red-600/20"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="bg-gray-800 rounded p-3">
                          <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">
                            {result.extractedText}
                          </pre>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Processing time: {result.processingTime}ms
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {results.length === 0 && (
              <Card className="bg-gray-800 border-gray-700 mt-6">
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No OCR results yet</h3>
                  <p className="text-gray-400 mb-4">Upload an image to extract text using OCR technology</p>
                  <p className="text-gray-500 text-sm">
                    Supported formats: PNG, JPG, GIF. Maximum file size: 10MB
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}