"use client";

import { motion } from "framer-motion";
import { 
  Check, 
  Star, 
  Send
} from "lucide-react";
import Header from "./components/Header";
import HeroTransformation from "./components/HeroTransformation";
import ExamplesGallery from "./components/ExamplesGallery";
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

      {/* Examples Gallery - Show colorization examples */}
      <ExamplesGallery />

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              One-time payment. Get 2000 credits and full access to our professional colorization tools.
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
                title="Professional"
                price="$10"
                period=" one-time payment"
                credits="2000 Credits"
                features={[
                  "2000 colorizations",
                  "One-time payment - no recurring charges",
                  "High resolution output",
                  "Multiple export formats",
                  "Professional AI models",
                  "Commercial usage rights",
                  "Credits never expire"
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
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Have questions or feedback? We&apos;d love to hear from you. Send us an email and we&apos;ll get back to you as soon as possible.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 shadow-sm"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <Send className="w-8 h-8 text-orange-500" />
                </div>
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Send us an email at:</p>
                  <a 
                    href="mailto:ubarrionuevo137@gmail.com"
                    className="text-2xl font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    ubarrionuevo137@gmail.com
                  </a>
                </div>
                <p className="text-gray-500 text-sm mt-4">
                  We typically respond within 24 hours
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
