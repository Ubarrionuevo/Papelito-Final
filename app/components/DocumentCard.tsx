"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Document } from "../../types/api";
import { FileText, Calendar, DollarSign, Building2, Download, Share2, Trash2 } from "lucide-react";
import { useState } from "react";

interface DocumentCardProps {
  document: Document;
  onExport?: (doc: Document, format: 'pdf' | 'whatsapp') => void;
  onDelete?: (docId: string) => void;
  index?: number;
}

export default function DocumentCard({ document, onExport, onDelete, index = 0 }: DocumentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm('¿Estás seguro de que quieres eliminar este documento?')) return;
    
    setIsDeleting(true);
    try {
      await onDelete(document.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = (format: 'pdf' | 'whatsapp') => {
    if (onExport) {
      onExport(document, format);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="flex gap-4 p-4">
        {/* Thumbnail */}
        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          {document.imageUrl ? (
            <Image
              src={`data:image/jpeg;base64,${document.imageUrl}`}
              alt={document.classification.documentType || 'Documento'}
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {document.classification.documentType || 'Documento'}
              </h3>
              {document.metadata.number && (
                <p className="text-xs text-gray-500 mt-1">
                  N° {document.metadata.number}
                </p>
              )}
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={() => handleExport('whatsapp')}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Compartir por WhatsApp"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Exportar PDF"
              >
                <Download className="w-4 h-4" />
              </button>
              {onDelete && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-1 text-sm text-gray-600">
            {document.metadata.provider && (
              <div className="flex items-center gap-2">
                <Building2 className="w-3 h-3 text-gray-400" />
                <span className="truncate">{document.metadata.provider}</span>
              </div>
            )}
            {document.metadata.date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span>{document.metadata.date}</span>
              </div>
            )}
            {document.metadata.amount && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-3 h-3 text-gray-400" />
                <span className="font-semibold">${document.metadata.amount}</span>
              </div>
            )}
            {document.classification.project && (
              <div className="flex items-center gap-2">
                <FileText className="w-3 h-3 text-gray-400" />
                <span className="text-xs">Proyecto: {document.classification.project}</span>
              </div>
            )}
          </div>

          {/* Date */}
          <p className="text-xs text-gray-400 mt-2">
            {document.createdAt ? new Date(document.createdAt).toLocaleString('es-AR') : 'Fecha no disponible'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}





