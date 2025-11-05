"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useState } from "react"

interface RenovationModalProps {
  renovation: any
  onClose: () => void
}

export default function RenovationModal({ renovation, onClose }: RenovationModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "details">("overview")

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          <motion.div
            className="sticky top-0 bg-gradient-to-b from-slate-800 to-slate-800/50 border-b border-slate-700/50 flex items-center justify-between p-6 backdrop-blur-sm"
            layoutId="modal-header"
          >
            <div>
              <h2 className="text-2xl font-bold text-white">{renovation.upgrade}</h2>
              <p className="text-sm text-teal-400 mt-1">{(renovation.roi || 0).toFixed(1)}% ROI</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition"
            >
              <X className="w-6 h-6 text-slate-400" />
            </motion.button>
          </motion.div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4"
              >
                <p className="text-xs text-slate-400 mb-2 uppercase font-semibold">Investment Cost</p>
                <p className="text-2xl font-bold text-white">${renovation.cost?.toLocaleString() || "0"}</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4"
              >
                <p className="text-xs text-slate-400 mb-2 uppercase font-semibold">New Value</p>
                <p className="text-2xl font-bold text-teal-400">${renovation.newPrice?.toLocaleString() || "0"}</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-teal-500/20 to-teal-500/10 border border-teal-500/30 rounded-lg p-4"
              >
                <p className="text-xs text-slate-400 mb-2 uppercase font-semibold">Net Profit</p>
                <p className="text-2xl font-bold text-teal-400">${renovation.netProfit?.toLocaleString() || "0"}</p>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-lg font-bold text-white mb-3">Current Condition</h3>
              <p className="text-slate-300 leading-relaxed">
                This property area is currently in {renovation.currentCondition} condition and presents a significant
                opportunity for value appreciation through targeted upgrades.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-lg font-bold text-white mb-4">Implementation Timeline</h3>
              <div className="space-y-2">
                {[
                  "Plan layout and select materials",
                  "Order components",
                  "Remove existing fixtures",
                  "Install new components",
                  "Final touches and cleanup",
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-slate-700/20 border border-slate-600/30 rounded-lg"
                  >
                    <span className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0 font-bold text-sm text-teal-400">
                      {index + 1}
                    </span>
                    <span className="text-slate-300 pt-0.5 text-sm">{step}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg font-semibold text-white transition shadow-lg shadow-blue-500/50 mt-6"
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
