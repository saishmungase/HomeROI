"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Zap, TrendingUp, Sparkles } from "lucide-react"

interface HeroPageProps {
  onAnalyze: (url: string) => void
  isConnected: boolean
}

export default function HeroPage({ onAnalyze, isConnected }: HeroPageProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      setIsLoading(true)
      onAnalyze(url)
      setUrl("")
    }
  }

  const features = [
    { icon: Zap, label: "Instant Analysis", desc: "AI-powered insights in seconds" },
    { icon: TrendingUp, label: "ROI Rankings", desc: "Prioritized recommendations" },
    { icon: Sparkles, label: "Smart Insights", desc: "Property condition assessment" },
  ]

  const stats = [
    { number: "50K+", label: "Properties Analyzed" },
    { number: "92%", label: "Avg ROI Accuracy" },
    { number: "$2.3M", label: "Total Uplift" },
    { number: "24/7", label: "AI Powered" },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl w-full"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-4">
            HomeROI Intelligence
          </h1>
          <p className="text-xl text-slate-300 font-light">Stop guessing. Start investing with confidence.</p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-teal-500/30 rounded-2xl blur-lg group-hover:blur-xl transition duration-300" />
            <div className="relative flex gap-3">
              <input
                type="url"
                placeholder="Paste your Zillow or Redfin URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition text-base backdrop-blur-sm"
              />
              <button
                type="submit"
                disabled={!url.trim() || !isConnected || isLoading}
                className="px-6 py-4 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold flex items-center gap-2 transition shadow-lg shadow-blue-500/50 whitespace-nowrap"
              >
                {isLoading ? "Analyzing..." : "Analyze"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          {!isConnected && <p className="text-sm text-amber-400 mt-3">Connecting to backend... (may take a moment)</p>}
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="p-5 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-blue-500/30 transition backdrop-blur-sm"
              >
                <Icon className="w-6 h-6 text-blue-400 mb-3" />
                <p className="font-semibold text-white text-sm mb-1">{feature.label}</p>
                <p className="text-xs text-slate-400">{feature.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-700 pt-8"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-1">
                {stat.number}
              </p>
              <p className="text-xs sm:text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
