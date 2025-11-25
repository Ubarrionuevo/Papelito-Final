"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ExamplesGallery() {
  const examples = [
    {
      id: 1,
      title: "Vibrant Sunset Vista",
      description: "Mountain landscape with vibrant colors and gradient transitions, dreamlike quality with orange, yellow, and blue tones",
      image: "/IMG/resultado1.png"
    },
    {
      id: 2,
      title: "Dramatic Atmospheric Scene",
      description: "Atmospheric and dramatic landscape with dark tones, dramatic lighting, and mountain silhouettes at sunset",
      image: "/IMG/resultado2.png"
    },
    {
      id: 3,
      title: "Bold Pop Art Style",
      description: "Pop art style with bright color palette: pink, royal blue, and yellow, with black outlines and dot texture",
      image: "/IMG/resultado3.png"
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
            See the Magic
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your sketches into stunning colorized artwork. Here are some examples of what you can create with our AI-powered colorization tool.
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
              <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10 shadow-lg">
                  Colorized Result
                </div>
                <div className="relative w-full h-full">
                  <Image
                    src={example.image}
                    alt={example.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                    unoptimized
                  />
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{example.title}</h3>
                <p className="text-sm text-gray-600">{example.description}</p>
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
            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span>Start Colorizing Now</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

