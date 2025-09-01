"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, Download, RotateCcw, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ColorizationResult {
  id: string;
  status: "pending" | "processing" | "ready" | "error";
  inputImage: string;
  outputImage?: string;
  prompt: string;
  error?: string;
}

export default function ColorizationApp() {
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<ColorizationResult[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState("Colorize this sketch naturally with vibrant colors");

  // Convert image to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Validate file - CORREGIDO: ahora retorna Promise<boolean>
  const validateFile = async (file: File): Promise<boolean> => {
    const maxSize = 20 * 1024 * 1024; // 20MB
    const maxPixels = 20 * 1000000; // 20MP
    
    if (file.size > maxSize) {
      alert("File size must be less than 20MB");
      return false;
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const pixels = img.width * img.height;
        if (pixels > maxPixels) {
          alert("Image dimensions must be less than 20 megapixels");
          resolve(false);
        } else {
          resolve(true);
        }
      };
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle file upload - CORREGIDO: ahora usa useCallback
  const handleFileUpload = useCallback(async (file: File) => {
    if (!(await validateFile(file))) return;

    setIsUploading(true);
    try {
      const base64Image = await convertToBase64(file);
      const base64Data = base64Image.split(',')[1]; // Remove data:image/...;base64, prefix
      
      const newResult: ColorizationResult = {
        id: Date.now().toString(),
        status: "pending",
        inputImage: base64Image,
        prompt: prompt
      };

      setResults(prev => [newResult, ...prev]);
      await processImage(newResult.id, base64Data);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  }, [prompt]);

  // Process image with Flux Kontext API
  const processImage = async (resultId: string, base64Data: string) => {
    try {
      const response = await fetch('/api/colorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          input_image: base64Data,
          aspect_ratio: "1:1",
          output_format: "jpeg",
          safety_tolerance: 2
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      // Start polling
      pollForResult(resultId, data.polling_url);
    } catch (error) {
      console.error("Processing error:", error);
      setResults(prev => prev.map(r => 
        r.id === resultId 
          ? { ...r, status: "error", error: "Failed to process image" }
          : r
      ));
    }
  };

  // Poll for result
  const pollForResult = async (resultId: string, pollingUrl: string) => {
    setResults(prev => prev.map(r => 
      r.id === resultId ? { ...r, status: "processing" } : r
    ));

    const poll = async () => {
      try {
        const response = await fetch('/api/poll', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ polling_url: pollingUrl }),
        });

        if (!response.ok) {
          throw new Error('Polling failed');
        }

        const data = await response.json();
        
        if (data.status === "Ready") {
          setResults(prev => prev.map(r => 
            r.id === resultId 
              ? { ...r, status: "ready", outputImage: data.result.sample }
              : r
          ));
        } else if (data.status === "Error" || data.status === "Failed") {
          setResults(prev => prev.map(r => 
            r.id === resultId 
              ? { ...r, status: "error", error: data.error || "Processing failed" }
              : r
          ));
        } else {
          // Continue polling
          setTimeout(poll, 500);
        }
      } catch (error) {
        console.error("Polling error:", error);
        setResults(prev => prev.map(r => 
          r.id === resultId 
            ? { ...r, status: "error", error: "Polling failed" }
            : r
        ));
      }
    };

    poll();
  };

  // Handle drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, [handleFileUpload]);

  // Handle file input change
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // Download result
  const downloadResult = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download error:", error);
      alert("Error downloading image");
    }
  };

  // Retry processing
  const retryProcessing = async (resultId: string) => {
    const result = results.find(r => r.id === resultId);
    if (result && result.inputImage) {
      const base64Data = result.inputImage.split(',')[1];
      await processImage(resultId, base64Data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Sketcha
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Colorization Studio
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your black and white sketches into vibrant, colorful masterpieces using advanced AI technology
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Upload Your Sketch
            </h2>
            <p className="text-gray-600">
              Drag and drop your image or click to browse. Supports JPG, PNG up to 20MB.
            </p>
          </div>

          {/* Prompt Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Colorization Instructions
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe how you want the image to be colored..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            
            <div className="space-y-4">
              <Upload className="mx-auto h-16 w-16 text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isUploading ? 'Uploading...' : 'Drop your image here'}
                </p>
                <p className="text-gray-600">
                  or{' '}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    browse files
                  </button>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 mb-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* Input Image */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Original Sketch</h3>
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={result.inputImage}
                      alt="Original sketch"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Output Image */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Colored Result</h3>
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {result.status === "pending" && (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
                          <p className="text-gray-500">Queued for processing...</p>
                        </div>
                      </div>
                    )}
                    
                    {result.status === "processing" && (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
                          <p className="text-gray-500">Processing with AI...</p>
                        </div>
                      </div>
                    )}
                    
                    {result.status === "ready" && result.outputImage && (
                      <>
                        <Image
                          src={result.outputImage}
                          alt="Colored result"
                          fill
                          className="object-contain"
                        />
                        <button
                          onClick={() => downloadResult(result.outputImage!, `colored-${result.id}.jpg`)}
                          className="absolute top-2 right-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                          title="Download result"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    
                    {result.status === "error" && (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-red-600">
                          <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                          <p className="font-medium">Processing failed</p>
                          <p className="text-sm">{result.error}</p>
                          <button
                            onClick={() => retryProcessing(result.id)}
                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            <RotateCcw className="h-4 w-4 inline mr-1" />
                            Retry
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {result.status === "pending" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1 animate-pulse"></div>
                      Queued
                    </span>
                  )}
                  {result.status === "processing" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-1 animate-pulse"></div>
                      Processing
                    </span>
                  )}
                  {result.status === "ready" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 w-3 mr-1" />
                      Ready
                    </span>
                  )}
                  {result.status === "error" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <AlertCircle className="w-3 w-3 mr-1" />
                      Error
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-gray-500">
                  Prompt: &ldquo;{result.prompt}&rdquo;
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {results.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No images uploaded yet
            </h3>
            <p className="text-gray-500">
              Upload your first sketch to see the magic happen!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
