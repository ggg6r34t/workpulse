"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, X, Calendar as CalendarIcon, Tag } from "lucide-react";
// Date formatting helper
const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
import { cn } from "@/lib/utils";

interface AdvancedFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags: string[];
  dateRange?: { from: Date | null; to: Date | null };
  onDateRangeChange?: (range: { from: Date | null; to: Date | null }) => void;
  clientFilter?: string;
  onClientFilterChange?: (client: string) => void;
  onClear: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagsChange,
  availableTags,
  dateRange,
  onDateRangeChange,
  clientFilter,
  onClientFilterChange,
  onClear,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localDateRange, setLocalDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>(dateRange || { from: null, to: null });

  const hasActiveFilters =
    searchQuery ||
    selectedTags.length > 0 ||
    localDateRange.from ||
    localDateRange.to ||
    clientFilter;

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleDateRangeChange = (range: {
    from: Date | null;
    to: Date | null;
  }) => {
    setLocalDateRange(range);
    if (onDateRangeChange) {
      onDateRangeChange(range);
    }
  };

  const handleApply = () => {
    if (onDateRangeChange) {
      onDateRangeChange(localDateRange);
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    onSearchChange("");
    onTagsChange([]);
    setLocalDateRange({ from: null, to: null });
    if (onDateRangeChange) {
      onDateRangeChange({ from: null, to: null });
    }
    if (onClientFilterChange) {
      onClientFilterChange("");
    }
    onClear();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "border-primary/20 text-primary hover:text-primary hover:bg-primary/5 hover:border-primary/30 rounded-lg min-h-[44px]",
            hasActiveFilters && "bg-primary/10 border-primary/30"
          )}
          aria-label="Open advanced filters"
        >
          <Filter className="h-4 w-4 md:mr-2" />
          <span className="hidden md:block">Advanced Filters</span>
          {hasActiveFilters && (
            <Badge
              variant="secondary"
              className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {[
                searchQuery ? 1 : 0,
                selectedTags.length,
                localDateRange.from || localDateRange.to ? 1 : 0,
                clientFilter ? 1 : 0,
              ].reduce((a, b) => a + b, 0)}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Advanced Filters
          </DialogTitle>
          <DialogDescription>
            Filter your time entries by multiple criteria
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="advanced-search">Search</Label>
            <div className="relative">
              <Input
                id="advanced-search"
                type="text"
                placeholder="Search by client, task, tag, description..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 min-h-[44px]"
              />
              <Filter className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Date Range */}
          {onDateRangeChange && (
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal min-h-[44px]",
                        !localDateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localDateRange.from ? (
                        formatDate(localDateRange.from)
                      ) : (
                        <span>From date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3">
                      <Input
                        type="date"
                        value={
                          localDateRange.from
                            ? localDateRange.from.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => {
                          const date = e.target.value
                            ? new Date(e.target.value)
                            : null;
                          handleDateRangeChange({
                            from: date,
                            to: localDateRange.to,
                          });
                        }}
                        className="min-h-[44px]"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal min-h-[44px]",
                        !localDateRange.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localDateRange.to ? (
                        formatDate(localDateRange.to)
                      ) : (
                        <span>To date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3">
                      <Input
                        type="date"
                        value={
                          localDateRange.to
                            ? localDateRange.to.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => {
                          const date = e.target.value
                            ? new Date(e.target.value)
                            : null;
                          handleDateRangeChange({
                            from: localDateRange.from,
                            to: date,
                          });
                        }}
                        className="min-h-[44px]"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Tags */}
          {availableTags.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Filter by Tags
              </Label>
              <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/20">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className={cn(
                      "px-3 py-1 cursor-pointer transition-all min-h-[44px] flex items-center",
                      selectedTags.includes(tag)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-primary/10"
                    )}
                    onClick={() => handleTagToggle(tag)}
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

          {/* Client Filter */}
          {onClientFilterChange && (
            <div className="space-y-2">
              <Label>Client</Label>
              <Input
                type="text"
                placeholder="Filter by client..."
                value={clientFilter || ""}
                onChange={(e) => onClientFilterChange(e.target.value)}
                className="min-h-[44px]"
              />
            </div>
          )}

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="p-3 bg-muted/50 rounded-lg space-y-2">
              <Label className="text-sm font-semibold">Active Filters:</Label>
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Search: {searchQuery}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => onSearchChange("")}
                    />
                  </Badge>
                )}
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleTagToggle(tag)}
                    />
                  </Badge>
                ))}
                {localDateRange.from && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    From: {formatDate(localDateRange.from)}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        handleDateRangeChange({
                          from: null,
                          to: localDateRange.to,
                        })
                      }
                    />
                  </Badge>
                )}
                {localDateRange.to && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    To: {formatDate(localDateRange.to)}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        handleDateRangeChange({
                          from: localDateRange.from,
                          to: null,
                        })
                      }
                    />
                  </Badge>
                )}
                {clientFilter && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Client: {clientFilter}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => onClientFilterChange?.("")}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="ghost"
            onClick={handleClear}
            disabled={!hasActiveFilters}
            className="min-h-[44px]"
          >
            Clear All
          </Button>
          <Button onClick={handleApply} className="min-h-[44px]">
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedFilters;
