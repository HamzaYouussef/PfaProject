"use client"

import type React from "react"
import { useParams, Link } from "react-router-dom"
import AppLayout from "../components/layout/AppLayout"
import { useScan } from "../context/ScanContext"
import Button from "../components/ui/Button"
import { Download, ArrowLeft, ClipboardCopy, FileText, ImageIcon, Clock, CheckCircle } from "lucide-react"
import { useEffect } from "react"

const ScanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { scans } = useScan()

  const scan = scans.find((s) => s.id === id)

  // Ensure proper layout rendering
  useEffect(() => {
    // This forces a layout recalculation which might help with rendering issues
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('resize'))
      }
    }, 50)
    
    return () => clearTimeout(timer)
  }, [])

  if (!scan) {
    return (
      <AppLayout enforceStandardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md mx-auto">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Scan not found</h2>
            <p className="text-gray-500 mb-6">The requested scan could not be located in your history.</p>
            <Link to="/history">
              <Button variant="primary" icon={<ArrowLeft className="h-4 w-4" />}>
                Return to History
              </Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    )
  }

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(scan.extractedText || "")
      console.log("Text copied to clipboard")
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handleDownloadText = () => {
    const element = document.createElement("a")
    const file = new Blob([scan.extractedText || ""], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `scan_${scan.id.slice(0, 8)}_${new Date(scan.createdAt).toISOString().split("T")[0]}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const formattedDate = new Date(scan.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <AppLayout enforceStandardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
        {/* Debug overlay - can be removed after confirming fix */}
        <div className="fixed top-0 left-0 w-full h-1 bg-red-500 z-50 opacity-0 hover:opacity-100 transition-opacity" 
             title="Layout debug marker" />
        
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <Link to="/history" className="text-indigo-600 hover:text-indigo-500 transition-colors mt-1">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                Scan Details
              </h1>
              <div className="flex items-center mt-2 text-gray-600">
                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                <p>Scanned on {formattedDate}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" icon={<ClipboardCopy className="h-4 w-4" />} onClick={handleCopyText}>
              Copy Text
            </Button>
            <Button variant="primary" icon={<Download className="h-4 w-4" />} onClick={handleDownloadText}>
              Download
            </Button>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="mb-6 flex items-center gap-2 bg-indigo-50/50 border border-indigo-100 rounded-lg p-3 w-fit">
          <CheckCircle className="h-5 w-5 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-800">
            Confidence level: <span className="font-bold">{Math.round(scan.confidence * 100)}%</span>
          </span>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center">
              <ImageIcon className="h-5 w-5 text-indigo-500 mr-2" />
              <h3 className="font-medium text-gray-900">Original Image</h3>
            </div>
            <div className="p-4">
              <img
                src={scan.imageUrl || "/placeholder.svg"}
                alt="Original scan"
                className="w-full h-auto rounded-lg border border-gray-200"
              />
            </div>
          </div>

          {/* Text Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center">
              <FileText className="h-5 w-5 text-indigo-500 mr-2" />
              <h3 className="font-medium text-gray-900">Extracted Text</h3>
            </div>
            <div className="p-4 flex-grow overflow-auto">
              <pre className="whitespace-pre-wrap font-sans text-gray-800 bg-gray-50 p-4 rounded-lg">
                {scan.extractedText || <span className="text-gray-400">No text was extracted from this scan</span>}
              </pre>
            </div>
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end">
              <Button variant="ghost" size="sm" icon={<ClipboardCopy className="h-4 w-4" />} onClick={handleCopyText}>
                Copy to Clipboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default ScanDetailPage