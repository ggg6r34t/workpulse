"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Star, StarOff, Tag, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/app/hooks/useToast";
import { cn } from "@/lib/utils";

interface Props {
  onSelectTag?: (tag: string) => void;
}

interface FavoriteEntry {
  id: string;
  client: string;
  task: string;
}

const QuickTags = ({ onSelectTag }: Props) => {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [isAddingTag, setIsAddingTag] = useState(false);

  // Load tags and favorites from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const storedTags = localStorage.getItem("workpulse-tags");
        const storedFavorites = localStorage.getItem("workpulse-favorites");

        if (storedTags) {
          setTags(JSON.parse(storedTags));
        } else {
          const defaultTags = [
            "Design",
            "Meeting",
            "Development",
            "Research",
            "Admin",
          ];
          setTags(defaultTags);
          localStorage.setItem("workpulse-tags", JSON.stringify(defaultTags));
        }

        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error("Error loading tags or favorites:", error);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("workpulse-tags", JSON.stringify(tags));
    localStorage.setItem("workpulse-favorites", JSON.stringify(favorites));
  }, [tags, favorites]);

  const addTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag("");
      setIsAddingTag(false);
      toast({
        title: (
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span>Tag added</span>
          </div>
        ),
        description: `"${trimmedTag}" is now available for quick selection.`,
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
    toast({
      title: "Tag removed",
      description: `"${tagToRemove}" will no longer appear in your quick tags.`,
      variant: "error",
    });
  };

  const handleTagSelect = (tag: string) => {
    onSelectTag?.(tag);
  };

  // const addToFavorites = (client: string, task: string) => {
  //   const newFavorite: FavoriteEntry = {
  //     id: `${client}-${task}-${Date.now()}`,
  //     client,
  //     task,
  //   };

  //   if (!favorites.some((fav) => fav.client === client && fav.task === task)) {
  //     setFavorites([...favorites, newFavorite]);
  //     toast({
  //       title: (
  //         <div className="flex items-center gap-2">
  //           <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
  //           <span>Added to Favorites</span>
  //         </div>
  //       ),
  //       description: `"${task}" for "${client}" is now saved.`,
  //     });
  //   } else {
  //     toast({
  //       title: "Already saved",
  //       description: `This combination is already in your favorites.`,
  //     });
  //   }
  // };

  const removeFromFavorites = (id: string) => {
    setFavorites(favorites.filter((fav) => fav.id !== id));
    toast({
      title: "Removed from Favorites",
      description: "This item is no longer saved.",
      variant: "error",
    });
  };

  return (
    <div className="space-y-6">
      {/* Tags Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Quick Tags</h3>
            <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">
              {tags.length}
            </Badge>
          </div>

          <Popover open={isAddingTag} onOpenChange={setIsAddingTag}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 hover:bg-primary/5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Tag</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-64 p-3 shadow-lg border-border/50"
              align="end"
            >
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Create New Tag</h4>
                <div className="flex gap-2">
                  <Input
                    className="h-9 text-sm"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="e.g. Documentation"
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                    autoFocus
                  />
                  <Button size="sm" onClick={addTag} className="h-9">
                    Add
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={cn(
                "px-3 py-1.5 cursor-pointer transition-all",
                "hover:bg-primary/10 hover:text-primary",
                "group flex items-center gap-1.5"
              )}
              onClick={() => handleTagSelect(tag)}
            >
              <span>{tag}</span>
              <X
                className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
              />
            </Badge>
          ))}
        </div>
      </div>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <h3 className="text-sm font-medium">Saved Favorites</h3>
            <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">
              {favorites.length}
            </Badge>
          </div>

          <div className="space-y-2">
            {favorites.map((fav) => (
              <div
                key={fav.id}
                className={cn(
                  "flex justify-between items-center p-3 rounded-lg",
                  "border border-border/50 hover:border-primary/30",
                  "bg-background hover:bg-primary/5",
                  "transition-all cursor-pointer group"
                )}
                onClick={() => handleTagSelect(fav.task)}
              >
                <div className="space-y-1">
                  <div className="font-medium text-sm">{fav.task}</div>
                  <div className="text-xs text-muted-foreground">
                    {fav.client}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromFavorites(fav.id);
                  }}
                >
                  <StarOff className="h-4 w-4 text-muted-foreground hover:text-yellow-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickTags;
