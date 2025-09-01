'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';

interface ColorizationResult {
  original: string;
  colorized: string;
  timestamp: Date;
  prompt: string;
}

export default function ColorizationApp() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ColorizationResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('Apply realistic, natural colors to this sketch while maintaining the original style and details');
  const [hasUsedFreeAttempt, setHasUsedFreeAttempt] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxFileSize = 20 * 1024 * 1024; // 20MB (API limit)
  const maxPixels = 20 * 1024 * 1024; // 20 megapixels (API limit)

  // Check if user has already used their free attempt
  useEffect(() => {
    const usedAttempt = localStorage.getItem('sketcha_free_attempt_used');
    if (usedAttempt === 'true') {
      setHasUsedFreeAttempt(true);
    }
  }, []);

  // Convert file to base64 with proper error handling
  const fileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:image/...;base64, prefix to get just the base64 string
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  }, []);

  const validateImage = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const pixels = img.width * img.height;
        if (pixels > maxPixels) {
          setError(`Image is too large. Maximum ${maxPixels} pixels (${Math.sqrt(maxPixels)}x${Math.sqrt(maxPixels)}).`);
          resolve(false);
        } else {
          resolve(true);
        }
      };
      img.onerror = () => {
        setError('Error loading image. Please ensure it is a valid image file.');
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
      setError('Please select a valid image file (JPG, PNG, GIF).');
      return;
    }

    // Validate size
    if (file.size > maxFileSize) {
      setError(`File is too large. Maximum ${maxFileSize / (1024 * 1024)}MB.`);
      return;
    }

    // Validate dimensions
    const isValid = await validateImage(file);
    if (!isValid) return;

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, [validateImage, maxFileSize]);

  // Poll for results with proper error handling and retry logic
  const pollForResults = useCallback(async (pollingUrl: string, maxAttempts = 60): Promise<{ status: string; result?: { sample: string }; error?: string }> => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(pollingUrl, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'x-key': process.env.NEXT_PUBLIC_BFL_API_KEY || '',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.status === 'Ready') {
          return data;
        } else if (data.status === 'Processing') {
          setProcessingStatus(`Processing... Attempt ${attempt + 1}/${maxAttempts}`);
          // Wait 2 seconds before next attempt
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else if (data.status === 'Error' || data.status === 'Failed') {
          throw new Error(data.error || 'Processing failed');
        }
      } catch (err) {
        if (attempt === maxAttempts - 1) {
          throw err;
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    throw new Error('Processing timeout. Please try again.');
  }, []);

  const processImage = useCallback(async () => {
    if (!selectedFile) return;

    // Check if user has already used their free attempt
    if (hasUsedFreeAttempt) {
      setError('You have already used your free attempt. Please upgrade to continue.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProcessingStatus('Preparing image...');

    try {
      // Convert file to base64
      const imageBase64 = await fileToBase64(selectedFile);
      
      // Prepare request for FLUX Kontext API
      const requestBody = {
        prompt: prompt,
        input_image: imageBase64,
        aspect_ratio: "1:1",
        output_format: "jpeg"
      };

      setProcessingStatus('Sending to AI service...');

      const response = await fetch('/api/colorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to start processing');
      }

      setProcessingStatus('AI is processing your image...');

      // Poll for results
      const result = await pollForResults(data.data.polling_url);
      
      if (result.status === 'Ready' && result.result?.sample) {
        // Add result to the list
        const newResult: ColorizationResult = {
          original: previewUrl!,
          colorized: result.result.sample,
          timestamp: new Date(),
          prompt: prompt
        };
        setResults(prev => [newResult, ...prev]);

        // Mark free attempt as used
        localStorage.setItem('sketcha_free_attempt_used', 'true');
        setHasUsedFreeAttempt(true);
        
        setProcessingStatus('Complete!');
      } else {
        throw new Error('No result received from AI service');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(`Colorization failed: ${errorMessage}`);
      console.error('Colorization error:', err);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  }, [selectedFile, previewUrl, prompt, hasUsedFreeAttempt, pollForResults, fileToBase64]);

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
    setError(null);
    setResults([]);
  };

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

  // If user has used their free attempt, show blocked message
  if (hasUsedFreeAttempt && results.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Free Attempt Used!
          </h2>
          <p className="text-gray-600 mb-6">
            You have used your free attempt. The colorization feature is now locked.
          </p>
          <button
            onClick={resetFreeAttempt}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Reset (for testing)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
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
                  Supports JPG, PNG, GIF up to 20MB
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
                  />
                  <p className="text-xs text-gray-600 mt-1 font-medium">
                    Examples: &quot;Apply red and gold colors&quot;, &quot;Use pastel palette&quot;, &quot;Colorize with sunset orange and purple&quot;
                  </p>
                </div>
                
                <button
                  onClick={processImage}
                  disabled={isProcessing || hasUsedFreeAttempt}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : hasUsedFreeAttempt ? 'Free Attempt Used' : 'Colorize Image'}
                </button>

                {/* Processing Status */}
                {isProcessing && processingStatus && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm font-medium">{processingStatus}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
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
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Prompt used:</span> {result.prompt}
                      </p>
                    </div>
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
