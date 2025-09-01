import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

interface ExampleCardProps {
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  index: number;
}

export default function ExampleCard({
  title,
  description,
  beforeImage,
  afterImage,
  index
}: ExampleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 relative overflow-hidden"
      whileHover={{ y: -5 }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-2">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        
        <p className="text-gray-600 text-sm text-center mb-6">{description}</p>
        
        <div className="space-y-4">
          {/* Before Image */}
          <div className="relative">
            <div className="absolute -top-2 -left-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
              Antes
            </div>
            <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm group-hover:bg-gray-300 transition-colors duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-2xl">✏️</span>
                </div>
                <p className="text-xs">Boceto Original</p>
              </div>
            </div>
          </div>
          
          {/* Arrow */}
          <div className="flex justify-center">
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </div>
          
          {/* After Image */}
          <div className="relative">
            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Después
            </div>
            <div className="w-full h-32 bg-gradient-to-br from-orange-100 to-blue-100 rounded-lg flex items-center justify-center text-gray-500 text-sm group-hover:from-orange-200 group-hover:to-blue-200 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-blue-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-2xl">🎨</span>
                </div>
                <p className="text-xs">Obra Coloreada</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Success indicator */}
        <div className="mt-4 flex items-center justify-center gap-2 text-green-600 text-sm">
          <Check className="w-4 h-4" />
          <span>Transformación exitosa</span>
        </div>
      </div>
    </motion.div>
  );
}
