"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FileText, CheckCircle, Search, Folder } from "lucide-react";

export default function HeroDocumentScanner() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Sube tu Documento",
      description: "Toma una foto o sube una imagen de tu factura, remito, presupuesto o contrato"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "OCR Automático",
      description: "Extraemos automáticamente el texto y los datos importantes del documento"
    },
    {
      icon: <Folder className="w-8 h-8" />,
      title: "Clasificación Inteligente",
      description: "Organizamos tu documento por tipo, proveedor, proyecto y fecha"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Listo para Usar",
      description: "Busca, exporta o comparte tus documentos digitalizados fácilmente"
    }
  ];

  // Auto-rotate steps every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="w-full"
    >
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Before - Documento Original */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="mb-6">
            <span className="text-gray-700 text-lg font-semibold">
              Documento Original
            </span>
          </div>
          
          <div className="w-full h-72 flex items-center justify-center bg-gray-100 rounded-xl p-4">
            <div className="text-center">
              <FileText className="w-24 h-24 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-sm">Factura, Remito, Presupuesto o Contrato</p>
            </div>
          </div>
        </motion.div>

        {/* After - Proceso de Digitalización */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center"
        >
          <div className="mb-6">
            <span className="text-gray-700 text-lg font-semibold">
              Documento Digitalizado
            </span>
          </div>
          
          <div className="w-full h-72 flex items-center justify-center">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full h-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200 shadow-lg"
            >
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="text-indigo-600">
                  {steps[currentStep].icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {steps[currentStep].title}
                </h3>
                <p className="text-gray-600 text-sm max-w-xs">
                  {steps[currentStep].description}
                </p>
                <div className="flex gap-2 mt-4">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

