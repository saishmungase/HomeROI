"use client"

import { useState, useEffect } from "react"
import {
  Check,
  Wand2,
  ArrowRight,
  TrendingUp,
  Wrench,
  Paintbrush,
  RefreshCcw,
  Zap,
  X,
  ExternalLink,
} from "lucide-react"

export default function Page() {
  const [view, setView] = useState("input")
  const [loadingStep, setLoadingStep] = useState(0)
  const [url, setUrl] = useState("")
  const [data, setData] = useState(null)
  const [selectedRenovation, setSelectedRenovation] = useState(null)

  useEffect(() => {
    if (loadingStep > 0 && loadingStep < 5) {
      const timer = setTimeout(() => {
        setLoadingStep(loadingStep + 1)
      }, 1200)
      return () => clearTimeout(timer)
    } else if (loadingStep === 5) {
      setTimeout(() => {
        setData(MOCK_DATA)
        setView("dashboard")
      }, 600)
    }
  }, [loadingStep])

  const handleSubmit = (e : any) => {
    e.preventDefault()
    if (url.trim()) {
      setView("loading")
      setLoadingStep(1)
    }
  }

  const handleStartOver = () => {
    setView("input")
    setLoadingStep(0)
    setUrl("")
    setData(null)
    setSelectedRenovation(null)
  }

  const MOCK_DATA : any = {
    propertyImage: "/house.jpg",
    propBeds: 4,
    propBaths: 2.5,
    propSqft: 2300,
    address: "1247 Oak Ridge Drive, Los Angeles, CA",
    aiKitchen: "Dated",
    aiBath: "Average",
    aiCurb: "Average",
    currentValue: 510000,
    roiList: [
      {
        id: 1,
        title: "Modernize Kitchen",
        icon: Wrench,
        roi: 180,
        uplift: 70000,
        cost: 25000,
        profit: 45000,
        currentState:
          "Your kitchen features outdated steel and glass cabinets with limited storage capacity. The countertops are worn laminate, and appliances are 15+ years old.",
        improvements: [
          "Replace with modern wooden cabinets with soft-close doors and better storage solutions",
          "Install new quartz or granite countertops with modern finishes",
          "Upgrade to Energy Star-certified stainless steel appliances",
          "Add modern lighting fixtures and backsplash tiles",
          "Update flooring to durable, easy-to-clean materials",
        ],
        steps: [
          "Plan layout and select materials (1-2 weeks)",
          "Order custom cabinets and appliances (2-3 weeks)",
          "Remove old kitchen fixtures (2-3 days)",
          "Install new cabinets, countertops, and appliances (3-5 days)",
          "Install backsplash and lighting (2-3 days)",
          "Final touches and cleanup (1-2 days)",
        ],
        tutorials: [
          {
            title: "Modern Kitchen Renovation Guide",
            url: "https://www.youtube.com/results?search_query=kitchen+remodel+guide",
          },
          {
            title: "DIY Kitchen Cabinet Installation",
            url: "https://www.youtube.com/results?search_query=cabinet+installation",
          },
          {
            title: "Countertop Installation Tips",
            url: "https://www.youtube.com/results?search_query=countertop+installation",
          },
        ],
      },
      {
        id: 2,
        title: "Improve Curb Appeal",
        icon: Paintbrush,
        roi: 185,
        uplift: 68000,
        cost: 20000,
        profit: 48000,
        currentState:
          "The exterior shows faded paint, worn landscaping, and an outdated front entrance. The lawn needs professional landscaping, and the front door lacks modern appeal.",
        improvements: [
          "Fresh exterior paint in modern, neutral tones",
          "Professional landscaping with native plants and hardscaping",
          "New modern front door with hardware and sidelights",
          "Updated porch lighting and pathway lights",
          "Pressure washing and driveway sealing",
          "New mailbox and house numbers",
        ],
        steps: [
          "Plan design and choose color scheme (1 week)",
          "Prepare exterior and power wash (1-2 days)",
          "Paint exterior surfaces (3-4 days)",
          "Landscape and install hardscaping (3-5 days)",
          "Install new door, lighting, and fixtures (2-3 days)",
          "Final staging and cleanup (1 day)",
        ],
        tutorials: [
          {
            title: "Exterior House Painting Guide",
            url: "https://www.youtube.com/results?search_query=exterior+house+painting",
          },
          {
            title: "Professional Landscaping Ideas",
            url: "https://www.youtube.com/results?search_query=front+yard+landscaping",
          },
          {
            title: "Front Door Installation",
            url: "https://www.youtube.com/results?search_query=front+door+installation",
          },
        ],
      },
      {
        id: 3,
        title: "Remodel Master Bath",
        icon: Wrench,
        roi: 120,
        uplift: 35000,
        cost: 18000,
        profit: 17000,
        currentState:
          "The master bathroom features a basic white ceramic tile design with an aging tub, limited storage, and outdated fixtures from the 1990s.",
        improvements: [
          "Replace tub with modern soaking tub or spa shower",
          "Install contemporary tile work with premium materials",
          "Add double vanity with quality countertops and storage",
          "Modern lighting and ventilation system",
          "Heated floor system for luxury appeal",
          "Updated plumbing fixtures in brushed nickel or chrome",
        ],
        steps: [
          "Design layout and select materials (1 week)",
          "Order fixtures and materials (1-2 weeks)",
          "Remove existing fixtures (2-3 days)",
          "Install plumbing and electrical (3-4 days)",
          "Install tile and flooring (3-4 days)",
          "Install fixtures and finalize (2-3 days)",
        ],
        tutorials: [
          {
            title: "Bathroom Remodel Complete Guide",
            url: "https://www.youtube.com/results?search_query=bathroom+remodel",
          },
          {
            title: "Tile Installation for Bathrooms",
            url: "https://www.youtube.com/results?search_query=bathroom+tile+installation",
          },
          {
            title: "Modern Vanity Installation",
            url: "https://www.youtube.com/results?search_query=bathroom+vanity+installation",
          },
        ],
      },
    ],
  }

  return (
    <>
      {view === "input" && <InputView onSubmit={handleSubmit} url={url} setUrl={setUrl} />}
      {view === "loading" && <LoadingView loadingStep={loadingStep} />}
      {view === "dashboard" && data && (
        <DashboardView
          data={data}
          onStartOver={handleStartOver}
          selectedRenovation={selectedRenovation}
          setSelectedRenovation={setSelectedRenovation}
        />
      )}
    </>
  )
}

