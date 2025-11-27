'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Document, OCRResponse } from '../../types/api';
import { analytics } from '../utils/analytics';
import { FileText, Upload, X, Download, Share2, CheckCircle, Camera, Smartphone } from 'lucide-react';
import MobileCameraCapture from './MobileCameraCapture';
import QRCodeGenerator from './QRCodeGenerator';

export default function DocumentUploadApp() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userCredits, setUserCredits] = useState<number>(0);
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [showResultModal, setShowResultModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxFileSize = 20 * 1024 * 1024; // 20MB

  const loadUserCredits = useCallback(async () => {
    try {
      const userId = generateUserId();
      const response = await fetch(`/api/credits?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserCredits(data.credits);
        console.log(`📊 User credits loaded: ${data.credits} credits (${data.plan} plan)`);
        
        if (data.plan === 'free' && data.credits === 1) {
          analytics.freeTrialUsed();
        }
      }
    } catch (error) {
      console.error('Failed to load user credits:', error);
      setUserCredits(1);
    } finally {
      setIsLoadingCredits(false);
    }
  }, []);

  const generateUserId = () => {
    let userId = localStorage.getItem('papelito_user_id');
    
    if (!userId) {
      const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset()
      ].join('|');
      
      let hash = 0;
      for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      
      userId = 'user_' + Math.abs(hash).toString(36);
      localStorage.setItem('papelito_user_id', userId);
    }
    
    return userId;
  };

  const loadDocuments = useCallback(async () => {
    try {
      const userId = generateUserId();
      const response = await fetch(`/api/documents?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setDocuments(data.data);
        }
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  }, []);

  useEffect(() => {
    loadUserCredits();
    loadDocuments();
    analytics.appOpened();
    
    // Detectar si es dispositivo móvil
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                             (window.innerWidth <= 768);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [loadUserCredits, loadDocuments]);

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
        analytics.creditUsed(data.credits);
      }
    } catch (error) {
      console.error('Error deducting credit:', error);
    }
  }, []);

  const fileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  }, []);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido (JPG, PNG).');
      return;
    }

    if (file.size > maxFileSize) {
      setError(`El archivo es demasiado grande. Máximo ${maxFileSize / (1024 * 1024)}MB.`);
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, [maxFileSize]);

  const handleCameraCapture = useCallback((file: File) => {
    setError(null);

    if (!file.type.startsWith('image/')) {
      setError('Formato de imagen no válido.');
      return;
    }

    if (file.size > maxFileSize) {
      setError(`El archivo es demasiado grande. Máximo ${maxFileSize / (1024 * 1024)}MB.`);
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setShowCamera(false);
  }, [maxFileSize]);

  const processDocument = useCallback(async () => {
    if (!selectedFile || !previewUrl) return;
    
    if (userCredits <= 0) {
      setError('No tienes créditos disponibles. Por favor compra un plan para continuar.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProcessingStatus('Procesando documento...');
    
    analytics.documentProcessingStarted();

    try {
      const userId = generateUserId();
      const base64Image = await fileToBase64(selectedFile);
      setProcessingStatus('Extrayendo texto con OCR...');

      // Step 1: Process OCR
      const ocrResponse = await fetch('/api/ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!ocrResponse.ok) {
        const errorData = await ocrResponse.json();
        throw new Error(errorData.error || 'Error al procesar OCR');
      }

      const ocrData: OCRResponse = await ocrResponse.json();
      
      if (!ocrData.success || !ocrData.data) {
        throw new Error('Error al extraer datos del documento');
      }

      setProcessingStatus('Guardando documento...');

      // Step 2: Save document
      const saveResponse = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          image: base64Image,
          ocrData: ocrData.data
        }),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || 'Error al guardar documento');
      }

      const saveData = await saveResponse.json();
      
      if (saveData.success && saveData.data) {
        const newDocument = saveData.data;
        setDocuments(prev => [newDocument, ...prev]);
        setCurrentDocument(newDocument);
        setShowResultModal(true);
        
        await deductCredit();
        setProcessingStatus('¡Completado!');
        analytics.documentProcessingCompleted();
        
        // Reset file selection
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Document processing error:', error);
      setError(error instanceof Error ? error.message : 'Ocurrió un error al procesar el documento');
      analytics.errorOccurred('document_processing_failed');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  }, [selectedFile, previewUrl, userCredits, fileToBase64, deductCredit]);

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
        setError('Por favor selecciona un archivo de imagen válido.');
      }
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const exportDocument = useCallback(async (document: Document, format: 'pdf' | 'whatsapp') => {
    if (format === 'whatsapp') {
      const text = `📄 ${document.classification.documentType}\n` +
        `📅 Fecha: ${document.metadata.date || 'N/A'}\n` +
        `🏢 Proveedor: ${document.metadata.provider || 'N/A'}\n` +
        `💰 Monto: $${document.metadata.amount || 'N/A'}\n` +
        `\n${document.text}`;
      
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      // TODO: Implementar generación de PDF
      alert('Exportación a PDF próximamente disponible');
    }
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 lg:p-8">
      {/* Credits Display */}
      {!isLoadingCredits && (
        <div className="max-w-4xl mx-auto mb-6">
          <div className={`rounded-2xl shadow-lg p-6 border-2 ${
            userCredits > 0 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
              : 'bg-yellow-50 border-yellow-300'
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  userCredits > 0 ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  {userCredits > 0 ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <X className="w-6 h-6 text-yellow-600" />
                  )}
                </div>
                <div>
                  {userCredits > 0 ? (
                    <>
                      <p className="text-xl font-bold text-gray-900">
                        Tienes {userCredits} {userCredits === 1 ? 'crédito' : 'créditos'} disponibles
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        Sube tu documento y comienza a digitalizar
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-bold text-yellow-900">
                        No hay créditos disponibles
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Compra un plan para continuar digitalizando documentos
                      </p>
                    </>
                  )}
                </div>
              </div>
              {userCredits === 0 && (
                <button
                  onClick={() => window.location.href = '/#pricing'}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                >
                  Comprar Créditos
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* File Upload Area */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Subir Documento</h2>
          
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              previewUrl ? 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50' : 'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50/30'
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
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-gray-600">Documento listo para procesar</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">Arrastra tu documento aquí</p>
                  <p className="text-sm text-gray-500">o haz clic para buscar</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    Elegir Archivo
                  </button>
                  
                  {/* Botón de cámara para móvil */}
                  {isMobile && (
                    <button
                      onClick={() => setShowCamera(true)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Tomar Foto
                    </button>
                  )}
                  
                  {/* Botón QR para desktop */}
                  {!isMobile && (
                    <button
                      onClick={() => setShowQRCode(true)}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <Smartphone className="w-5 h-5" />
                      Usar Celular
                    </button>
                  )}
                </div>
              </div>
            )}
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

        {/* Documents List */}
        {documents.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tus Documentos</h2>
            <div className="grid gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={`data:image/jpeg;base64,${doc.imageUrl}`}
                        alt="Document"
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {doc.classification.documentType || 'Documento'}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {doc.metadata.provider && `Proveedor: ${doc.metadata.provider}`}
                            {doc.metadata.date && ` • Fecha: ${doc.metadata.date}`}
                            {doc.metadata.amount && ` • Monto: $${doc.metadata.amount}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {doc.createdAt ? new Date(doc.createdAt).toLocaleString('es-AR') : 'Fecha no disponible'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => exportDocument(doc, 'whatsapp')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Compartir por WhatsApp"
                          >
                            <Share2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => exportDocument(doc, 'pdf')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Exportar PDF"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Process Button */}
        {!isLoadingCredits && userCredits > 0 && selectedFile && previewUrl && (
          <div className="text-center">
            <button
              onClick={processDocument}
              disabled={isProcessing}
              className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-10 py-4 rounded-full font-bold text-xl transition-all shadow-xl hover:shadow-2xl disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
            >
              {isProcessing ? (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Procesando...</span>
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Procesar Documento
                </span>
              )}
            </button>
            <p className="text-sm text-gray-600 mt-3">
              Usarás 1 crédito de {userCredits} disponibles
            </p>
          </div>
        )}
        
        {!isLoadingCredits && userCredits <= 0 && selectedFile && previewUrl && (
          <div className="text-center bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
            <p className="text-lg font-semibold text-yellow-900 mb-2">
              No hay créditos disponibles
            </p>
            <p className="text-yellow-700 mb-4">
              Compra créditos para procesar este documento
            </p>
            <button
              onClick={() => window.location.href = '/#pricing'}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Ver Planes y Precios
            </button>
          </div>
        )}
      </div>

      {/* Result Modal */}
      {showResultModal && currentDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">✅ Documento Procesado</h2>
              <button
                onClick={() => setShowResultModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Imagen del Documento</h4>
                  <div className="bg-gray-100 rounded-lg p-2">
                    <Image
                      src={`data:image/jpeg;base64,${currentDocument.imageUrl}`}
                      alt="Document"
                      width={400}
                      height={400}
                      className="rounded-lg object-contain w-full h-auto"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Datos Extraídos</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p><strong>Tipo:</strong> {currentDocument.classification.documentType}</p>
                    <p><strong>Proveedor:</strong> {currentDocument.metadata.provider || 'N/A'}</p>
                    <p><strong>Fecha:</strong> {currentDocument.metadata.date || 'N/A'}</p>
                    <p><strong>Monto:</strong> ${currentDocument.metadata.amount || 'N/A'}</p>
                    <p><strong>Número:</strong> {currentDocument.metadata.number || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Texto Completo</h4>
                <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{currentDocument.text}</p>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => exportDocument(currentDocument, 'whatsapp')}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Compartir WhatsApp
                </button>
                <button
                  onClick={() => exportDocument(currentDocument, 'pdf')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Exportar PDF
                </button>
                <button
                  onClick={() => setShowResultModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Camera Capture Modal */}
      {showCamera && (
        <MobileCameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* QR Code Generator Modal */}
      {showQRCode && typeof window !== 'undefined' && (
        <QRCodeGenerator
          url={window.location.href}
          onClose={() => setShowQRCode(false)}
        />
      )}
    </div>
  );
}

