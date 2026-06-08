"use client"

import * as React from "react"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Archive } from "@prisma/client"
import ArchiveTile from "@/app/components/ui/archive-tile"

interface ArchiveClientProps {
  initialArchives: Archive[]
}

interface Filters {
  title: string
  date: string
  search: string
  contentType: string
}

type SortOption = "eventDate" | "createdAt" | "title" | "default"

export default function ArchiveClient({ initialArchives }: ArchiveClientProps) {
  const [filteredArchives, setFilteredArchives] = React.useState(initialArchives)
  const [filters, setFilters] = React.useState<Filters>({
    title: "",
    date: "",
    search: "",
    contentType: "",
  })
  const [sortBy, setSortBy] = React.useState<SortOption>("eventDate")

  // Extract unique dates for filter dropdown
  const uniqueDates = React.useMemo(() => {
    return Array.from(
      new Set(
        initialArchives
          .map((a) => a.eventDate || a.createdAt)
          .map((d) => new Date(d).toDateString())
      )
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  }, [initialArchives])

  // Get content type for an archive entry
  const getContentType = (archive: Archive) => {
    if (archive.fileMimeType?.startsWith("image/")) return "image"
    if (archive.fileMimeType?.startsWith("audio/")) return "audio"
    if (archive.fileMimeType === "application/pdf") return "pdf"
    if (archive.URL) return "video-link"
    return "text"
  }

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    applyFiltersAndSort(newFilters, sortBy)
  }

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort)
    applyFiltersAndSort(filters, newSort)
  }

  const applyFiltersAndSort = (currentFilters: Filters, currentSort: SortOption) => {
    const filtered = [...initialArchives.filter((archive) => {
      const matchesTitle =
        !currentFilters.title || archive.title.toLowerCase().includes(currentFilters.title.toLowerCase())
      const matchesSearch =
        !currentFilters.search ||
        archive.title.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
        archive.description?.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
        archive.content?.toLowerCase().includes(currentFilters.search.toLowerCase())
      const matchesDate =
        !currentFilters.date ||
        new Date(archive.eventDate || archive.createdAt).toDateString() === currentFilters.date
      const matchesContentType =
        !currentFilters.contentType || getContentType(archive) === currentFilters.contentType

      return matchesTitle && matchesSearch && matchesDate && matchesContentType
    })]

    // Apply sorting
    switch (currentSort) {
      case "eventDate":
        filtered.sort((a, b) => {
          const dateA = a.eventDate || a.createdAt
          const dateB = b.eventDate || b.createdAt
          return new Date(dateB).getTime() - new Date(dateA).getTime()
        })
        break
      case "createdAt":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "default":
      default:
        // Keep original order
        break
    }

    setFilteredArchives(filtered)
  }

  const clearFilters = () => {
    setFilters({ title: "", date: "", search: "", contentType: "" })
    setSortBy("eventDate")
    setFilteredArchives(initialArchives)
  }

  const hasActiveFilters = filters.title || filters.date || filters.search || filters.contentType

  return (
    <div className="space-y-6">
      {/* Search */}
      <Input
        placeholder="Search archive..."
        value={filters.search}
        onChange={(e) => handleFilterChange("search", e.target.value)}
        className="border-black bg-cream/5 text-black placeholder:text-black"
      />

      {/* Sort Options */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-cream/60 font-impact">Sort By</p>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => handleSortChange("eventDate")}
            className={`rounded-none ${
              sortBy === "eventDate"
                ? "bg-red text-cream hover:bg-red/90"
                : "bg-black text-cream hover:bg-black/60bg-black border border-black hover:border hover:border-cream text-cream font-impact rounded-none"
            }`}
          >
            Publish Date
          </Button>
          <Button
            onClick={() => handleSortChange("createdAt")}
            className={`rounded-none ${
              sortBy === "createdAt"
                ? "bg-red text-cream hover:bg-red/90"
                : "bg-black border border-black hover:border hover:border-cream text-cream font-impact rounded-none"
            }`}
          >
            Recently Added
          </Button>
          <Button
            onClick={() => handleSortChange("title")}
            className={`rounded-none ${
              sortBy === "title"
                ? "bg-red text-cream hover:bg-red/90"
                : "bg-black border border-black hover:border hover:border-cream text-cream font-impact rounded-none"
            }`}
          >
            A-Z Title
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4">
        {/* Desktop filters */}
        <div className="hidden md:grid md:grid-cols-4 gap-4">
          <Input
            placeholder="Filter by Title"
            value={filters.title}
            onChange={(e) => handleFilterChange("title", e.target.value)}
            className="border-black bg-cream/5 text-black placeholder:text-black"
          />

          <select
            value={filters.contentType}
            onChange={(e) => handleFilterChange("contentType", e.target.value)}
            className="px-3 py-2 border-2 border-black bg-cream/5 text-black rounded-none hover:border-black/50 focus:outline-none focus:border-black"
          >
            <option value="">All Content Types</option>
            <option value="image">Images</option>
            <option value="audio">Audio</option>
            <option value="pdf">PDFs</option>
            <option value="video-link">Videos/Links</option>
            <option value="text">Text Only</option>
          </select>

          <select
            value={filters.date}
            onChange={(e) => handleFilterChange("date", e.target.value)}
            className="px-3 py-2 border-2 border-black bg-cream/5 text-black rounded-none hover:border-black/50 focus:outline-none focus:border-black"
          >
            <option value="">All Dates</option>
            {uniqueDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              className="bg-red/10 border border-black text-cream hover:bg-red/20 rounded-none"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Mobile filters */}
        <div className="md:hidden space-y-2">
          <Input
            placeholder="Filter by Title"
            value={filters.title}
            onChange={(e) => handleFilterChange("title", e.target.value)}
            className="w-full border-black bg-cream/5 text-black placeholder:text-black/50"
          />
          <select
            value={filters.contentType}
            onChange={(e) => handleFilterChange("contentType", e.target.value)}
            className="w-full px-3 py-2 border-2 border-black bg-cream/5 text-black rounded-none hover:border-black/50 focus:outline-none focus:border-black"
          >
            <option value="">All Content Types</option>
            <option value="image">Images</option>
            <option value="audio">Audio</option>
            <option value="pdf">PDFs</option>
            <option value="video-link">Videos/Links</option>
            <option value="text">Text Only</option>
          </select>
          <select
            value={filters.date}
            onChange={(e) => handleFilterChange("date", e.target.value)}
            className="w-full px-3 py-2 border-2 border-black bg-cream/5 text-black rounded-none hover:border-black/50 focus:outline-none focus:border-black"
          >
            <option value="">All Dates</option>
            {uniqueDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              className="w-full bg-red/10 border border-black text-cream hover:bg-red/20 rounded-none"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {filteredArchives.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-cream/60 mb-4">No entries found matching your filters.</p>
          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-black text-cream hover:bg-red/10"
            >
              Clear all filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
          {filteredArchives.map((archive) => (
            <ArchiveTile key={archive.id} archive={archive} />
          ))}
        </div>
      )}
    </div>
  )
}
