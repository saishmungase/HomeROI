"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2 } from "lucide-react"

interface StepsDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  steps: string[]
}

export default function StepsDialog({ isOpen, onClose, title, steps }: StepsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-slate-900/95 backdrop-blur-xl border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-6 space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-white/5"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-slate-200">{step}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}