"use client";

import React, { Fragment, useEffect, useState } from "react";
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

const ITEMS_PER_PAGE = 10;

const TimeEntriesTable = () => {
  const { timeEntries, deleteEntry } = useTimeTracker();
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Extract all unique tags from entries
  useEffect(() => {
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
    setAvailableTags(tags);
  }, [timeEntries]);

  // Toggle row expansion
  const toggleRowExpansion = (entryId: string) => {
    setExpandedRows((prev) =>
      prev.includes(entryId)
        ? prev.filter((id) => id !== entryId)
        : [...prev, entryId]
    );
  };

  // Filter entries by selected tags and search query
  const filteredEntries = timeEntries.filter((entry) => {
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

      return matchesClient || matchesTask || matchesDescription || matchesTags;
    }

    return true;
  });

  // Sort entries by start time, most recent first
  const sortedEntries = [...timeEntries].sort(
    (a, b) => b.startTime.getTime() - a.startTime.getTime()
  );

  // Calculate pagination
  const totalPages = Math.ceil(sortedEntries.length / ITEMS_PER_PAGE);
  const paginatedEntries = sortedEntries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

  return (
    <div className="space-y-6 mt-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          Time Entries
        </h2>

        <div className="flex gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
            className="border-primary/20 text-primary hover:text-primary hover:bg-primary/5 hover:border-primary/30 rounded-lg"
          >
            <Filter className="h-4 w-4 md:mr-2" />
            <span className="hidden md:block">Filter</span>
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="border-primary/20 text-primary hover:text-primary hover:bg-primary/5 hover:border-primary/30 rounded-lg"
            disabled={timeEntries.length === 0}
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
      {(selectedTags.length > 0 || searchQuery) && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredEntries.length} of {timeEntries.length} entries
          {selectedTags.length > 0 && (
            <span> • Filtered by tags: {selectedTags.join(", ")}</span>
          )}
        </div>
      )}

      {timeEntries.length > 0 ? (
        <>
          {filteredEntries.length > 0 ? (
            <div className="border rounded-xl overflow-hidden shadow-sm">
              <Table>
                <TimeEntriesTableHeader />
                <TableBody>
                  {paginatedEntries.map((entry) => (
                    <Fragment key={entry.id}>
                      <TimeEntryRow
                        entry={entry}
                        isExpanded={expandedRows.includes(entry.id)}
                        onToggleExpand={toggleRowExpansion}
                        onDelete={deleteEntry}
                      />

                      {/* Expanded description row */}
                      {expandedRows.includes(entry.id) && entry.description && (
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
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          ) : (
            <div className="text-center py-10 border rounded-lg bg-muted/5">
              <Tag className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No matching entries</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your filters or search criteria.
              </p>
              <Button onClick={clearFilters} variant="outline" className="mt-4">
                Clear filters
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
