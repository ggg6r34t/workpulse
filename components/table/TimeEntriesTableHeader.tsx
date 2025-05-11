import React from "react";
import { Calendar, Clock, Tag } from "lucide-react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TimeEntriesTableHeader = () => {
  return (
    <TableHeader className="bg-muted/30">
      <TableRow>
        <TableHead className="font-medium w-10"></TableHead>
        <TableHead className="font-medium">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> Date
          </div>
        </TableHead>
        <TableHead className="font-medium">Client</TableHead>
        <TableHead className="font-medium">Task</TableHead>
        <TableHead className="font-medium">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> Time
          </div>
        </TableHead>
        <TableHead className="font-medium">Status</TableHead>
        <TableHead>
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            <span>Tags</span>
          </div>
        </TableHead>
        <TableHead className="font-medium">Duration</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default TimeEntriesTableHeader;
