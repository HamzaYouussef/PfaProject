"use client"

import type React from "react"
import { useState } from "react"
import AppLayout from "../components/layout/AppLayout"
import ScanResultDisplay from "../components/scan/ScanResult"
import { useScan } from "../context/ScanContext"
import type { ScanResult } from "../types"
import { Cloudinary } from "@cloudinary/url-gen"
import { AdvancedImage } from "@cloudinary/react"
import { fill } from "@cloudinary/url-gen/actions/resize"
import { FilePond, registerPlugin } from "react-filepond"
import "filepond/dist/filepond.min.css"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"
import { Loader2, Scan, Sparkles, Search, ChevronLeft, ChevronRight, History, Frown } from "lucide-react"

// Register FilePond plugins
registerPlugin(FilePondPluginImagePreview)

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dxc5curxy",
  },
})

// Mock scan history for demonstration
const mockScanHistory: ScanResult[] = [
  {
    id: "1",
    imageUrl: "https://res.cloudinary.com/dxc5curxy/image/upload/v1621234567/sample1.jpg",
    text: "This is a sample text from the first document. It contains some extracted content from an image.",
    confidence: 0.92,
    timestamp: new Date("2023-05-15T10:30:00").toISOString(),
    language: "en",
  },
  {
    id: "2",
    imageUrl: "https://res.cloudinary.com/dxc5curxy/image/upload/v1621234568/sample2.jpg",
    text: "Voici un exemple de texte en français extrait d'un document scanné.",
    confidence: 0.88,
    timestamp: new Date("2023-05-14T14:20:00").toISOString(),
    language: "fr",
  },
  {
    id: "3",
    imageUrl: "https://res.cloudinary.com/dxc5curxy/image/upload/v1621234569/sample3.jpg",
    text: "This is another example of extracted text from a document. It might contain important information.",
    confidence: 0.95,
    timestamp: new Date("2023-05-13T09:15:00").toISOString(),
    language: "en",
  },
  {
    id: "4",
    imageUrl: "https://res.cloudinary.com/dxc5curxy/image/upload/v1621234570/sample4.jpg",
    text: "Sample invoice #1234 from Company XYZ. Total amount: $1,234.56",
    confidence: 0.91,
    timestamp: new Date("2023-05-12T16:45:00").toISOString(),
    language: "en",
  },
  {
    id: "5",
    imageUrl: "https://res.cloudinary.com/dxc5curxy/image/upload/v1621234571/sample5.jpg",
    text: "Meeting notes: Discussed project timeline and deliverables. Next meeting scheduled for June 15.",
    confidence: 0.87,
    timestamp: new Date("2023-05-11T11:30:00").toISOString(),
    language: "en",
  },
  {
    id: "6",
    imageUrl: "https://res.cloudinary.com/dxc5curxy/image/upload/v1621234572/sample6.jpg",
    text: "Receipt from Local Store. Date: 2023-05-10. Items: Groceries $45.32, Household $23.15",
    confidence: 0.89,
    timestamp: new Date("2023-05-10T13:20:00").toISOString(),
    language: "en",
  },
  {
    id: "7",
    imageUrl: "https://res.cloudinary.com/dxc5curxy/image/upload/v1621234573/sample7.jpg",
    text: "Contract agreement between Party A and Party B for services rendered during fiscal year 2023.",
    confidence: 0.94,
    timestamp: new Date("2023-05-09T10:10:00").toISOString(),
    language: "en",
  },
]

