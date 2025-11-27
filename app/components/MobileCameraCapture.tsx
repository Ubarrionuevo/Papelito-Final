'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, X, RotateCcw } from 'lucide-react';
import Image from 'next/image';

interface MobileCameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export default function MobileCameraCapture({ onCapture, onClose }: MobileCameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('No se pudo acceder a la cámara. Por favor verifica los permisos.');
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);
      stopCamera();
    }, 'image/jpeg', 0.9);
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const confirmPhoto = useCallback(() => {
    if (!canvasRef.current || !capturedImage) return;

    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
      onCapture(file);
      onClose();
    }, 'image/jpeg', 0.9);
  }, [capturedImage, onCapture, onClose]);

  const toggleCamera = useCallback(() => {
    stopCamera();
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    setTimeout(() => {
      startCamera();
    }, 100);
  }, [stopCamera, startCamera]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-white font-semibold text-lg">Tomar Foto</h2>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Video Preview */}
      {!capturedImage && (
        <div className="flex-1 relative flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Camera Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={toggleCamera}
                className="bg-white/20 hover:bg-white/30 text-white rounded-full p-4 transition-colors"
                title="Cambiar cámara"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
              <button
                onClick={capturePhoto}
                className="bg-white rounded-full p-6 w-20 h-20 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <div className="bg-white rounded-full p-4 w-16 h-16 border-4 border-gray-800"></div>
              </button>
              <div className="w-14" /> {/* Spacer */}
            </div>
          </div>
        </div>
      )}

      {/* Captured Image Preview */}
      {capturedImage && (
        <div className="flex-1 relative flex items-center justify-center bg-black">
          <Image
            src={capturedImage}
            alt="Captured photo"
            width={1920}
            height={1080}
            className="max-w-full max-h-full object-contain"
          />
          
          {/* Image Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={retakePhoto}
                className="bg-white/20 hover:bg-white/30 text-white rounded-full px-6 py-3 transition-colors flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Volver a tomar
              </button>
              <button
                onClick={confirmPhoto}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full px-8 py-3 transition-colors flex items-center gap-2 font-semibold"
              >
                <Camera className="w-5 h-5" />
                Usar esta foto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

