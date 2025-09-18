"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockPlayers, getAllTasks, mockDocuments } from "@/lib/mock-data";
import { Player, Task, Document } from "@/lib/database";

interface SearchResult {
  id: string;
  type: 'player' | 'task' | 'document';
  title: string;
  description: string;
  url: string;
}

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isDropdownFocused, setIsDropdownFocused] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search players
    mockPlayers.forEach(player => {
      if (
        player.name.toLowerCase().includes(query) ||
        player.alias?.toLowerCase().includes(query) ||
        player.phoneNumber?.toLowerCase().includes(query)
      ) {
        results.push({
          id: player.id,
          type: 'player',
          title: player.name,
          description: `Alias: ${player.alias} • Phone: ${player.phoneNumber || 'N/A'}`,
          url: `/players/${player.id}`
        });
      }
    });

    // Search tasks
    getAllTasks().forEach(task => {
      if (
        task.name.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      ) {
        results.push({
          id: task.id,
          type: 'task',
          title: task.name,
          description: task.description || 'No description',
          url: `/tasks`
        });
      }
    });

    // Search documents
    mockDocuments.forEach(doc => {
      if (
        doc.filename.toLowerCase().includes(query) ||
        doc.description?.toLowerCase().includes(query)
      ) {
        results.push({
          id: doc.id,
          type: 'document',
          title: doc.filename,
          description: doc.description || 'Document',
          url: `/documents`
        });
      }
    });

    setSearchResults(results.slice(0, 8)); // Limit to 8 results
    setShowDropdown(true);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'player': return '👥';
      case 'task': return '✅';
      case 'document': return '📄';
      default: return '🔍';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'player': return 'bg-blue-600';
      case 'task': return 'bg-green-600';
      case 'document': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div ref={searchRef} className="relative max-w-md flex-1">
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
        <Input
          type="text"
          placeholder="Search players, tasks, documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (searchResults.length > 0) {
              setShowDropdown(true);
            }
          }}
          className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        />
      </form>

      {/* Search Results Dropdown */}
      {showDropdown && searchResults.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border-gray-700 shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="px-3 py-2 text-xs text-gray-400 font-medium">
              Search Results ({searchResults.length})
            </div>
            {searchResults.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => {
                  router.push(result.url);
                  setShowDropdown(false);
                  setSearchQuery("");
                }}
                className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors group"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-lg mt-0.5">{getTypeIcon(result.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-white truncate">
                        {result.title}
                      </span>
                      <Badge className={`text-xs ${getTypeColor(result.type)}`}>
                        {result.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {result.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
            {searchResults.length >= 8 && (
              <div className="px-3 py-2 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                    setShowDropdown(false);
                  }}
                  className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  View all results
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}