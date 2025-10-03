"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { mockGetSession } from "@/lib/mock-auth";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Search, Download, Eye, Trash2, AlertCircle, Loader2, Link, X } from "lucide-react";
import { createWorker } from 'tesseract.js';
import Image from "next/image";
import { useNotification } from "@/components/notification-container";

interface OCRResult {
  id: string;
  fileName: string;
  extractedText: string;
  uploadDate: string;
  fileSize: number;
  processingTime: number;
  confidence: number;
  source: 'file' | 'url';
  imageUrl?: string;
}

export default function OCRTextFinderPage() {
  const { showError, showSuccess } = useNotification();
  const [results, setResults] = useState<OCRResult[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Validate file
  const validateFile = useCallback((file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      showError('Invalid file type. Please upload an image file (JPEG, PNG, GIF, WebP, or BMP).');
      return false;
    }

    if (file.size > maxSize) {
      showError('File size too large. Please upload an image smaller than 10MB.');
      return false;
    }

    return true;
  }, [showError]);

  // Real OCR processing function using Tesseract.js
  const processOCR = async (file: File, fileName?: string, source: 'file' | 'url' = 'file', sourceUrl?: string): Promise<OCRResult> => {
    const startTime = Date.now();

    try {
      const worker = await createWorker('eng');

      const { data: { text, confidence } } = await worker.recognize(file);

      await worker.terminate();

      const processingTime = Date.now() - startTime;

      return {
        id: Date.now().toString(),
        fileName: fileName || file.name,
        extractedText: text.trim() || "No text could be extracted from this image.",
        uploadDate: new Date().toISOString(),
        fileSize: file.size,
        processingTime,
        confidence: Math.round(confidence),
        source,
        imageUrl: sourceUrl
      };
    } catch (error) {
      console.error('OCR processing failed:', error);
      throw new Error('Failed to process image with OCR');
    }
  };

  // Process image from URL using server-side API
  const processImageFromUrl = async (url: string): Promise<OCRResult> => {
    try {
      // Use our server-side API to fetch the image
      const apiResponse = await fetch('/api/fetch-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: url }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Failed to fetch image via API');
      }

      const { dataUrl, contentType } = await apiResponse.json();

      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'url-image', { type: contentType });

      if (!validateFile(file)) {
        throw new Error('Invalid image from URL');
      }

      const fileName = `url-image-${Date.now()}.${contentType.split('/')[1]}`;
      return await processOCR(file, fileName, 'url', url);
    } catch (error) {
      console.error('API fetch failed:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to process image from URL. Please check the URL and try again.'
      );
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (validateFile(file)) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setImageUrl("");
      }
    }
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (imageFile) {
      if (validateFile(imageFile)) {
        setSelectedFile(imageFile);
        setPreviewUrl(URL.createObjectURL(imageFile));
        setImageUrl("");
        showSuccess(`Image "${imageFile.name}" uploaded successfully`);
      }
    } else {
      showError('Please drop a valid image file');
    }
  }, [showError, showSuccess, validateFile]);

  // URL input handler
  const handleUrlSubmit = async () => {
    if (!imageUrl.trim()) {
      showError('Please enter an image URL');
      return;
    }

    // Basic URL validation
    try {
      const url = new URL(imageUrl);
      if (!url.protocol.startsWith('http')) {
        showError('Please enter a valid HTTP or HTTPS URL');
        return;
      }
    } catch {
      showError('Please enter a valid URL (e.g., https://example.com/image.jpg)');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await processImageFromUrl(imageUrl);
      setResults(prev => [result, ...prev]);
      setImageUrl("");
      setPreviewUrl(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      showSuccess('Text extracted successfully from URL image');
    } catch (error) {
      console.error('URL OCR processing failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process image from URL';

      if (errorMessage.includes('CORS') || errorMessage.includes('cross-origin')) {
        showError(`${errorMessage}\n\nTry uploading the image directly if the URL doesn't work.`);
      } else {
        showError(errorMessage);
      }
    } finally {
      setIsProcessing(false);
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
      setImageUrl("");
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      showSuccess('Text extracted successfully from uploaded image');
    } catch (error) {
      console.error('OCR processing failed:', error);
      showError('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
      setIsAuthenticated(true);
    };

    checkAuth();
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <div className="h-8 bg-gray-700 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-64"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 border-gray-700 rounded-lg p-6">
                  <div className="h-6 bg-gray-700 rounded w-56 mb-4"></div>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                      <div className="w-12 h-12 bg-gray-700 rounded mx-auto mb-4"></div>
                      <div className="h-4 bg-gray-700 rounded w-48 mb-2 mx-auto"></div>
                      <div className="h-3 bg-gray-700 rounded w-32 mx-auto"></div>
                    </div>
                    <div className="h-10 bg-gray-700 rounded w-full"></div>
                  </div>
                </div>
                <div className="bg-gray-800 border-gray-700 rounded-lg p-6">
                  <div className="h-6 bg-gray-700 rounded w-48 mb-4"></div>
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="h-10 bg-gray-700 rounded w-full"></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div className="h-3 bg-gray-700 rounded w-20"></div>
                      <div className="h-3 bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 border-gray-700 rounded-lg p-6 mt-6">
                <div className="h-6 bg-gray-700 rounded w-48 mb-4"></div>
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="h-5 bg-gray-600 rounded w-40 mb-1"></div>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="h-3 bg-gray-600 rounded w-16"></div>
                          <div className="h-3 bg-gray-600 rounded w-4"></div>
                          <div className="h-3 bg-gray-600 rounded w-20"></div>
                          <div className="h-3 bg-gray-600 rounded w-4"></div>
                          <div className="w-24 h-5 bg-gray-600 rounded"></div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-6 h-6 bg-gray-600 rounded"></div>
                        <div className="w-6 h-6 bg-gray-600 rounded"></div>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded p-3">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-600 rounded w-full"></div>
                        <div className="h-4 bg-gray-600 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-600 rounded w-32"></div>
                  </div>
                </div>
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
                  {/* File Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragging
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className={`mx-auto h-12 w-12 mb-4 ${isDragging ? 'text-blue-400' : 'text-gray-400'}`} />
                      <p className={`${isDragging ? 'text-blue-400' : 'text-gray-400'} mb-2`}>
                        {isDragging ? 'Drop your image here' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-gray-500 text-sm">PNG, JPG, GIF, WebP, BMP up to 10MB</p>
                    </label>
                  </div>

                  {/* URL Input Section */}
                  <div className="space-y-2">
                    <label className="text-white font-medium flex items-center">
                      <Link className="mr-2 h-4 w-4" />
                      Or paste image URL:
                    </label>
                    <div className="flex space-x-2">
                      <Input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white flex-1"
                        disabled={isProcessing}
                      />
                      <Button
                        onClick={handleUrlSubmit}
                        disabled={isProcessing || !imageUrl.trim()}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-500 text-xs">
                        Supports direct image URLs (JPG, PNG, GIF, WebP, BMP)
                      </p>
                      <p className="text-gray-500 text-xs flex items-start">
                        <AlertCircle className="mr-1 h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span>
                          Uses server-side fetching to bypass CORS restrictions for most images.
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Preview Section */}
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
                          onClick={clearSelection}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Process Button */}
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
                              {result.source === 'url' && (
                                <Badge className="ml-2 bg-green-600 text-white text-xs">
                                  <Link className="mr-1 h-3 w-3" />
                                  URL
                                </Badge>
                              )}
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
                            {result.source === 'url' && result.imageUrl && (
                              <div className="mt-2">
                                <a
                                  href={result.imageUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 text-xs flex items-center"
                                >
                                  <Link className="mr-1 h-3 w-3" />
                                  Source URL
                                </a>
                              </div>
                            )}
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