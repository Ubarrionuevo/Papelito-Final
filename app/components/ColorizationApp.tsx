'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ColorizationResult } from '../../types/api';
import { analytics } from '../utils/analytics';

export default function ColorizationApp() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ColorizationResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('Apply realistic, natural colors to this sketch while maintaining the original style and details');
  const [userCredits, setUserCredits] = useState<number>(0);
  const [userPlan, setUserPlan] = useState<string>('free');
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [showResultModal, setShowResultModal] = useState(false);
  const [currentResult, setCurrentResult] = useState<ColorizationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxFileSize = 20 * 1024 * 1024; // 20MB (API limit)
  const maxPixels = 20 * 1024 * 1024; // 20 megapixels (API limit)

  const loadUserCredits = useCallback(async () => {
    try {
      // Generate a simple user ID based on browser fingerprint
      const userId = generateUserId();
      
      const response = await fetch(`/api/credits?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserCredits(data.credits);
        setUserPlan(data.plan);
        console.log(`📊 User credits loaded: ${data.credits} credits (${data.plan} plan)`);
        
        // Track free trial usage
        if (data.plan === 'free' && data.credits === 1) {
          analytics.freeTrialUsed();
        }
      }
    } catch (error) {
      console.error('Failed to load user credits:', error);
      // Fallback to free plan
      setUserCredits(1);
      setUserPlan('free');
    } finally {
      setIsLoadingCredits(false);
    }
  }, []);

  const generateUserId = () => {
    // Try to get existing user ID from localStorage
    let userId = localStorage.getItem('sketcha_user_id');
    
    if (!userId) {
      // Generate a new user ID based on browser fingerprint
      const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset()
      ].join('|');
      
      // Simple hash function
      let hash = 0;
      for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      
      userId = 'user_' + Math.abs(hash).toString(36);
      localStorage.setItem('sketcha_user_id', userId);
    }
    
    return userId;
  };

  // Load user credits on component mount
  useEffect(() => {
    loadUserCredits();
    analytics.appOpened(); // Track when user opens the app
  }, [loadUserCredits]);

  const deductCredit = useCallback(async () => {
    try {
      const userId = generateUserId();
      
      const response = await fetch('/api/credits', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          creditsToDeduct: 1
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserCredits(data.credits);
        console.log(`💳 Credit deducted. Remaining: ${data.credits}`);
        
        // Track credit usage
        analytics.creditUsed(data.credits);
      } else {
        console.error('Failed to deduct credit');
      }
    } catch (error) {
      console.error('Error deducting credit:', error);
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

  // Poll for results through our API proxy to avoid CORS
  const pollForResults = useCallback(async (pollingUrl: string, maxAttempts = 30): Promise<{ status: string; result?: { sample: string }; error?: string }> => {
    console.log('🔄 Polling URL:', pollingUrl);
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt + 1}/${maxAttempts} - Polling through proxy (CREDIT-FRIENDLY)`);
        
        // Use our API route instead of direct polling to avoid CORS
        const response = await fetch('/api/poll-result', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pollingUrl }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('🔄 Polling response:', data);

        if (data.status === 'Ready') {
          console.log(`✅ Image ready after ${attempt + 1} attempts! (Total credits used: 1)`);
          console.log('🎨 FLUX Result data:', data);
          console.log('🖼️ Image URL:', data.result?.sample);
          console.log('🔍 Full result object:', data.result);
          console.log('📋 All available fields:', Object.keys(data));
          return data;
        } else if (data.status === 'Processing' || data.status === 'Pending') {
          setProcessingStatus(`Processing... Attempt ${attempt + 1}/${maxAttempts} (Credit-friendly polling)`);
          
          // CREDIT-FRIENDLY POLLING: Much longer waits to minimize credit consumption
          let waitTime = 2000; // Start with 2 seconds (more patient)
          
          if (attempt < 2) {
            waitTime = 3000; // First 2 attempts: wait 3 seconds (very patient)
          } else if (attempt < 5) {
            waitTime = 2000; // Next 3 attempts: wait 2 seconds
          } else if (attempt < 10) {
            waitTime = 3000; // Next 5 attempts: wait 3 seconds (slower)
          } else {
            waitTime = 5000; // After 10 attempts: wait 5 seconds (very slow)
          }
          
          console.log(`⏳ Waiting ${waitTime}ms before next attempt... (Minimizing credit usage)`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else if (data.status === 'Error' || data.status === 'Failed') {
          throw new Error(data.error || 'Processing failed');
        }
      } catch (error) {
        console.error(`❌ Polling attempt ${attempt + 1} failed:`, error);
        
        if (attempt === maxAttempts - 1) {
          throw error;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    throw new Error('Polling timeout - image processing took too long');
  }, []);

  const processImage = useCallback(async () => {
    if (!selectedFile || !previewUrl) return;
    
    // Check if user has credits available
    if (userCredits <= 0) {
      setError('You have no credits remaining. Please purchase a plan to continue.');
      return;
    }

    // Check if prompt is provided
    if (!prompt || prompt.trim().length === 0) {
      setError('Please enter a description for your image colorization.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProcessingStatus('Converting image...');
    
    // Track colorization start
    analytics.colorizationStarted();

    try {
      // Convert file to base64
      const base64Image = await fileToBase64(selectedFile);
      setProcessingStatus('Sending to AI...');

      // Prepare request for FLUX Kontext API
      const requestData = {
        prompt: prompt,
        input_image: base64Image,
        aspect_ratio: '1:1',
        output_format: 'jpeg'
      };

      const response = await fetch('/api/colorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process image');
      }

      const data = await response.json();
      setProcessingStatus('Processing with AI...');

      // Poll for results
      const result = await pollForResults(data.data.polling_url);
      
      if (result.status === 'Ready' && result.result?.sample) {
        // Add result to the list
        console.log('🔍 Creating result object:', {
          original: previewUrl,
          colorized: result.result.sample,
          resultStructure: result
        });
        
        // Validate the image URL
        const imageUrl = result.result.sample;
        console.log('🔗 Image URL validation:', {
          url: imageUrl,
          isValid: imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('http'),
          length: imageUrl?.length
        });
        
        const newResult: ColorizationResult = {
          original: previewUrl,
          colorized: imageUrl,
          timestamp: new Date(),
          prompt: prompt
        };
        
        console.log('✅ Final result object:', newResult);
        
        setResults(prev => [newResult, ...prev]);
        setCurrentResult(newResult);
        setShowResultModal(true);
        
        // Deduct 1 credit after successful processing
        await deductCredit();
        setProcessingStatus('Complete!');
        
        // Track successful colorization
        analytics.colorizationCompleted();
      }
    } catch (error) {
      console.error('Colorization error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during colorization');
      
      // Track error
      analytics.errorOccurred('colorization_failed');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  }, [selectedFile, previewUrl, prompt, userCredits, pollForResults, deductCredit, fileToBase64]);

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
        setError('Please select a valid image file.');
      }
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  // Predefined prompts for colorization
  const predefinedPrompts = [
    {
      name: 'Natural Colors',
      prompt: 'Apply realistic, natural colors to this sketch while maintaining the original style and details',
      description: 'Perfect for landscapes and portraits'
    },
    {
      name: 'Vibrant Style',
      prompt: 'Use bright, vibrant colors to make this sketch pop with energy and excitement',
      description: 'Great for cartoons and illustrations'
    },
    {
      name: 'Professional Look',
      prompt: 'Apply professional, polished colors suitable for business presentations and formal use',
      description: 'Ideal for corporate materials'
    },
    {
      name: 'Artistic Interpretation',
      prompt: 'Create an artistic color interpretation that adds depth and emotion to this sketch',
      description: 'Perfect for creative projects'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-4">
          AI-Powered Image Colorization
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
          Transform your black and white sketches into vibrant, colored masterpieces using advanced artificial intelligence.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* File Upload Area */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Your Image</h2>
          
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              previewUrl ? 'border-orange-300 bg-orange-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {previewUrl ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="rounded-lg object-contain max-h-48"
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
                <p className="text-sm text-gray-600">Image ready for colorization</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">Drop your image here</p>
                  <p className="text-sm text-gray-500">or click to browse</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Choose File
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <label htmlFor="prompt" className="block text-sm font-bold text-gray-900 mb-2">
            Colorization Instructions
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
            placeholder="Or write your own custom instructions..."
            style={{ color: '#111827' }}
          />
          
          {/* Predefined Prompts */}
          <div className="mt-4">
            <p className="text-xs text-gray-600 mb-2 font-medium">Quick prompts:</p>
            <div className="flex flex-wrap gap-2">
              {predefinedPrompts.map((promptOption, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(promptOption.prompt)}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                >
                  {promptOption.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Processing Status */}
        {processingStatus && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-blue-700 font-medium">{processingStatus}</p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Colorized Images</h2>
            <div className="grid gap-4">
              {results.map((result, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Original</h3>
                      <Image
                        src={result.original}
                        alt="Original"
                        width={200}
                        height={200}
                        className="rounded-lg object-contain w-full h-auto"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Colorized</h3>
                      <Image
                        src={result.colorized}
                        alt="Colorized"
                        width={200}
                        height={200}
                        className="rounded-lg object-contain w-full h-auto"
                      />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p><strong>Prompt:</strong> {result.prompt}</p>
                    <p><strong>Processed:</strong> {result.timestamp.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Credits Display */}
        {!isLoadingCredits && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    {userCredits} {userCredits === 1 ? 'Credit' : 'Credits'} Available
                  </p>
                  <p className="text-xs text-blue-700 capitalize">
                    {userPlan} Plan
                  </p>
                </div>
              </div>
              {userCredits === 0 && (
                <button
                  onClick={() => window.location.href = '/#pricing'}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Buy Credits
                </button>
              )}
            </div>
          </div>
        )}

        {/* If user has no credits, show blocked message */}
        {!isLoadingCredits && userCredits <= 0 && !showResultModal && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-yellow-900 mb-2">No Credits Remaining!</h3>
            <p className="text-yellow-700 mb-4">
              You&apos;ve used all your available credits. Purchase a plan to continue creating amazing colored images!
            </p>
            <button
              onClick={() => window.location.href = '/#pricing'}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View Pricing Plans
            </button>
          </div>
        )}

        {/* Process Button */}
        {!isLoadingCredits && userCredits > 0 && selectedFile && previewUrl && (
          <div className="text-center">
            <button
              onClick={processImage}
              disabled={isProcessing}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-8 py-3 rounded-full font-bold text-lg transition-colors shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                'Colorize Image'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Result Modal */}
      {showResultModal && currentResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">🎨 Colorization Complete!</h2>
              <button
                onClick={() => setShowResultModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Prompt Used */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Prompt Used:</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border">
                  {currentResult.prompt}
                </p>
              </div>

              {/* Images Comparison */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Original Image */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-center">Original Image</h4>
                  <div className="bg-gray-100 rounded-lg p-2">
                    <Image
                      src={currentResult.original}
                      alt="Original"
                      width={400}
                      height={400}
                      className="rounded-lg object-contain w-full h-auto"
                    />
                  </div>
                </div>

                {/* Colorized Image */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-center">Colorized Result</h4>
                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-2 border-2 border-orange-200">
                    {currentResult.colorized ? (
                      <img
                        src={currentResult.colorized}
                        alt="Colorized"
                        className="rounded-lg object-contain w-full h-auto max-h-96"
                        onError={(e) => {
                          console.error('❌ Error loading colorized image:', currentResult.colorized);
                          console.error('Image error:', e);
                        }}
                        onLoad={() => {
                          console.log('✅ Colorized image loaded successfully:', currentResult.colorized);
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                        <div className="text-center">
                          <div className="text-gray-500 mb-2">⚠️</div>
                          <p className="text-gray-500">Image URL not available</p>
                          <p className="text-xs text-gray-400 mt-1">Check console for details</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Processing Info */}
              <div className="text-center text-sm text-gray-500 mb-6">
                Processed on {currentResult.timestamp.toLocaleString()}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={async () => {
                    try {
                      // Download colorized image properly
                      const response = await fetch(currentResult.colorized);
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `colorized-image-${Date.now()}.jpg`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error('Error downloading image:', error);
                      // Fallback: open in new tab
                      window.open(currentResult.colorized, '_blank');
                    }
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Result
                </button>
                
                <button
                  onClick={() => setShowResultModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
