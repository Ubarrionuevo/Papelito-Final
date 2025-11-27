"use client";

import { motion } from "framer-motion";
import { 
  Star, 
  Send,
  FileText,
  Search
} from "lucide-react";
import Header from "./components/Header";
import HeroDocumentScanner from "./components/HeroDocumentScanner";
import DocumentsExamplesGallery from "./components/DocumentsExamplesGallery";
import PricingCard from "./components/PricingCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section - Landing Principal */}
      <section className="pt-32 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            {/* Title and main description - Left side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Digitaliza y Organiza tus{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Documentos</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl lg:max-w-none mx-auto lg:mx-0">
                Papelito es tu micro-SaaS para digitalizar facturas, remitos, presupuestos y contratos. OCR automático, clasificación inteligente y búsqueda instantánea.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <button 
                  onClick={() => window.location.href = '/documents'}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FileText className="w-5 h-5" />
                  Empezar Ahora
                </button>
                <button className="flex items-center justify-center gap-2 bg-white border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-full font-medium transition-all shadow-sm hover:shadow-md">
                  <Search className="w-5 h-5" />
                  Ver Ejemplos
                </button>
              </div>
            </motion.div>

            {/* Document Scanner Component - Right side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <HeroDocumentScanner />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Examples Gallery - Show document examples */}
      <DocumentsExamplesGallery />

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Precios
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pago único. Obtén 2000 créditos y acceso completo a nuestras herramientas de digitalización profesional.
            </p>
          </motion.div>

          <div className="flex justify-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-md"
            >
              <PricingCard
                title="Profesional"
                price="$10"
                period=" pago único"
                credits="2000 Créditos"
                features={[
                  "2000 digitalizaciones",
                  "Pago único - sin cargos recurrentes",
                  "OCR de alta precisión",
                  "Múltiples formatos de exportación",
                  "Clasificación automática inteligente",
                  "Búsqueda avanzada por texto y metadatos",
                  "Los créditos nunca expiran"
                ]}
                badge={{
                  text: "Best value",
                  color: "bg-orange-50 text-orange-800",
                  icon: <Star className="w-4 h-4" />
                }}
                popular={true}
                index={0}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Contacto
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              ¿Tienes preguntas o comentarios? Nos encantaría escucharte. Envíanos un email y te responderemos lo antes posible.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 rounded-2xl p-8 border border-indigo-100 shadow-lg"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                  <Send className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Envíanos un email a:</p>
                  <a 
                    href="mailto:ubarrionuevo137@gmail.com"
                    className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 transition-all"
                  >
                    ubarrionuevo137@gmail.com
                  </a>
                </div>
                <p className="text-gray-500 text-sm mt-4">
                  Normalmente respondemos en menos de 24 horas
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
