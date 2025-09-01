"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function HeroTransformation() {
  const [currentResultIndex, setCurrentResultIndex] = useState(0);

  const coloredResults = [
    "/IMG/resultado1.png",
    "/IMG/resultado2.png", 
    "/IMG/resultado3.png"
  ];

  // Auto-rotate images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentResultIndex((prev) => (prev + 1) % coloredResults.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [coloredResults.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="w-full"
    >
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Before - Original Sketch */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="mb-6">
            <span className="text-gray-700 text-lg font-semibold">
              Original Sketch
            </span>
          </div>
          
          <div className="w-full h-72 flex items-center justify-center">
            <Image
              src="/IMG/lineart.jpg"
              alt="Mountain landscape in black and white"
              width={500}
              height={320}
              className="object-contain w-full h-full rounded-xl"
            />
          </div>
        </motion.div>

        {/* After - Colored Result */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center"
        >
          <div className="mb-6">
            <span className="text-gray-700 text-lg font-semibold">
              Colored Result
            </span>
          </div>
          
          <div className="w-full h-72 flex items-center justify-center">
            <motion.div
              key={currentResultIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full h-full"
            >
              <Image
                src={coloredResults[currentResultIndex]}
                alt={`AI colored result ${currentResultIndex + 1}`}
                width={500}
                height={320}
                className="object-contain w-full h-full rounded-xl"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
