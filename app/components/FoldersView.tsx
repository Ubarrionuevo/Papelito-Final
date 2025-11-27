"use client";

import { motion } from "framer-motion";
import { Folder, FileText, Calendar, Building2 } from "lucide-react";
import { Document } from "../../types/api";

interface FoldersViewProps {
  documents: Document[];
  onDocumentClick?: (doc: Document) => void;
}

export default function FoldersView({ documents }: FoldersViewProps) {
  // Organizar documentos por categorías
  const organizeByCategory = () => {
    const organized: {
      byType: Record<string, Document[]>;
      byProvider: Record<string, Document[]>;
      byProject: Record<string, Document[]>;
      byMonth: Record<string, Document[]>;
    } = {
      byType: {},
      byProvider: {},
      byProject: {},
      byMonth: {}
    };

    documents.forEach((doc) => {
      // Por tipo
      const type = doc.classification.documentType || 'Sin clasificar';
      if (!organized.byType[type]) {
        organized.byType[type] = [];
      }
      organized.byType[type].push(doc);

      // Por proveedor
      const provider = doc.metadata.provider || doc.classification.provider || 'Sin proveedor';
      if (!organized.byProvider[provider]) {
        organized.byProvider[provider] = [];
      }
      organized.byProvider[provider].push(doc);

      // Por proyecto
      if (doc.classification.project) {
        if (!organized.byProject[doc.classification.project]) {
          organized.byProject[doc.classification.project] = [];
        }
        organized.byProject[doc.classification.project].push(doc);
      }

      // Por mes/año
      if (doc.classification.month && doc.classification.year) {
        const monthYear = `${doc.classification.month}/${doc.classification.year}`;
        if (!organized.byMonth[monthYear]) {
          organized.byMonth[monthYear] = [];
        }
        organized.byMonth[monthYear].push(doc);
      }
    });

    return organized;
  };

  const organized = organizeByCategory();

  const FolderCard = ({ 
    title, 
    count, 
    icon, 
    color = "orange" 
  }: { 
    title: string; 
    count: number; 
    icon: React.ReactNode;
    color?: string;
  }) => {
    const colorClasses = {
      orange: "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-700",
      blue: "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 text-blue-700",
      green: "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 text-emerald-700",
      purple: "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 text-purple-700"
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl border-2 p-4 cursor-pointer hover:shadow-md transition-all ${colorClasses[color as keyof typeof colorClasses] || colorClasses.orange}`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-semibold">{title}</h3>
          </div>
          <span className="text-sm font-bold">{count}</span>
        </div>
        <p className="text-xs opacity-75">documentos</p>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Vista por Tipo */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          Por Tipo de Documento
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(organized.byType).map(([type, docs], index) => (
            <FolderCard
              key={type}
              title={type}
              count={docs.length}
              icon={<FileText className="w-5 h-5" />}
              color={index % 4 === 0 ? "orange" : index % 4 === 1 ? "blue" : index % 4 === 2 ? "green" : "purple"}
            />
          ))}
        </div>
      </div>

      {/* Vista por Proveedor */}
      {Object.keys(organized.byProvider).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Por Proveedor
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(organized.byProvider).slice(0, 8).map(([provider, docs], index) => (
              <FolderCard
                key={provider}
                title={provider}
                count={docs.length}
                icon={<Building2 className="w-5 h-5" />}
                color={index % 4 === 0 ? "blue" : index % 4 === 1 ? "green" : index % 4 === 2 ? "purple" : "orange"}
              />
            ))}
          </div>
        </div>
      )}

      {/* Vista por Proyecto */}
      {Object.keys(organized.byProject).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Folder className="w-5 h-5 text-emerald-600" />
            Por Proyecto
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(organized.byProject).map(([project, docs], index) => (
              <FolderCard
                key={project}
                title={project}
                count={docs.length}
                icon={<Folder className="w-5 h-5" />}
                color={index % 4 === 0 ? "green" : index % 4 === 1 ? "purple" : index % 4 === 2 ? "orange" : "blue"}
              />
            ))}
          </div>
        </div>
      )}

      {/* Vista por Mes/Año */}
      {Object.keys(organized.byMonth).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Por Mes/Año
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(organized.byMonth)
              .sort((a, b) => b[0].localeCompare(a[0])) // Ordenar por fecha más reciente
              .map(([monthYear, docs], index) => (
                <FolderCard
                  key={monthYear}
                  title={monthYear}
                  count={docs.length}
                  icon={<Calendar className="w-5 h-5" />}
                  color={index % 4 === 0 ? "purple" : index % 4 === 1 ? "orange" : index % 4 === 2 ? "blue" : "green"}
                />
              ))}
          </div>
        </div>
      )}

      {documents.length === 0 && (
        <div className="text-center py-12">
          <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hay documentos para organizar aún</p>
          <p className="text-sm text-gray-400 mt-2">Sube tu primer documento para comenzar</p>
        </div>
      )}
    </div>
  );
}

