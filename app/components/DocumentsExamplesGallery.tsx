"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FileText, Calendar, DollarSign, Building2 } from "lucide-react";

export default function DocumentsExamplesGallery() {
  const examples = [
    {
      id: 1,
      title: "Factura Digitalizada",
      description: "Extracción automática de número, fecha, proveedor y monto total. Clasificada automáticamente por tipo y mes.",
      type: "Factura",
      date: "15/03/2024",
      provider: "Proveedor ABC",
      amount: "$15,000",
      image: "/IMG/resultado1.png" // Placeholder - reemplazar con imagen de factura
    },
    {
      id: 2,
      title: "Remito Organizado",
      description: "OCR completo del remito con clasificación por proveedor y proyecto. Búsqueda instantánea por texto.",
      type: "Remito",
      date: "20/03/2024",
      provider: "Distribuidora XYZ",
      amount: "-",
      image: "/IMG/resultado2.png" // Placeholder
    },
    {
      id: 3,
      title: "Presupuesto Clasificado",
      description: "Presupuesto digitalizado con datos estructurados. Exportable a PDF o compartible por WhatsApp.",
      type: "Presupuesto",
      date: "25/03/2024",
      provider: "Cliente Final",
      amount: "$45,000",
      image: "/IMG/resultado3.png" // Placeholder
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Documentos Digitalizados
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ve cómo Papelito transforma tus documentos físicos en datos organizados y buscables. Aquí tienes algunos ejemplos de documentos procesados.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {examples.map((example, index) => (
            <motion.div
              key={example.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <div className="absolute top-3 left-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10 shadow-lg flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {example.type}
                </div>
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Vista previa del documento</p>
                  </div>
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">{example.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{example.description}</p>
                
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span>{example.provider}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{example.date}</span>
                  </div>
                  {example.amount !== "-" && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">{example.amount}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="#pricing"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <span>Empezar a Digitalizar</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

