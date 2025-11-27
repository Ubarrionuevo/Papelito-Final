'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, X, Copy, Check } from 'lucide-react';

interface QRCodeGeneratorProps {
  url: string;
  onClose: () => void;
}

export default function QRCodeGenerator({ url, onClose }: QRCodeGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    // Usar API pública para generar QR sin instalar librerías
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    setQrDataUrl(qrUrl);
  }, [url]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 rounded-full p-2">
              <QrCode className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Conectar desde Celular</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Instructions */}
        <div className="mb-6 text-center">
          <p className="text-gray-700 mb-4">
            Escanea este código QR con tu celular para abrir la aplicación y tomar fotos directamente desde tu cámara.
          </p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          {qrDataUrl ? (
            <div className="bg-white p-4 rounded-xl border-4 border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="QR Code"
                className="w-64 h-64"
              />
            </div>
          ) : (
            <div className="w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* URL Copy */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            O copia esta URL:
          </label>
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
            <input
              type="text"
              value={url}
              readOnly
              className="flex-1 bg-transparent text-sm text-gray-700 outline-none truncate"
            />
            <button
              onClick={copyToClipboard}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Copiar URL"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-indigo-50 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-indigo-900 mb-2">Pasos:</p>
          <ol className="text-sm text-indigo-700 space-y-1 list-decimal list-inside">
            <li>Abre la cámara de tu celular o una app para escanear QR</li>
            <li>Escanea este código QR</li>
            <li>Se abrirá la aplicación en tu celular</li>
            <li>Usa el botón &quot;Tomar Foto&quot; para capturar documentos</li>
          </ol>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