const ScanPage: React.FC = () => {
  const { processImage, isProcessing } = useScan()
  const [files, setFiles] = useState<any[]>([])
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // New state for scan history, pagination and search
  const [scanHistory, setScanHistory] = useState<ScanResult[]>(mockScanHistory)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [resultsPerPage] = useState(3)
  const [showHistory, setShowHistory] = useState(false)

  // Filter scan history based on search term
  const filteredHistory = scanHistory.filter((scan) => scan.text.toLowerCase().includes(searchTerm.toLowerCase()))

  // Pagination logic
  const indexOfLastResult = currentPage * resultsPerPage
  const indexOfFirstResult = indexOfLastResult - resultsPerPage
  const currentResults = filteredHistory.slice(indexOfFirstResult, indexOfLastResult)
  const totalPages = Math.ceil(filteredHistory.length / resultsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const serverOptions = {
    process: (
      fieldName: string,
      file: File,
      metadata: any,
      load: (fileUrl: string) => void,
      error: (errorText: string) => void,
      progress: (progress: number) => void,
      abort: () => void,
    ) => {
      const data = new FormData()
      data.append("file", file)
      data.append("upload_preset", "pfa_preset")
      data.append("cloud_name", "dxc5curxy")

      fetch("https://api.cloudinary.com/v1_1/dxc5curxy/image/upload", {
        method: "POST",
        body: data,
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Échec de l'upload")

          const result = await res.json()
          if (result && result.secure_url) {
            setImageUrl(result.secure_url)
            setError(null)
            load(result.secure_url)
          } else {
            throw new Error("Réponse Cloudinary invalide")
          }
        })
        .catch((err) => {
          console.error("Erreur lors du téléchargement de l'image:", err)
          setError("Erreur lors du téléchargement de l'image, veuillez réessayer.")
          error("Échec du téléchargement")
          abort()
        })

      return {
        abort: () => {
          abort()
        },
      }
    },
  }

  const handleProcessImage = async () => {
    if (!imageUrl) {
      setError("Veuillez uploader une image avant de la traiter.")
      return
    }

    try {
      setError(null)
      const result = await processImage(imageUrl)
      setCurrentResult(result)

      // Add the new result to scan history
      if (result) {
        setScanHistory((prevHistory) => [result, ...prevHistory])
      }
    } catch (err: any) {
      console.error("Erreur lors du traitement de l'image:", err)
      setError(err.message || "Erreur lors du traitement de l'image.")
    }
  }

  const getPublicIdFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      const pathSegments = urlObj.pathname.split("/")
      const filename = pathSegments[pathSegments.length - 1]
      return filename.split(".")[0]
    } catch {
      return null
    }
  }

  const handleViewScanHistory = () => {
    setShowHistory(!showHistory)
  }

  const handleSelectHistoryItem = (result: ScanResult) => {
    setCurrentResult(result)
    setImageUrl(result.imageUrl)
    setShowHistory(false)
  }

  const publicId = imageUrl ? getPublicIdFromUrl(imageUrl) : null
  const displayImage = publicId ? cld.image(publicId) : null

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with gradient text */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Extract Text from Images
            </h1>
            <p className="mt-2 text-gray-600">Upload handwritten or printed documents to extract text with AI</p>
          </div>
          <button
            onClick={handleViewScanHistory}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <History className="h-4 w-4 text-indigo-600" />
            {showHistory ? "Hide History" : "View History"}
          </button>
        </div>

        {/* Scan History Section */}
        {showHistory && (
          <div className="mb-6 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <History className="h-5 w-5 text-indigo-600" />
                    Scan History
                  </h2>
                  <span className="text-sm text-gray-500">
                    {filteredHistory.length} {filteredHistory.length === 1 ? "result" : "results"} found
                  </span>
                </div>

                {/* Search Bar */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search in extracted text..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setCurrentPage(1) // Reset to first page when searching
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Results List */}
                <div className="space-y-4">
                  {currentResults.length > 0 ? (
                    currentResults.map((scan) => (
                      <div
                        key={scan.id}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleSelectHistoryItem(scan)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden">
                            {scan.imageUrl && (
                              <img
                                src={scan.imageUrl || "/placeholder.svg"}
                                alt="Scanned document thumbnail"
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 font-medium truncate">
                              {new Date(scan.timestamp).toLocaleDateString()} at{" "}
                              {new Date(scan.timestamp).toLocaleTimeString()}
                            </p>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{scan.text}</p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-gray-500">
                                Confidence: {Math.round(scan.confidence * 100)}%
                              </span>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className="text-xs text-gray-500 uppercase">{scan.language}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <Frown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No results found</p>
                      <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{indexOfFirstResult + 1}</span> to{" "}
                          <span className="font-medium">{Math.min(indexOfLastResult, filteredHistory.length)}</span> of{" "}
                          <span className="font-medium">{filteredHistory.length}</span> results
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="h-5 w-5" />
                          <span className="sr-only">Previous</span>
                        </button>

                        <div className="hidden md:flex">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                page === currentPage
                                  ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        <div className="md:hidden">
                          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium">
                            {currentPage} / {totalPages}
                          </span>
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="h-5 w-5" />
                          <span className="sr-only">Next</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Upload Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Scan className="h-5 w-5 text-indigo-600" />
                Upload Your Document
              </h2>
              {imageUrl && (
                <button
                  onClick={() => {
                    setFiles([])
                    setImageUrl(null)
                    setCurrentResult(null)
                  }}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Clear
                </button>
              )}
            </div>

            <FilePond
              files={files}
              onupdatefiles={setFiles}
              allowMultiple={false}
              server={serverOptions}
              name="file"
              maxFiles={1}
              acceptedFileTypes={["image/*"]}
              labelIdle={
                '<div class="flex flex-col items-center justify-center gap-2 text-gray-500 h-full pt-20">' +
                '<svg class="w-12 h-12 mb-2 text-indigo-400 mt-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
                '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>' +
                "</svg>" +
                '<span>Drag & drop your image or <span class="text-indigo-600 font-medium">browse</span></span>' +
                '<span class="text-xs">Supports JPG, PNG (Max 5MB)</span>' +
                '<span class="text-xs text-gray-400 mt-4">Powered by POINA</span>' +
                "</div>"
              }
              className="border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-300 transition-colors h-64" // Hauteur fixe de 64 unités (16rem)
            />
          </div>

          {error && (
            <div className="px-6 pb-4">
              <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-red-600 text-sm">{error}</div>
            </div>
          )}
        </div>

        {/* Image Preview and Process Button */}
        {imageUrl && displayImage && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Document Preview
              </h3>
              <div className="flex justify-center">
                <AdvancedImage
                  cldImg={displayImage.resize(fill().width(500))}
                  className="rounded-lg border border-gray-200 shadow-xs max-w-full h-auto"
                />
              </div>
            </div>

            {!currentResult && !isProcessing && (
              <div className="flex justify-center">
                <button
                  onClick={handleProcessImage}
                  className="group flex items-center justify-center gap-2 px-6 py-3 w-full max-w-md bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <Scan className="h-5 w-5 group-hover:animate-pulse" />
                  Extract Text
                </button>
              </div>
            )}
          </div>
        )}

        {/* Processing and Results */}
        <div className="mt-8 space-y-6">
          {isProcessing && !currentResult && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col items-center justify-center">
              <div className="relative">
                <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
                <div className="absolute inset-0 rounded-full border-2 border-indigo-100 animate-ping opacity-75"></div>
              </div>
              <p className="mt-4 text-gray-600 font-medium">Analyzing your document...</p>
              <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
            </div>
          )}

          {currentResult && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <ScanResultDisplay result={currentResult} isProcessing={isProcessing} imageUrl={imageUrl} />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

export default ScanPage
