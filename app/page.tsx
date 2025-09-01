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
import PricingCard from "./components/PricingCard";
import SmoothScroll from "./components/SmoothScroll";
import HeroTransformation from "./components/HeroTransformation";

export default function Home() {
  const plans = [
    {
      title: "Starter",
      price: "$5",
      period: "/month",
      credits: "1000 Credits",
      features: [
        "1000 colorizations",
        "High resolution output",
        "Multiple export formats",
        "Professional AI models",
        "Commercial usage rights",
        "Credits never expire"
      ],
      badge: {
        text: "Perfect for starters",
        color: "bg-yellow-50 text-yellow-800",
        icon: <Star className="w-4 h-4" />
      },
      popular: true
    },
    {
      title: "Professional",
      price: "$10",
      period: " one-time",
      credits: "3000 Credits",
      features: [
        "3000 colorizations",
        "High resolution output",
        "Multiple export formats",
        "Professional AI models",
        "Commercial usage rights",
        "Credits never expire"
      ],
      badge: {
        text: "Best value",
        color: "bg-blue-50 text-blue-800",
        icon: <Star className="w-4 h-4" />
      },
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Smooth Scroll Component */}
      <SmoothScroll />
      
      {/* Header */}
      <Header />

      {/* Hero Section - Title on the left, transformation on the right */}
      <section id="home" className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
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

              <div className="text-center lg:text-left">
                <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-full font-medium transition-colors mb-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Coming Soon
                </button>
                <p className="text-sm text-gray-500">Payment methods being configured! Stay tuned!</p>
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

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-3xl p-8 text-center border border-orange-200 relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-200/20 to-orange-300/20" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/30 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-300/30 rounded-full translate-y-12 -translate-x-12" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Ready to Transform Your Artwork?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of designers who are already using Sketcha to bring their sketches to life with AI-powered colorization.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-full font-medium transition-colors">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Coming Soon
                </button>
                <button className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-sm hover:shadow-md">
                  Learn More
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600">Perfect for designers and creative professionals.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <PricingCard
                key={plan.title}
                title={plan.title}
                price={plan.price}
                period={plan.period}
                credits={plan.credits}
                features={plan.features}
                badge={plan.badge}
                popular={plan.popular}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">X</span>
              </div>
              <span className="text-2xl font-bold">Sketcha</span>
            </div>
            <p className="text-gray-400 mb-6">
              Transforming sketches into masterpieces with artificial intelligence
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
