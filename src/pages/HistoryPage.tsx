"use client"

import type React from "react"
import { useState, useEffect } from "react"
import AppLayout from "../components/layout/AppLayout"
import { useScan } from "../context/ScanContext"
import ScanCard from "../components/history/ScanCard"
import { FileText, Clock, Search, PlusCircle, ChevronLeft, ChevronRight, Frown } from "lucide-react"
import Button from "../components/ui/Button"
import { Link } from "react-router-dom"

const HistoryPage: React.FC = () => {
  const { scans } = useScan()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [scansPerPage] = useState(6) // 6 scans per page (2 rows of 3 in desktop view)

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Filter scans based on search term
  const filteredScans = scans.filter(
    (scan) =>
      scan.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(scan.createdAt).toLocaleDateString().includes(searchTerm),
  )

  // Pagination logic
  const indexOfLastScan = currentPage * scansPerPage
  const indexOfFirstScan = indexOfLastScan - scansPerPage
  const currentScans = filteredScans.slice(indexOfFirstScan, indexOfLastScan)
  const totalPages = Math.ceil(filteredScans.length / scansPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <AppLayout>
      {/* Container centralisé avec padding responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Scan History
            </h1>
            <div className="flex items-center mt-2 text-gray-600">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              <p>Review and manage all your previous scans</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/scan">
              <Button icon={<PlusCircle className="h-4 w-4" />} variant="primary">
                New Scan
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 mb-8 border border-gray-100 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-amber-500 mr-2" />
              <span className="text-gray-700">
                <span className="font-medium">{scans.length}</span> scans in total
              </span>
            </div>
            <div className="flex items-center">
              <Search className="h-5 w-5 text-indigo-500 mr-2" />
              <span className="text-gray-700">
                Last scan:{" "}
                {scans.length > 0
                  ? new Date(scans[0].createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Never"}
              </span>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        {scans.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-2xl mx-auto">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No scans yet</h3>
            <p className="text-gray-500 mb-6">Start by creating your first scan to see results here</p>
            <Link to="/scan">
              <Button icon={<PlusCircle className="h-4 w-4" />} variant="primary">
                Perform First Scan
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Barre de recherche/filtre */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search scans by content or date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Results count */}
            {filteredScans.length > 0 && (
              <div className="mb-4 text-sm text-gray-500">
                Showing {filteredScans.length} {filteredScans.length === 1 ? "result" : "results"}
                {searchTerm && <span> for "{searchTerm}"</span>}
              </div>
            )}

            {/* Grille de scans */}
            {filteredScans.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentScans.map((scan) => (
                  <ScanCard key={scan.id} scan={scan} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <Frown className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No results found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search criteria</p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstScan + 1}</span> to{" "}
                      <span className="font-medium">{Math.min(indexOfLastScan, filteredScans.length)}</span> of{" "}
                      <span className="font-medium">{filteredScans.length}</span> scans
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
          </>
        )}
      </div>
    </AppLayout>
  )
}

export default HistoryPage
