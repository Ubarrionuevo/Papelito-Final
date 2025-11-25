"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Star } from "lucide-react";
import PricingCard from "./PricingCard";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
    credits: "2000 Credits",
    features: [
      "2000 colorizations",
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

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-center text-gray-600 mb-8 text-lg">
                  Perfect for designers and creative professionals.
                </p>

                {/* Pricing Cards */}
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

