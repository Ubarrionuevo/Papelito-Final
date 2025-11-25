"use client";

import { motion } from "framer-motion";
import { 
  Check, 
  Star, 
  Loader2, 
  ArrowRight, 
  Send
} from "lucide-react";
import Header from "./components/Header";
import HeroTransformation from "./components/HeroTransformation";
import ColorizationApp from "./components/ColorizationApp";
import { analytics } from "./utils/analytics";

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
                Bring Your Sketches to Life with{" "}
                <span className="text-orange-500">Intelligent Colorization</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl lg:max-w-none mx-auto lg:mx-0">
                Intelligent colorization that understands your artistic vision. Perfect for designers, illustrators, and creative professionals.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <button className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-sm hover:shadow-md">
                  <Check className="w-5 h-5" />
                  Instant Results
                </button>
                <button className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-sm hover:shadow-md">
                  <Star className="w-5 h-5" />
                  Professional Quality
                </button>
              </div>
            </motion.div>

            {/* Transformation Component - Right side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <HeroTransformation />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Aplicación de Colorización - Directamente después del hero */}
      <ColorizationApp />
    </div>
  );
}
