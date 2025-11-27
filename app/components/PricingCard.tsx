import { motion } from "framer-motion";
import { Check, Star, Crown, ArrowRight } from "lucide-react";
import { analytics } from "../utils/analytics";

const CHECKOUT_LINKS: Record<string, string> = {
  Gratis: "/documents",
  Mensual: "#pricing", // TODO: Agregar link de checkout
  Empresa: "#contact",
};

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
  const checkoutLink = CHECKOUT_LINKS[title] || "#";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/20 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${
        popular 
          ? 'border-indigo-300 ring-2 ring-indigo-100' 
          : 'border-indigo-100 hover:border-indigo-200'
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
          <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
            Más Popular
          </span>
        </motion.div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-black mb-2">{title}</h3>
        <div className="flex items-baseline justify-center gap-1 mb-2">
          <span className={`text-4xl font-bold ${price === "Gratis" || price === "Personalizado" ? "text-indigo-600" : "text-black"}`}>
            {price}
          </span>
          {period && <span className="text-black">{period}</span>}
        </div>
        <div className="text-xl font-semibold text-gray-700 mb-4">{credits}</div>
        
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
            <div className="w-5 h-5 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-emerald-600" />
            </div>
            <span className="text-black">{feature}</span>
          </motion.li>
        ))}
      </ul>

      {/* CTA Button */}
      <motion.a
        href={checkoutLink}
        target={title === "Empresa" ? "_self" : checkoutLink.startsWith("http") ? "_blank" : "_self"}
        rel={checkoutLink.startsWith("http") ? "noopener noreferrer" : undefined}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          const planType = title.toLowerCase();
          if (title === "Empresa") {
            analytics.pricingViewed("empresa");
          } else {
            const priceValue = price === "Gratis" ? 0 : parseInt(price.replace(/[$.]/g, '').replace(/\s/g, '')) || 0;
            analytics.purchaseInitiated(planType, priceValue);
          }
        }}
        className={`w-full py-3 rounded-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
          title === "Empresa" 
            ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
            : title === "Gratis"
            ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
            : "bg-red-500 hover:bg-red-600 text-white"
        }`}
      >
        <ArrowRight className="w-5 h-5" />
        <span>{title === "Empresa" ? "Contactar" : title === "Gratis" ? "Empezar Gratis" : "Suscribirse"}</span>
      </motion.a>

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 opacity-10">
        {popular ? (
          <Crown className="w-8 h-8 text-indigo-500" />
        ) : (
          <Star className="w-8 h-8 text-indigo-300" />
        )}
      </div>
    </motion.div>
  );
}
