import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  formatDate,
  formatTime,
  calculateDuration,
  formatDuration,
} from "@/lib/time";
import { TimeEntry } from "@/types/types";
import { Trash2, ChevronDown, ChevronUp, FileText } from "lucide-react";

interface Props {
  entry: TimeEntry;
  isExpanded: boolean;
  onToggleExpand: (entryId: string) => void;
  onDelete: (entryId: string) => void;
}

const TimeEntryRow = ({
  entry,
  isExpanded,
  onToggleExpand,
  onDelete,
}: Props) => {
  return (
    <TableRow
      className={`
        ${
          entry.isActive
            ? entry.isPaused
              ? "bg-yellow-50/50 border-l-4 border-l-yellow-400"
              : "bg-green-50/50 border-l-4 border-l-green-400 animate-pulse"
            : "hover:bg-muted/5 border-l-4 border-l-transparent"
        }
        transition-colors cursor-pointer
      `}
      onClick={() => entry.description && onToggleExpand(entry.id)}
    >
      <TableCell className="w-10">
        {entry.description && (
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(entry.id);
            }}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        )}
      </TableCell>
      <TableCell className="font-medium">
        {formatDate(entry.startTime)}
      </TableCell>
      <TableCell className="text-muted-foreground">{entry.client}</TableCell>
      <TableCell>
        <div className="font-medium text-foreground/80 flex items-center gap-1">
          {entry.description && (
            <FileText className="h-3.5 w-3.5 text-primary/70" />
          )}
          {entry.task}
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap text-muted-foreground">
        {formatTime(entry.startTime)}
        {entry.endTime && <span> - {formatTime(entry.endTime)}</span>}
      </TableCell>
      <TableCell>
        {entry.endTime ? (
          <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
            Completed
          </span>
        ) : entry.isPaused ? (
          <span className="px-2 py-1 bg-yellow-50 text-yellow-600 text-xs rounded-full">
            Paused
          </span>
        ) : (
          <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full">
            Running
          </span>
        )}
      </TableCell>
      <TableCell className="font-medium">
        {entry.endTime ? (
          formatDuration(calculateDuration(entry))
        ) : entry.isActive && !entry.isPaused ? (
          <span className="text-green-600">Running...</span>
        ) : (
          <span className="text-yellow-600">Paused</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(entry.id);
          }}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default TimeEntryRow;