function InputView({ onSubmit, url, setUrl }) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-2xl w-full">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <Wand2 className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-4">Welcome to HomeROI</h1>

        <p className="text-xl text-slate-300 text-center mb-12">Stop predicting. Start prescribing.</p>

        <form onSubmit={onSubmit} className="mb-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition duration-300" />
            <input
              type="url"
              placeholder="Paste your Zillow or Redfin URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="relative w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition text-lg"
            />
            <button
              type="submit"
              disabled={!url.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-lg"
            >
              Analyze <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Zap, label: "Instant Analysis", desc: "AI-powered insights in seconds" },
            { icon: TrendingUp, label: "ROI Rankings", desc: "Prioritized renovation recommendations" },
            { icon: Wand2, label: "Property Details", desc: "Comprehensive condition assessment" },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 transition"
            >
              <feature.icon className="w-6 h-6 text-violet-400 mb-2" />
              <p className="font-semibold text-white text-sm">{feature.label}</p>
              <p className="text-xs text-slate-400 mt-1">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-700 pt-8">
          {[
            { number: "50K+", label: "Properties Analyzed" },
            { number: "92%", label: "Avg ROI Accuracy" },
            { number: "$2.3M", label: "Total Uplift Identified" },
            { number: "24/7", label: "AI Powered" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-bold text-emerald-400 mb-1">{stat.number}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LoadingView({ loadingStep }) {
  const steps = [
    { title: "Fetching property data...", icon: Wand2 },
    { title: "AI: Analyzing kitchen condition...", icon: Wrench },
    { title: "AI: Assessing curb appeal...", icon: Paintbrush },
    { title: "Calculating renovation ROI...", icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-md w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Analyzing...</h2>
          <p className="text-slate-400 text-sm">Running AI models on your property</p>
        </div>

        <div className="space-y-5 mb-12">
          {steps.map((step, stepIndex) => {
            const StepIcon = step.icon
            return (
              <div key={stepIndex} className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1 flex-none">
                    {loadingStep > stepIndex ? (
                      <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-emerald-500/50">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    ) : loadingStep === stepIndex ? (
                      <div className="w-7 h-7 rounded-full border-2 border-transparent border-t-violet-500 border-r-violet-500 animate-spin shadow-lg" />
                    ) : (
                      <div className="w-7 h-7 rounded-full border-2 border-slate-700 bg-slate-800/50" />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <p
                      className={`font-semibold transition ${loadingStep >= stepIndex ? "text-white" : "text-slate-500"}`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>

                {stepIndex < steps.length - 1 && (
                  <div
                    className={`absolute left-3.5 top-10 w-0.5 h-8 transition-colors ${
                      loadingStep > stepIndex ? "bg-emerald-500" : "bg-slate-700"
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>

        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-violet-500/50 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function DashboardView({ data, onStartOver, selectedRenovation, setSelectedRenovation }) {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {selectedRenovation && (
        <RenovationModal renovation={selectedRenovation} onClose={() => setSelectedRenovation(null)} />
      )}

      <header className="border-b border-slate-700 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">HomeROI</span>
          </div>
          <button
            onClick={onStartOver}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition font-medium"
          >
            <RefreshCcw className="w-4 h-4" />
            Analyze New
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Your HomeROI Dashboard</h1>
          <p className="text-slate-400 text-lg">{data.address}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
              <img src={data.propertyImage || "/placeholder.svg"} alt="Property" className="w-full h-64 object-cover" />
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-sm font-semibold text-slate-400 uppercase mb-4">Property Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Bedrooms</span>
                  <span className="text-lg font-bold text-white">{data.propBeds}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-700 pt-4">
                  <span className="text-slate-400">Bathrooms</span>
                  <span className="text-lg font-bold text-white">{data.propBaths}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-700 pt-4">
                  <span className="text-slate-400">Sq Ft</span>
                  <span className="text-lg font-bold text-white">{data.propSqft.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-sm font-semibold text-slate-400 uppercase mb-4">AI Assessment</h3>
              <div className="space-y-3">
                <ConditionItem label="Kitchen" condition={data.aiKitchen} />
                <ConditionItem label="Bathroom" condition={data.aiBath} />
                <ConditionItem label="Curb Appeal" condition={data.aiCurb} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl">
              <p className="text-sm font-semibold text-slate-400 uppercase mb-2">Current Value</p>
              <p className="text-4xl font-bold text-emerald-400">${data.currentValue.toLocaleString()}</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Top ROI Renovations</h3>

              <div className="space-y-4">
                {data.roiList.map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedRenovation(item)}
                      className="p-6 bg-slate-700/50 border border-slate-600 rounded-xl hover:bg-slate-700 transition group cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-violet-500/30 transition">
                            <IconComponent className="w-6 h-6 text-violet-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-white text-lg">{item.title}</h4>
                              <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-1 rounded-md">
                                #{index + 1}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-emerald-400">{item.roi}%</p>
                          <p className="text-xs text-slate-400">ROI</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-600">
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Investment Cost</p>
                          <p className="text-lg font-bold text-white">${item.cost.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Value Uplift</p>
                          <p className="text-lg font-bold text-emerald-400">${item.uplift.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Net Profit</p>
                          <p className="text-lg font-bold text-emerald-500">${item.profit.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onStartOver}
            className="px-8 py-3 bg-violet-600 hover:bg-violet-700 rounded-lg font-bold text-white flex items-center gap-2 mx-auto transition shadow-lg"
          >
            <RefreshCcw className="w-5 h-5" />
            Analyze Another Property
          </button>
        </div>
      </main>
    </div>
  )
}

function RenovationModal({ renovation, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-500/20 rounded-lg flex items-center justify-center">
              {renovation.icon && <renovation.icon className="w-6 h-6 text-violet-400" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{renovation.title}</h2>
              <p className="text-sm text-emerald-400">{renovation.roi}% ROI</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-1">Investment Cost</p>
              <p className="text-xl font-bold text-white">${renovation.cost.toLocaleString()}</p>
            </div>
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-1">Value Uplift</p>
              <p className="text-xl font-bold text-emerald-400">${renovation.uplift.toLocaleString()}</p>
            </div>
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-1">Net Profit</p>
              <p className="text-xl font-bold text-emerald-500">${renovation.profit.toLocaleString()}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-3">Current State</h3>
            <p className="text-slate-300 leading-relaxed">{renovation.currentState}</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-3">Suggested Improvements</h3>
            <ul className="space-y-2">
              {renovation.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-violet-400" />
                  </span>
                  <span className="text-slate-300">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-3">Implementation Timeline</h3>
            <div className="space-y-2">
              {renovation.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 font-bold text-sm text-emerald-400">
                    {index + 1}
                  </span>
                  <span className="text-slate-300 pt-0.5">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-3">Video Tutorials & Guides</h3>
            <div className="space-y-2">
              {renovation.tutorials.map((tutorial, index) => (
                <a
                  key={index}
                  href={tutorial.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg transition"
                >
                  <ExternalLink className="w-5 h-5 text-violet-400 flex-shrink-0" />
                  <span className="text-slate-300 hover:text-white transition">{tutorial.title}</span>
                </a>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-lg font-bold text-white transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  )
}

function ConditionItem({ label, condition }) {
  const getClasses = (condition) => {
    switch (condition) {
      case "Dated":
        return "text-red-400"
      case "Average":
        return "text-amber-400"
      case "Excellent":
        return "text-emerald-400"
      default:
        return "text-slate-400"
    }
  }

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-slate-300 text-sm">{label}</span>
      <span className={`font-semibold text-sm ${getClasses(condition)}`}>{condition}</span>
    </div>
  )
}
