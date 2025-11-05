"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PropertyImageGalleryProps {
  images?: {
    main?: string
    kitchen?: string
    basement?: string
    exterior?: string
  }
}

export default function PropertyImageGallery({ images }: PropertyImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const imageArray = [
    { url: images?.main, label: "Main" },
    { url: images?.kitchen, label: "Kitchen" },
    { url: images?.basement, label: "Basement" },
    { url: images?.exterior, label: "Exterior" },
  ].filter((img) => img.url) 

  const currentImage = imageArray[currentImageIndex]

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? imageArray.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === imageArray.length - 1 ? 0 : prev + 1))
  }

  if (imageArray.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl h-80 flex items-center justify-center">
        <p className="text-slate-400">No images available</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-900">
        <motion.img
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          src={currentImage?.url}
          alt={currentImage?.label}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/diverse-property-showcase.png"
          }}
        />

        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-black/20 to-transparent">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToPrevious}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToNext}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="absolute top-4 right-4">
          <span className="px-3 py-1.5 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/20">
            {currentImage?.label}
          </span>
        </div>

        <div className="absolute bottom-4 right-4">
          <span className="px-3 py-1.5 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/20">
            {currentImageIndex + 1} / {imageArray.length}
          </span>
        </div>
      </div>

      <div className="bg-slate-900/30 p-3 border-t border-slate-700/50 backdrop-blur-sm">
        <div className="flex gap-2 overflow-x-auto">
          {imageArray.map((image, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                currentImageIndex === index
                  ? "border-blue-500 ring-2 ring-blue-500/50"
                  : "border-slate-600 hover:border-slate-500"
              }`}
            >
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.label}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/diverse-property-showcase.png"
                }}
              />
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
