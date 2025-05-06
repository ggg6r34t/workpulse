import React from "react";

import { TableCell, TableRow } from "@/components/ui/table";

interface Props {
  description: string;
  tags?: string[];
}

const TimeEntryDescription = ({ description, tags }: Props) => {
  return (
    <TableRow className="bg-muted/10 animate-accordion-down">
      <TableCell colSpan={8} className="py-3">
        <div className="ml-6 pl-4 border-l-2 border-primary/30">
          <h4 className="text-sm font-medium mb-1 text-primary">Description</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {description}
          </p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TimeEntryDescription;
