'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { AlertCircle, Lock, X } from 'lucide-react';

interface ColorizationResult {
  original: string;
  colorized: string;
  timestamp: Date;
}

export default function ColorizationApp() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ColorizationResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [hasUsedFreeAttempt, setHasUsedFreeAttempt] = useState(false);
  const [prompt, setPrompt] = useState<string>('Apply realistic, natural colors to this sketch while maintaining the original style and details');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Predefined prompts for colorization
  const predefinedPrompts = [
    {
      name: "Natural Colors",
      prompt: "Apply realistic, natural colors to this sketch while maintaining the original style and details",
      description: "Realistic and natural color palette"
    },
    {
      name: "Warm Theme",
      prompt: "Use warm, golden color palette with orange, yellow, and warm brown tones",
      description: "Sunset and warm atmosphere"
    },
    {
      name: "Cool Theme",
      prompt: "Apply cool, blue-based colors with greens, purples, and cool grays",
      description: "Cool and calm atmosphere"
    },
    {
      name: "Vibrant Style",
      prompt: "Use bright, saturated colors with high contrast and vivid tones",
      description: "Bright and energetic colors"
    },
    {
      name: "Moody Atmosphere",
      prompt: "Apply dark, atmospheric colors with deep shadows and moody tones",
      description: "Dark and dramatic mood"
    },
    {
      name: "Anime Style",
      prompt: "Colorize with vibrant anime-style colors, bright and cheerful palette",
      description: "Bright anime character colors"
    }
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const maxPixels = 4096 * 4096; // 4096x4096 pixels

  // Convert file to base64 with data URL prefix
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Check if user has already used their free attempt
  useEffect(() => {
    const usedAttempt = localStorage.getItem('sketcha_free_attempt_used');
    if (usedAttempt === 'true') {
      setHasUsedFreeAttempt(true);
    }
  }, []);

  const validateImage = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const pixels = img.width * img.height;
        if (pixels > maxPixels) {
          setError(`Image is too large. Maximum ${maxPixels} pixels.`);
          resolve(false);
        } else {
          resolve(true);
        }
      };
      img.onerror = () => {
        setError('Error loading image. Please ensure it\'s a valid file.');
        resolve(false);
      };
      img.src = URL.createObjectURL(file);
    });
  }, [maxPixels]);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    // Validate size
    if (file.size > maxFileSize) {
      setError('File is too large. Maximum 10MB.');
      return;
    }

    // Validate dimensions
    const isValid = await validateImage(file);
    if (!isValid) return;

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, [validateImage, maxFileSize]);

  const processImage = useCallback(async () => {
    if (!selectedFile) return;

    // Check if user has already used their free attempt
    if (hasUsedFreeAttempt) {
      setShowPricingModal(true);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Convert file to base64 with data URL prefix
      const imageBase64 = await fileToBase64(selectedFile);
      
      const response = await fetch('/api/colorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          image: imageBase64,
          aspect_ratio: "1:1"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process image');
      }

      const data = await response.json();
      
      // Mark free attempt as used
      localStorage.setItem('sketcha_free_attempt_used', 'true');
      setHasUsedFreeAttempt(true);

      // Poll for results
      await pollForResults(data.data.id, data.data.polling_url);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, hasUsedFreeAttempt, prompt, pollForResults]);

  const pollForResults = async (jobId: string, pollingUrl: string) => {
    try {
      // Poll directly using the polling_url from Flux Kontext API
      const response = await fetch(pollingUrl, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'x-key': process.env.NEXT_PUBLIC_BFL_API_KEY || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check status');
      }

      const data = await response.json();
      
      if (data.status === 'Ready') {
        // Add result to the list
        const newResult: ColorizationResult = {
          original: previewUrl!,
          colorized: data.result.sample,
          timestamp: new Date(),
        };
        setResults(prev => [newResult, ...prev]);
        
        // Show pricing modal after successful colorization
        setTimeout(() => {
          setShowPricingModal(true);
        }, 2000); // Show after 2 seconds
      } else if (data.status === 'Processing') {
        // Continue polling
        setTimeout(() => pollForResults(jobId, pollingUrl), 2000);
      } else if (data.status === 'Error' || data.status === 'Failed') {
        throw new Error(data.error || 'Processing failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get results');
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setError(null);
      } else {
        setError('Please drop a valid image file.');
      }
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const resetFreeAttempt = () => {
    localStorage.removeItem('sketcha_free_attempt_used');
    setHasUsedFreeAttempt(false);
    setShowPricingModal(false);
  };

  // If user has used their free attempt, show pricing modal
  if (hasUsedFreeAttempt && !showPricingModal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Free Trial Complete!
          </h2>
          <p className="text-gray-600 mb-6">
            You&apos;ve used your free attempt. Upgrade to continue colorizing images!
          </p>
          <button
            onClick={() => setShowPricingModal(true)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            View Pricing Plans
          </button>
          <button
            onClick={resetFreeAttempt}
            className="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm"
          >
            Reset (for testing)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Choose Your Plan
                </h2>
                <button
                  onClick={() => setShowPricingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Starter Plan */}
                <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Starter</h3>
                    <div className="text-3xl font-bold text-gray-900 mb-1">$5</div>
                    <div className="text-gray-500 mb-4">/month</div>
                    <div className="text-lg font-medium text-gray-900 mb-4">1000 Credits</div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      1000 colorizations
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      High resolution output
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Commercial usage rights
                    </li>
                  </ul>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium">
                    Coming Soon
                  </button>
                </div>

                {/* Professional Plan */}
                <div className="border-2 border-orange-500 rounded-xl p-6 hover:shadow-lg transition-shadow relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Best Value
                    </span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional</h3>
                    <div className="text-3xl font-bold text-gray-900 mb-1">$10</div>
                    <div className="text-gray-500 mb-4">one-time</div>
                    <div className="text-lg font-medium text-gray-900 mb-4">3000 Credits</div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      3000 colorizations
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      High resolution output
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Commercial usage rights
                    </li>
                  </ul>
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition-colors">
                    Coming Soon
                  </button>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Payment integration coming soon! For now, you can continue testing with the reset button.
                </p>
                <button
                  onClick={resetFreeAttempt}
                  className="mt-4 text-orange-500 hover:text-orange-600 text-sm font-medium"
                >
                  Reset Free Attempt (for testing)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Image Colorization
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Transform your black and white images with intelligent AI colorization
          </p>
          
          {!hasUsedFreeAttempt && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-orange-800">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">1 Free Attempt Included!</span>
              </div>
              <p className="text-orange-700 text-sm mt-1">
                Try our AI colorization for free. No registration required.
              </p>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              selectedFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-orange-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {!previewUrl ? (
              <div>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop your image here or click to browse
                </p>
                <p className="text-gray-500 mb-4">
                  Supports JPG, PNG, GIF up to 10MB
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Choose File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div>
                <div className="relative inline-block mb-4">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setError(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
                                 <p className="text-green-600 font-medium mb-4">
                   Image selected successfully!
                 </p>
                 
                 {/* Prompt Input */}
                 <div className="mb-4 text-left">
                   <label className="block text-sm font-bold text-gray-900 mb-2">
                     How would you like to colorize this image?
                   </label>
                   
                   {/* Predefined Prompts */}
                   <div className="mb-3">
                     <p className="text-xs text-gray-600 mb-2 font-medium">Quick options:</p>
                     <div className="grid grid-cols-2 gap-2">
                       {predefinedPrompts.map((option, index) => (
                         <button
                           key={index}
                           onClick={() => setPrompt(option.prompt)}
                           className={`text-xs px-3 py-2 rounded-lg border transition-colors ${
                             prompt === option.prompt
                               ? 'bg-orange-500 text-white border-orange-500'
                               : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                           }`}
                           title={option.description}
                         >
                           {option.name}
                         </button>
                       ))}
                     </div>
                   </div>
                   
                   <textarea
                     value={prompt}
                     onChange={(e) => setPrompt(e.target.value)}
                     placeholder="Or write your own custom instructions..."
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500 bg-white"
                     rows={3}
                     style={{
                       color: '#111827',
                       '::placeholder': { color: '#6B7280' }
                     }}
                   />
                                   <p className="text-xs text-gray-600 mt-1 font-medium">
                  Examples: &quot;Apply red and gold colors&quot;, &quot;Use pastel palette&quot;, &quot;Colorize with sunset orange and purple&quot;
                </p>
                 </div>
                 
                 <button
                   onClick={processImage}
                   disabled={isProcessing}
                   className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                 >
                   {isProcessing ? 'Processing...' : 'Colorize Image'}
                 </button>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error:</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Colorization Results</h3>
              <div className="grid gap-6">
                {results.map((result, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Original</h4>
                        <Image
                          src={result.original}
                          alt="Original"
                          width={300}
                          height={300}
                          className="rounded-lg object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Colorized</h4>
                        <Image
                          src={result.colorized}
                          alt="Colorized"
                          width={300}
                          height={300}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      Processed on {result.timestamp.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
