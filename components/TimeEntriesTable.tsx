"use client";

import React, {
  Fragment,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Download, Filter, Tag, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import EmptyState from "./table/EmptyState";
import { exportToCSV } from "@/lib/export";
import { Table, TableBody } from "@/components/ui/table";
import TablePagination from "./table/TablePagination";
import TimeEntryDescription from "./table/TimeEntryDescription";
import TimeEntriesTableHeader from "./table/TimeEntriesTableHeader";
import TimeEntryRow from "./table/TimeEntryRow";
import { useTimeTracker } from "@/app/contexts/TimeTrackerContext";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import TimeEntryCard from "./TimeEntryCard";
import AdvancedFilters from "./AdvancedFilters";

const ITEMS_PER_PAGE = 10;

const TimeEntriesTable = () => {
  const { timeEntries, deleteEntry } = useTimeTracker();
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  // Detect mobile view
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Auto-switch to card view on mobile
  useEffect(() => {
    if (isMobile) {
      setViewMode("card");
    }
  }, [isMobile]);

  // Extract all unique tags from entries (memoized)
  const availableTagsMemo = useMemo(() => {
    const tags = timeEntries.reduce((acc, entry) => {
      if (entry.tags && entry.tags.length > 0) {
        entry.tags.forEach((tag) => {
          if (!acc.includes(tag)) {
            acc.push(tag);
          }
        });
      }
      return acc;
    }, [] as string[]);
    return tags;
  }, [timeEntries]);

  useEffect(() => {
    setAvailableTags(availableTagsMemo);
  }, [availableTagsMemo]);

  // Toggle row expansion (memoized)
  const toggleRowExpansion = useCallback((entryId: string) => {
    setExpandedRows((prev) =>
      prev.includes(entryId)
        ? prev.filter((id) => id !== entryId)
        : [...prev, entryId]
    );
  }, []);

  // Filter entries by selected tags and search query (memoized)
  const filteredEntries = useMemo(() => {
    return timeEntries.filter((entry) => {
      // Filter by selected tags
      if (selectedTags.length > 0) {
        if (
          !entry.tags ||
          !entry.tags.some((tag) => selectedTags.includes(tag))
        ) {
          return false;
        }
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesClient = entry.client.toLowerCase().includes(query);
        const matchesTask = entry.task.toLowerCase().includes(query);
        const matchesDescription = entry.description
          ? entry.description.toLowerCase().includes(query)
          : false;
        const matchesTags = entry.tags
          ? entry.tags.some((tag) => tag.toLowerCase().includes(query))
          : false;

        return (
          matchesClient || matchesTask || matchesDescription || matchesTags
        );
      }

      return true;
    });
  }, [timeEntries, selectedTags, searchQuery]);

  // Sort entries by start time, most recent first (memoized)
  const sortedEntries = useMemo(() => {
    return [...filteredEntries].sort(
      (a, b) => b.startTime.getTime() - a.startTime.getTime()
    );
  }, [filteredEntries]);

  // Calculate pagination (memoized)
  const totalPages = useMemo(() => {
    return Math.ceil(sortedEntries.length / ITEMS_PER_PAGE);
  }, [sortedEntries.length]);

  const handleExport = () => {
    // Only export completed entries
    const completedEntries = timeEntries.filter(
      (entry) => entry.endTime !== null
    );
    exportToCSV(completedEntries);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Toggle tag filter
  const toggleTagFilter = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedTags([]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const [clientFilter, setClientFilter] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null,
  });

  // Enhanced filtering with date range and client
  const enhancedFilteredEntries = useMemo(() => {
    return filteredEntries.filter((entry) => {
      // Client filter
      if (clientFilter) {
        if (!entry.client.toLowerCase().includes(clientFilter.toLowerCase())) {
          return false;
        }
      }

      // Date range filter
      if (dateRange.from || dateRange.to) {
        const entryDate = new Date(entry.startTime);
        entryDate.setHours(0, 0, 0, 0);

        if (dateRange.from) {
          const fromDate = new Date(dateRange.from);
          fromDate.setHours(0, 0, 0, 0);
          if (entryDate < fromDate) {
            return false;
          }
        }

        if (dateRange.to) {
          const toDate = new Date(dateRange.to);
          toDate.setHours(23, 59, 59, 999);
          if (entryDate > toDate) {
            return false;
          }
        }
      }

      return true;
    });
  }, [filteredEntries, clientFilter, dateRange]);

  // Update sorted entries to use enhanced filtered entries
  const finalSortedEntries = useMemo(() => {
    return [...enhancedFilteredEntries].sort(
      (a, b) => b.startTime.getTime() - a.startTime.getTime()
    );
  }, [enhancedFilteredEntries]);

  // Update pagination to use final sorted entries
  const finalTotalPages = useMemo(() => {
    return Math.ceil(finalSortedEntries.length / ITEMS_PER_PAGE);
  }, [finalSortedEntries.length]);

  const finalPaginatedEntries = useMemo(() => {
    return finalSortedEntries.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [finalSortedEntries, currentPage]);

  const handleClearFilters = () => {
    clearFilters();
    setClientFilter("");
    setDateRange({ from: null, to: null });
  };

  return (
    <div className="space-y-6 mt-10">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          Time Entries
        </h2>

        <div className="flex gap-2 flex-wrap">
          <AdvancedFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            availableTags={availableTags}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            clientFilter={clientFilter}
            onClientFilterChange={setClientFilter}
            onClear={handleClearFilters}
          />
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
            className="border-primary/20 text-primary hover:text-primary hover:bg-primary/5 hover:border-primary/30 rounded-lg min-h-[44px]"
          >
            <Filter className="h-4 w-4 md:mr-2" />
            <span className="hidden md:block">Quick Filter</span>
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="border-primary/20 text-primary hover:text-primary hover:bg-primary/5 hover:border-primary/30 rounded-lg min-h-[44px]"
            disabled={timeEntries.length === 0}
            aria-label="Export to CSV"
          >
            <Download className="h-4 w-4 md:mr-2" />
            <span className="hidden md:block">Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Search and filter section */}
      {showFilters && (
        <div className="border rounded-lg p-4 bg-muted/10 space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="search"
                className="text-sm font-medium mb-1 block"
              >
                Search entries
              </label>
              <div className="relative">
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by client, task, tag..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9"
                />
                <Filter className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-destructive h-9 whitespace-nowrap mt-auto"
              >
                <X className="h-4 w-4 mr-1" />
                Clear filters
              </Button>
            )}
          </div>

          {availableTags.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Filter by tag
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className={`px-3 py-1 cursor-pointer transition-all ${
                      selectedTags.includes(tag)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-primary/10"
                    }`}
                    onClick={() => toggleTagFilter(tag)}
                  >
                    {tag}
                    {selectedTags.includes(tag) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results summary */}
      {(selectedTags.length > 0 ||
        searchQuery ||
        clientFilter ||
        dateRange.from ||
        dateRange.to) && (
        <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
          <span>
            Showing {enhancedFilteredEntries.length} of {timeEntries.length}{" "}
            entries
          </span>
          {(selectedTags.length > 0 ||
            searchQuery ||
            clientFilter ||
            dateRange.from ||
            dateRange.to) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-6 text-xs min-h-[32px]"
            >
              <X className="h-3 w-3 mr-1" />
              Clear all
            </Button>
          )}
        </div>
      )}

      {timeEntries.length > 0 ? (
        <>
          {enhancedFilteredEntries.length > 0 ? (
            <>
              {/* View Mode Toggle (Desktop only) */}
              {!isMobile && (
                <div className="flex items-center justify-end gap-2">
                  <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                    <Button
                      variant={viewMode === "table" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("table")}
                      className="h-8 min-h-[44px]"
                      aria-label="Table view"
                    >
                      Table
                    </Button>
                    <Button
                      variant={viewMode === "card" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("card")}
                      className="h-8 min-h-[44px]"
                      aria-label="Card view"
                    >
                      Cards
                    </Button>
                  </div>
                </div>
              )}

              {/* Table View */}
              {viewMode === "table" && (
                <div className="border rounded-xl overflow-hidden shadow-sm">
                  <Table>
                    <TimeEntriesTableHeader />
                    <TableBody>
                      {finalPaginatedEntries.map((entry) => (
                        <Fragment key={entry.id}>
                          <TimeEntryRow
                            entry={entry}
                            isExpanded={expandedRows.includes(entry.id)}
                            onToggleExpand={toggleRowExpansion}
                            onDelete={deleteEntry}
                          />

                          {/* Expanded description row */}
                          {expandedRows.includes(entry.id) &&
                            entry.description && (
                              <TimeEntryDescription
                                description={entry.description}
                                tags={entry.tags}
                              />
                            )}
                        </Fragment>
                      ))}
                    </TableBody>
                  </Table>

                  <TablePagination
                    currentPage={currentPage}
                    totalPages={finalTotalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}

              {/* Card View (Mobile/Desktop) */}
              {viewMode === "card" && (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {finalPaginatedEntries.map((entry) => (
                      <TimeEntryCard
                        key={entry.id}
                        entry={entry}
                        onDelete={deleteEntry}
                        onSwipeDelete={deleteEntry}
                      />
                    ))}
                  </div>

                  <TablePagination
                    currentPage={currentPage}
                    totalPages={finalTotalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 px-4">
              <div className="bg-muted/50 p-4 rounded-full w-fit mx-auto mb-4">
                <Tag className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No matching entries
              </h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                No time entries match your current filters or search criteria.
                Try adjusting your filters to see more results.
              </p>
              <Button
                onClick={clearFilters}
                variant="outline"
                className="mt-2 min-h-[44px]"
                aria-label="Clear all filters and search"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default TimeEntriesTable;
