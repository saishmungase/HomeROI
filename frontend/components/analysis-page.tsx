"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

interface AnalysisPageProps {
  propertyUrl: string
}

export default function AnalysisPage({ propertyUrl }: AnalysisPageProps) {
  const [step, setStep] = useState(0)

  const steps = [
    "Fetching property data...",
    "Analyzing kitchen condition...",
    "Assessing curb appeal...",
    "Calculating renovation ROI...",
    "Finalizing recommendations...",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => {
        const next = prev + 1
        if (next >= steps.length) {
          clearInterval(timer)
          return prev
        }
        return next
      })
    }, 1200)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            className="inline-block mb-4"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-3">Analyzing Property</h2>
          <p className="text-slate-400 text-sm">
            Running AI models on {propertyUrl?.split("/").pop() || "your property"}
          </p>
        </div>

        <div className="space-y-5 mb-12">
          {steps.map((stepText, stepIndex) => (
            <motion.div key={stepIndex} className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1 flex-none">
                  {step > stepIndex ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/50"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  ) : step === stepIndex ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="w-7 h-7 rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-500 shadow-lg"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full border-2 border-slate-700 bg-slate-800/50" />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <p className={`font-semibold transition ${step >= stepIndex ? "text-white" : "text-slate-500"}`}>
                    {stepText}
                  </p>
                </div>
              </div>

              {stepIndex < steps.length - 1 && (
                <motion.div
                  animate={{
                    backgroundColor: step > stepIndex ? "rgb(20, 184, 166)" : "rgb(71, 85, 105)",
                  }}
                  className={`absolute left-3.5 top-10 w-0.5 h-8 transition-colors`}
                />
              )}
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, delay: i * 0.2, repeat: Number.POSITIVE_INFINITY }}
              className="w-2.5 h-2.5 rounded-full bg-blue-500"
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
