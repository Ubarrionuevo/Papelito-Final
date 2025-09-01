'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { User, CreditCard, AlertCircle } from 'lucide-react';

interface ColorizationResult {
  original: string;
  colorized: string;
  timestamp: Date;
}

interface User {
  id: string;
  email: string;
  name?: string;
  credits: number;
}

export default function ColorizationApp() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ColorizationResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [showPricing, setShowPricing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const maxPixels = 4096 * 4096; // 4096x4096 pixels

  // Check if user is logged in on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('sketcha_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
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

  const handleAuth = useCallback(async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      const endpoint = authMode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const body = authMode === 'register' ? { email, name } : { email };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        setUser(result.data);
        localStorage.setItem('sketcha_user', JSON.stringify(result.data));
        setShowAuth(false);
        setError(null);
        setEmail('');
        setName('');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
  }, [authMode, email, name]);

  const pollForResults = useCallback(async (pollingUrl: string) => {
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes with 5 second intervals
    
    const poll = async (): Promise<void> => {
      try {
        const response = await fetch('/api/poll', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ polling_url: pollingUrl }),
        });

        if (!response.ok) {
          throw new Error('Error checking status');
        }

        const result = await response.json();
        
        if (result.status === 'completed' && result.result) {
          // Success! Add the result
          const newResult: ColorizationResult = {
            original: previewUrl!,
            colorized: result.result,
            timestamp: new Date(),
          };

          setResults(prev => [newResult, ...prev]);
          setSelectedFile(null);
          setPreviewUrl(null);
          setIsProcessing(false);
          
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          return;
        } else if (result.status === 'failed') {
          throw new Error(result.error || 'Error processing image');
        } else if (result.status === 'processing') {
          // Still processing, continue polling
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(poll, 5000); // Wait 5 seconds before next poll
          } else {
            throw new Error('Timeout. Image is taking longer than expected.');
          }
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error checking status');
        setIsProcessing(false);
      }
    };

    // Start polling
    poll();
  }, [previewUrl]);

  const processImage = useCallback(async () => {
    if (!selectedFile || !user) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('userId', user.id);

      const response = await fetch('/api/colorize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 402) {
          // Insufficient credits
          setShowPricing(true);
          setIsProcessing(false);
          return;
        }
        throw new Error(errorData.error || 'Error processing image');
      }

      const result = await response.json();
      
      if (result.success && result.data.status === 'submitted') {
        // Start polling for results
        await pollForResults(result.data.polling_url);
        
        // Update user credits in local state
        setUser(prev => prev ? { ...prev, credits: prev.credits - 1 } : null);
        if (user) {
          const updatedUser = { ...user, credits: user.credits - 1 };
          localStorage.setItem('sketcha_user', JSON.stringify(updatedUser));
        }
      } else {
        throw new Error('Unexpected API response');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsProcessing(false);
    }
  }, [selectedFile, user, pollForResults]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const input = fileInputRef.current;
      if (input) {
        input.files = event.dataTransfer.files;
        const syntheticEvent = {
          target: { files: event.dataTransfer.files }
        } as React.ChangeEvent<HTMLInputElement>;
        handleFileSelect(syntheticEvent);
      }
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('sketcha_user');
    setResults([]);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-gray-900 mb-4">
              AI Image Colorization
            </h1>
            <p className="text-gray-600">
              Get started with 1 free credit to colorize your first image
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-8">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-600">
                {authMode === 'login' 
                  ? 'Sign in to continue' 
                  : 'Start with 1 free credit'
                }
              </p>
            </div>

            <div className="space-y-4">
              {authMode === 'register' && (
                <input
                  type="text"
                  placeholder="Name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              )}
              
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />

              <button
                onClick={handleAuth}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>

              <div className="text-center">
                <button
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  {authMode === 'login' 
                    ? "Don't have an account? Sign up" 
                    : 'Already have an account? Sign in'
                  }
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with user info and credits */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-light text-gray-900">
              AI Image Colorization
            </h1>
            <p className="text-gray-600">
              Welcome back, {user.name || user.email}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  {user.credits} credit{user.credits !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Credit warning for new users */}
        {user.credits === 1 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-1">
                  Free Trial Credit
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  You have 1 free credit remaining. Purchase a plan to continue colorizing images.
                </p>
                <button
                  onClick={() => setShowPricing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  View Plans
                </button>
              </div>
            </div>
          </div>
        )}

        {/* File Upload Area */}
        <div className="bg-gray-50 rounded-xl p-8 mb-12">
          <div
            className={`border-2 border-dashed rounded-lg p-16 text-center transition-colors ${
              previewUrl ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {!previewUrl ? (
              <div>
                <div className="text-5xl mb-6">🎨</div>
                <h3 className="text-xl font-medium text-gray-700 mb-3">
                  Drop your image here or click to select
                </h3>
                <p className="text-gray-500 mb-6">
                  Supported formats: JPG, PNG, WEBP (max 10MB)
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Select Image
                </button>
              </div>
            ) : (
              <div>
                <div className="relative inline-block">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={180}
                    height={180}
                    className="rounded-lg object-cover"
                  />
                  <button
                    onClick={() => {
                      setPreviewUrl(null);
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  {selectedFile?.name}
                </p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {previewUrl && (
            <div className="mt-8 text-center">
              <button
                onClick={processImage}
                disabled={isProcessing || user.credits < 1}
                className={`px-8 py-4 rounded-lg font-medium text-lg transition-all ${
                  isProcessing || user.credits < 1
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : user.credits < 1 ? (
                  'Insufficient Credits'
                ) : (
                  '🎨 Colorize Image (1 credit)'
                )}
              </button>
              
              {user.credits < 1 && (
                <p className="text-sm text-gray-500 mt-2">
                  You need credits to process images. <button 
                    onClick={() => setShowPricing(true)}
                    className="text-red-600 hover:text-red-700 underline"
                  >
                    Purchase a plan
                  </button>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-8">
            <h2 className="text-2xl font-light text-gray-900 mb-8 text-center">
              Colorization Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Original</h4>
                      <Image
                        src={result.original}
                        alt="Original"
                        width={140}
                        height={140}
                        className="rounded-lg object-cover w-full"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Colorized</h4>
                      <Image
                        src={result.colorized}
                        alt="Colorized"
                        width={140}
                        height={140}
                        className="rounded-lg object-cover w-full"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    {result.timestamp.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Modal */}
        {showPricing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-medium text-gray-900">Choose Your Plan</h2>
                <button
                  onClick={() => setShowPricing(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Starter</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-2">$5<span className="text-lg text-gray-600">/month</span></div>
                  <div className="text-lg text-gray-700 mb-4">1000 Credits</div>
                  <ul className="space-y-2 text-sm text-gray-600 mb-6">
                    <li>• 1000 colorizations</li>
                    <li>• High resolution output</li>
                    <li>• Multiple export formats</li>
                  </ul>
                  <button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg transition-colors">
                    Coming Soon
                  </button>
                </div>
                
                <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Professional</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-2">$10<span className="text-lg text-gray-600"> one-time</span></div>
                  <div className="text-lg text-gray-700 mb-4">3000 Credits</div>
                  <ul className="space-y-2 text-sm text-gray-600 mb-6">
                    <li>• 3000 colorizations</li>
                    <li>• High resolution output</li>
                    <li>• Multiple export formats</li>
                  </ul>
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors">
                    Coming Soon
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 text-center">
                Payment integration coming soon! For now, you can use your free trial credit.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
