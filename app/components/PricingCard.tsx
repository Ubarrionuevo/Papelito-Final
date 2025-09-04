import { motion } from "framer-motion";
import { Check, Star, Crown, ArrowRight } from "lucide-react";
import { analytics } from "../utils/analytics";

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  credits: string;
  features: string[];
  badge?: {
    text: string;
    color: string;
    icon: React.ReactNode;
  };
  popular?: boolean;
  index: number;
}

export default function PricingCard({
  title,
  price,
  period,
  credits,
  features,
  badge,
  popular = false,
  index
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border ${
        popular 
          ? 'border-orange-200 ring-2 ring-orange-100' 
          : 'border-gray-100 hover:border-gray-200'
      } group`}
      whileHover={{ y: -5 }}
    >
      {/* Popular badge */}
      {popular && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="absolute -top-3 left-1/2 transform -translate-x-1/2"
        >
          <span className="bg-orange-500 text-black px-4 py-1 rounded-full text-sm font-medium shadow-lg">
            Most Popular
          </span>
        </motion.div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-black mb-2">{title}</h3>
        <div className="flex items-baseline justify-center gap-1 mb-2">
          <span className="text-4xl font-bold text-black">{price}</span>
          <span className="text-black">{period}</span>
        </div>
        <div className="text-2xl font-semibold text-black mb-4">{credits}</div>
        
        {/* Badge */}
        {badge && (
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${badge.color}`}>
            {badge.icon}
            {badge.text}
          </div>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-4 mb-8">
        {features.map((feature, featureIndex) => (
          <motion.li
            key={featureIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + featureIndex * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-green-600" />
            </div>
            <span className="text-black">{feature}</span>
          </motion.li>
        ))}
      </ul>

      {/* CTA Button */}
      {title === "Starter" ? (
        <motion.a
          href="https://buy.polar.sh/polar_cl_j9AjecF4Y3cJGkt8IMTonXo7LOieC7cVkK16K1ZHqDC"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => analytics.purchaseInitiated('starter', 5)}
          className="w-full py-3 rounded-full font-bold transition-all duration-200 bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center justify-center gap-2">
            <ArrowRight className="w-5 h-5" />
            <span className="text-black">Get Started</span>
          </div>
        </motion.a>
      ) : title === "Professional" ? (
        <motion.a
          href="https://buy.polar.sh/polar_cl_TSIHrLY3B2zCK9K0iZfR9hYNSSzBtXKNgWeFn29xZNn"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => analytics.purchaseInitiated('professional', 10)}
          className="w-full py-3 rounded-full font-bold transition-all duration-200 bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center justify-center gap-2">
            <ArrowRight className="w-5 h-5" />
            <span className="text-black">Get Started</span>
          </div>
        </motion.a>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 rounded-full font-medium transition-all duration-200 ${
            popular
              ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 animate-spin">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            Coming Soon
          </div>
        </motion.button>
      )}

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 opacity-10">
        {popular ? (
          <Crown className="w-8 h-8 text-orange-500" />
        ) : (
          <Star className="w-8 h-8 text-gray-400" />
        )}
      </div>
    </motion.div>
  );
}
