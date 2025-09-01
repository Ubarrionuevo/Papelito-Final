'use client';

import React, { useState, useCallback, useRef } from 'react';
import Image from 'next/image';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const maxPixels = 4096 * 4096; // 4096x4096 pixels

  const validateImage = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const pixels = img.width * img.height;
        if (pixels > maxPixels) {
          setError(`La imagen es demasiado grande. Máximo ${maxPixels} píxeles.`);
          resolve(false);
        } else {
          resolve(true);
        }
      };
      img.onerror = () => {
        setError('Error al cargar la imagen. Asegúrate de que sea un archivo válido.');
        resolve(false);
      };
      img.src = URL.createObjectURL(file);
    });
  }, [maxPixels]);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    // Validar tamaño
    if (file.size > maxFileSize) {
      setError('El archivo es demasiado grande. Máximo 10MB.');
      return;
    }

    // Validar dimensiones
    const isValid = await validateImage(file);
    if (!isValid) return;

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, [validateImage, maxFileSize]);

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
          throw new Error('Error al verificar el estado');
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
          throw new Error(result.error || 'Error en el procesamiento de la imagen');
        } else if (result.status === 'processing') {
          // Still processing, continue polling
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(poll, 5000); // Wait 5 seconds before next poll
          } else {
            throw new Error('Tiempo de espera agotado. La imagen está tardando más de lo esperado.');
          }
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error al verificar el estado');
        setIsProcessing(false);
      }
    };

    // Start polling
    poll();
  }, [previewUrl]);

  const processImage = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('/api/colorize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al procesar la imagen');
      }

      const result = await response.json();
      
      if (result.status === 'submitted') {
        // Start polling for results
        await pollForResults(result.polling_url);
      } else {
        throw new Error('Respuesta inesperada de la API');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setIsProcessing(false);
    }
  }, [selectedFile, pollForResults]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const input = fileInputRef.current;
      if (input) {
        input.files = event.dataTransfer.files;
        // Create a proper event object instead of using 'any'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Colorización de Imágenes con IA
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transforma tus dibujos en blanco y negro en obras de arte coloridas usando inteligencia artificial
          </p>
        </div>

        {/* Área de carga de archivos */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              previewUrl ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {!previewUrl ? (
              <div>
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Arrastra tu imagen aquí o haz clic para seleccionar
                </h3>
                <p className="text-gray-500 mb-4">
                  Formatos soportados: JPG, PNG, WEBP (máximo 10MB)
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Seleccionar Imagen
                </button>
              </div>
            ) : (
              <div>
                <div className="relative inline-block">
                  <Image
                    src={previewUrl}
                    alt="Vista previa"
                    width={200}
                    height={200}
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
                <p className="text-sm text-gray-600 mt-2">
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
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {previewUrl && (
            <div className="mt-6 text-center">
              <button
                onClick={processImage}
                disabled={isProcessing}
                className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
                  isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </div>
                ) : (
                  '🎨 Colorizar Imagen'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Resultados */}
        {results.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Resultados de Colorización
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Original</h4>
                      <Image
                        src={result.original}
                        alt="Original"
                        width={150}
                        height={150}
                        className="rounded-lg object-cover w-full"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Colorizada</h4>
                      <Image
                        src={result.colorized}
                        alt="Colorizada"
                        width={150}
                        height={150}
                        className="rounded-lg object-cover w-full"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {result.timestamp.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
