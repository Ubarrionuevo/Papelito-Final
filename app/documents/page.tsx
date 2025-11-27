"use client";

import { useState, useCallback, useEffect } from "react";
import Header from "../components/Header";
import DocumentUploadApp from "../components/DocumentUploadApp";
import SearchBar, { SearchFilters } from "../components/SearchBar";
import DocumentCard from "../components/DocumentCard";
import FoldersView from "../components/FoldersView";
import { Document } from "../../types/api";
import { FileText, Grid, Folder } from "lucide-react";

export default function DocumentsPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'folders'>('list');
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

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
      setIsLoading(true);
      const userId = generateUserId();
      const response = await fetch(`/api/documents?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setDocuments(data.data);
          setFilteredDocuments(data.data);
        }
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleSearch = useCallback(async (query: string, filters: SearchFilters) => {
    setSearchQuery(query);
    setSearchFilters(filters);
    
    try {
      const userId = generateUserId();
      const response = await fetch('/api/documents/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          query: query || undefined,
          ...filters
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setFilteredDocuments(data.data);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  }, []);

  const handleDelete = useCallback(async (docId: string) => {
    try {
      const userId = generateUserId();
      const response = await fetch(`/api/documents?id=${docId}&userId=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from local state
        setDocuments(prev => prev.filter(doc => doc.id !== docId));
        setFilteredDocuments(prev => prev.filter(doc => doc.id !== docId));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error al eliminar el documento');
    }
  }, []);

  const handleExport = useCallback((doc: Document, format: 'pdf' | 'whatsapp') => {
    if (format === 'whatsapp') {
      const text = `📄 ${doc.classification.documentType}\n` +
        `📅 Fecha: ${doc.metadata.date || 'N/A'}\n` +
        `🏢 Proveedor: ${doc.metadata.provider || 'N/A'}\n` +
        `💰 Monto: $${doc.metadata.amount || 'N/A'}\n` +
        `\n${doc.text}`;
      
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      alert('Exportación a PDF próximamente disponible');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Mis Documentos</h1>
            <p className="text-xl text-gray-600">
              Digitaliza, organiza y busca tus documentos fácilmente
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4" />
                Lista
              </button>
              <button
                onClick={() => setViewMode('folders')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'folders'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Folder className="w-4 h-4" />
                Carpetas
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {filteredDocuments.length} {filteredDocuments.length === 1 ? 'documento' : 'documentos'}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando documentos...</p>
            </div>
          ) : viewMode === 'folders' ? (
            <FoldersView documents={filteredDocuments} />
          ) : (
            <div className="space-y-4">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc, index) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onExport={handleExport}
                    onDelete={handleDelete}
                    index={index}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">
                    {searchQuery || Object.keys(searchFilters).length > 0
                      ? 'No se encontraron documentos'
                      : 'No hay documentos aún'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {searchQuery || Object.keys(searchFilters).length > 0
                      ? 'Intenta con otros términos de búsqueda'
                      : 'Sube tu primer documento para comenzar'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DocumentUploadApp />
        </div>
      </div>
    </div>
  );
}

