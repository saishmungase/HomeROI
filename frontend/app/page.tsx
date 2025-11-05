"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import HeroPage from "@/components/hero-page"
import AnalysisPage from "@/components/analysis-page"
import DashboardPage from "@/components/dashboard-page"
import { useWebSocket } from "@/hooks/use-websocket"

type View = "hero" | "analysis" | "dashboard" | "error"

export default function Page() {
  const [view, setView] = useState<View>("hero")
  const [propertyUrl, setPropertyUrl] = useState("")
  const [userId] = useState(() => Math.random().toString().slice(2, 9))
  const [analysisData, setAnalysisData] = useState(null)
  const [error, setError] = useState("")
  const { sendRequest, isConnected } = useWebSocket()
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [])

  const handleAnalyzeProperty = async (url: string) => {
    // Clear any existing polling interval
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
    
    setPropertyUrl(url)
    setView("analysis")
    setError("")

    try {
      // Send request to backend
      await sendRequest({
        type: "req",
        body: {
          user: userId,
          url: url,
        },
      })

      let attempts = 0
      const maxAttempts = 60 // 5 minutes max

      const pollInterval = setInterval(async () => {
        attempts++

        try {
          await sendRequest(
            {
              type: "res",
              user: userId,
            },
            (data) => {
              // Check if we have a valid response with data
              if (data && Array.isArray(data) && data.length > 0 && data[0].data) {
                console.log("[v0] Analysis complete, loading dashboard")
                clearInterval(pollInterval)
                pollIntervalRef.current = null
                setAnalysisData(data[0].data)
                setView("dashboard")

                // Send success confirmation
                sendRequest({
                  type: "success",
                  user: userId,
                }).catch(console.error)
              }
            },
          )
        } catch (err) {
          console.error("[v0] Polling error:", err)
        }

        // Check max attempts
        if (attempts >= maxAttempts) {
          clearInterval(pollInterval)
          pollIntervalRef.current = null
          setError("Analysis timeout. Please try again.")
          setView("error")
        }
      }, 5000) // Poll every 5 seconds

      pollIntervalRef.current = pollInterval
    } catch (err) {
      console.error("[v0] Analysis error:", err)
      setError("Failed to start analysis. Please check the URL and try again.")
      setView("error")
    }
  }

  const handleReset = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
    setView("hero")
    setPropertyUrl("")
    setAnalysisData(null)
    setError("")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {view === "hero" && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <HeroPage onAnalyze={handleAnalyzeProperty} isConnected={isConnected} />
            </motion.div>
          )}

          {view === "analysis" && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AnalysisPage propertyUrl={propertyUrl} />
            </motion.div>
          )}

          {view === "dashboard" && analysisData && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <DashboardPage data={analysisData} onReset={handleReset} />
            </motion.div>
          )}

          {view === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen flex items-center justify-center"
            >
              <div className="text-center max-w-md">
                <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
                <p className="text-slate-300 mb-8">{error}</p>
                <button
                  onClick={handleReset}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
