"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, Home, RefreshCw, ChevronDown, TrendingUp, Sparkles, DollarSign, CheckCircle2 } from "lucide-react"
import RenovationModal from "././renovation-page"
import PropertyImageGallery from "././property-image-gallery"
import StepsDialog from "./steps-dialog"

interface DashboardPageProps {
  data: any
  onReset: () => void
}

export default function DashboardPage({ data, onReset }: DashboardPageProps) {
  const [selectedRenovation, setSelectedRenovation] = useState(null)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const [selectedSteps, setSelectedSteps] = useState<{ title: string; steps: string[] } | null>(null)

  const improvements = data.goodInvestments || []
  const baselinePrice = data.baselinePrice || 0

  const topImprovement = improvements[0]
  const maxPotentialValue = topImprovement?.newPrice || baselinePrice
  const maxTotalProfit = improvements.reduce((sum: number, item: any) => sum + (item.netProfit || 0), 0)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  const getROIColor = (roi: number) => {
    if (roi >= 200) return "from-emerald-400 via-teal-400 to-cyan-400"
    if (roi >= 100) return "from-blue-400 via-cyan-400 to-teal-400"
    return "from-indigo-400 via-blue-400 to-cyan-400"
  }

  const handleViewSteps = (title: string, steps: string[]) => {
    setSelectedSteps({ title, steps })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 text-white overflow-hidden">
      {selectedRenovation && (
        <RenovationModal renovation={selectedRenovation} onClose={() => setSelectedRenovation(null)} />
      )}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-48 -right-48 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-48 -left-48 w-[600px] h-[600px] bg-gradient-to-tr from-teal-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-white/5 backdrop-blur-xl bg-slate-900/30 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-6 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl blur-lg opacity-50" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                HomeROI Intelligence
              </span>
              <p className="text-xs text-slate-400 mt-0.5">AI-Powered Investment Analysis</p>
            </div>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl transition overflow-hidden font-medium text-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <RefreshCw className="w-4 h-4 relative z-10 group-hover:rotate-180 transition-transform duration-500" />
            <span className="relative z-10">New Analysis</span>
          </motion.button>
        </div>
      </motion.header>

      {selectedSteps && (
        <StepsDialog
          isOpen={!!selectedSteps}
          onClose={() => setSelectedSteps(null)}
          title={selectedSteps.title}
          steps={selectedSteps.steps}
        />
      )}

      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-teal-500/10 border border-blue-500/20 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">Analysis Complete</span>
          </motion.div>
          <h1 className="text-6xl sm:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-teal-100 bg-clip-text text-transparent leading-tight">
            Your Investment<br />Opportunities
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Discover high-ROI renovations powered by advanced AI analysis
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 space-y-6"
          >
            <PropertyImageGallery images={data.allImages} />

            <motion.div
              className="group relative overflow-hidden rounded-3xl"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Property Value</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">Current Value</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                      ${baselinePrice.toLocaleString()}
                    </p>
                  </div>

                  {topImprovement && (
                    <>
                      <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
                      
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">Maximum Potential</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                          ${maxPotentialValue.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                          <p className="text-sm text-emerald-400 font-medium">
                            +${(maxPotentialValue - baselinePrice).toLocaleString()} upside
                          </p>
                        </div>
                      </div>

                      <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">Total Profit Potential</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                          ${maxTotalProfit.toLocaleString()}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {data.aiAnalysis && (
              <motion.div
                className="group relative overflow-hidden rounded-3xl"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-indigo-600/10 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Property Assessment</h3>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(data.aiAnalysis).map(([key, value]: [string, any]) => (
                      <motion.div 
                        key={key} 
                        className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/30 transition-all group/item"
                        whileHover={{ x: 4 }}
                      >
                        <span className="text-sm text-slate-300 font-medium">{formatQualityLabel(key)}</span>
                        <span className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-teal-500/20 border border-blue-500/30 rounded-xl text-sm font-bold text-white">
                          {value}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-8"
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 p-8 sm:p-10">

              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">Investment Portfolio</h2>
                  <p className="text-slate-400">
                    {improvements.length} strategic upgrade{improvements.length !== 1 ? 's' : ''} identified
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl"
                >
                  <span className="text-emerald-300 font-bold text-sm">{improvements.length} Opportunities</span>
                </motion.div>
              </div>

              <motion.div 
                variants={containerVariants} 
                initial="hidden" 
                animate="visible" 
                className="space-y-5"
              >
                {improvements.map((item: any, index: number) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                    className="group cursor-pointer"
                  >
                    <motion.div
                      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border transition-all duration-300"
                      style={{
                        borderColor: expandedCard === index ? 'rgb(59, 130, 246)' : 'rgb(148, 163, 184, 0.1)',
                      }}
                      whileHover={{ 
                        y: -4,
                        borderColor: 'rgb(59, 130, 246, 0.5)',
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-teal-600/0 group-hover:from-blue-600/10 group-hover:to-teal-600/10 transition-all duration-500" />
                      
                      <div className="relative p-7">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className={`px-4 py-1.5 rounded-xl bg-gradient-to-r ${getROIColor(item.roi)} shadow-lg font-bold text-white text-sm`}
                              >
                                #{index + 1}
                              </motion.div>
                              <h3 className="font-bold text-xl text-white">{formatQualityLabel(item.upgrade)}</h3>
                            </div>
                            <p className="text-sm text-slate-400 pl-1">
                              Current: <span className="text-slate-300 font-medium">{item.currentCondition}</span>
                            </p>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedCard === index ? 180 : 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 group-hover:border-blue-500/50 transition-colors"
                          >
                            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                          </motion.div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 p-6 rounded-2xl bg-slate-900/50 border border-slate-700/50">
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Investment</p>
                            <p className="text-2xl font-bold text-white">${item.cost?.toLocaleString() || "0"}</p>
                          </div>
                          <div className="flex items-center justify-center">
                            <motion.div
                              animate={{ 
                                x: [0, 8, 0],
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500/20 to-teal-500/20 border border-blue-500/30 flex items-center justify-center"
                            >
                              <ArrowUpRight className="w-5 h-5 text-blue-400" />
                            </motion.div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">New Value</p>
                            <p className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                              ${item.newPrice?.toLocaleString() || "0"}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                            <p className="text-xs text-emerald-400 uppercase tracking-wider mb-2 font-semibold">Net Profit</p>
                            <p className="text-3xl font-bold text-emerald-300">
                              ${item.netProfit?.toLocaleString() || "0"}
                            </p>
                          </div>
                          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                            <p className="text-xs text-blue-400 uppercase tracking-wider mb-2 font-semibold">Return on Investment</p>
                            <p className={`text-3xl font-bold bg-gradient-to-r ${getROIColor(item.roi)} bg-clip-text text-transparent`}>
                              {(item.roi || 0).toFixed(1)}%
                            </p>
                          </div>
                        </div>

                        <AnimatePresence>
                          {expandedCard === index && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="pt-6 mt-6 border-t border-slate-700/50 space-y-4">
                                <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-300 font-medium">Profit-to-Cost Ratio</span>
                                    <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                                      {((item.netProfit / item.cost) * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-center gap-4 mt-4">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedRenovation(item);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-blue-400 text-sm font-medium transition-colors"
                                  >
                                    <ArrowUpRight className="w-4 h-4" />
                                    View Details
                                  </button>
                                  {item.steps && item.steps.length > 0 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewSteps(formatQualityLabel(item.upgrade), item.steps);
                                      }}
                                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-medium transition-colors"
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                      View Steps
                                    </button>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}

                {improvements.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl flex items-center justify-center">
                      <Home className="w-10 h-10 text-slate-500" />
                    </div>
                    <p className="text-slate-400 text-lg">No renovation opportunities identified</p>
                    <p className="text-slate-500 text-sm mt-2">This property appears to be in optimal condition</p>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

function formatQualityLabel(key: string): string {
  const labels: { [key: string]: string } = {
    KitchenQual: "Kitchen Quality",
    BsmtQual: "Basement Quality",
    ExterQual: "Exterior Quality",
    KitchenUpgrade: "Kitchen",
    BsmtUpgrade: "Basement",
    ExterUpgrade: "Exterior",
  }
  return labels[key] || key.replace(/([A-Z])/g, " $1").trim()
}