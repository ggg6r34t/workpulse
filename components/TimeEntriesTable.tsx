"use client";

import React, { Fragment, useState } from "react";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import EmptyState from "./table/EmptyState";
import { exportToCSV } from "@/lib/export";
import { Table, TableBody } from "@/components/ui/table";
import TablePagination from "./table/TablePagination";
import TimeEntryDescription from "./table/TimeEntryDescription";
import TimeEntriesTableHeader from "./table/TimeEntriesTableHeader";
import TimeEntryRow from "./table/TimeEntryRow";
import { useTimeTracker } from "@/app/contexts/TimeTrackerContext";

const ITEMS_PER_PAGE = 10;

const TimeEntriesTable = () => {
  const { timeEntries, deleteEntry } = useTimeTracker();
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  // Toggle row expansion
  const toggleRowExpansion = (entryId: string) => {
    setExpandedRows((prev) =>
      prev.includes(entryId)
        ? prev.filter((id) => id !== entryId)
        : [...prev, entryId]
    );
  };

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

  return (
    <div className="space-y-6 mt-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          Time Entries
        </h2>
        <Button
          onClick={handleExport}
          variant="outline"
          size="sm"
          className="border-primary/20 text-primary hover:text-primary hover:bg-primary/5 hover:border-primary/30 rounded-lg"
          disabled={timeEntries.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {timeEntries.length > 0 ? (
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
        <EmptyState />
      )}
    </div>
  );
};

export default TimeEntriesTable;
