"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { mockPlayers, getAllTasks, mockDocuments } from "@/lib/mock-data";

import Link from "next/link";

interface SearchResult {
  id: string;
  type: 'player' | 'task' | 'document';
  title: string;
  description: string;
  url: string;
  relevanceScore: number;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'player' | 'task' | 'document'>('all');

  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    const performSearch = () => {
      const queryLower = query.toLowerCase();
      const results: SearchResult[] = [];

      // Search players
      mockPlayers.forEach(player => {
        let score = 0;
        if (player.name.toLowerCase().includes(queryLower)) score += 10;
        if (player.alias?.toLowerCase().includes(queryLower)) score += 8;
        if (player.phoneNumber?.toLowerCase().includes(queryLower)) score += 5;
        if (player.notes?.toLowerCase().includes(queryLower)) score += 3;

        if (score > 0) {
          results.push({
            id: player.id,
            type: 'player',
            title: player.name,
            description: `Alias: ${player.alias} • Phone: ${player.phoneNumber || 'N/A'} • Status: ${player.status}`,
            url: `/players/${player.id}`,
            relevanceScore: score
          });
        }
      });

      // Search tasks
      getAllTasks().forEach(task => {
        let score = 0;
        if (task.name.toLowerCase().includes(queryLower)) score += 10;
        if (task.description?.toLowerCase().includes(queryLower)) score += 5;
        if (task.assignedUsers.some(userId => userId.toLowerCase().includes(queryLower))) score += 3;

        if (score > 0) {
          results.push({
            id: task.id,
            type: 'task',
            title: task.name,
            description: task.description || 'No description' + ` • Priority: ${task.priority} • Status: ${task.status}`,
            url: `/tasks`,
            relevanceScore: score
          });
        }
      });

      // Search documents
      mockDocuments.forEach(doc => {
        let score = 0;
        if (doc.filename.toLowerCase().includes(queryLower)) score += 10;
        if (doc.description?.toLowerCase().includes(queryLower)) score += 5;

        if (score > 0) {
          results.push({
            id: doc.id,
            type: 'document',
            title: doc.filename,
            description: doc.description || `Document uploaded at ${new Date(doc.createdAt).toLocaleDateString()}`,
            url: `/documents`,
            relevanceScore: score
          });
        }
      });

      // Sort by relevance score
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);
      setSearchResults(results);
      setLoading(false);
    };

    // Simulate search delay
    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const filteredResults = filterType === 'all'
    ? searchResults
    : searchResults.filter(result => result.type === filterType);

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
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">Search Results</h1>
              <p className="text-gray-400">
                {query ? `Searching for "${query}"` : 'Enter a search term to find results'}
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search players, tasks, documents..."
                  defaultValue={query}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400 mr-2">Filter by type:</span>
                {(['all', 'player', 'task', 'document'] as const).map(type => (
                  <Button
                    key={type}
                    variant={filterType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType(type)}
                    className={
                      filterType === type
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "border-gray-600 text-gray-300 hover:bg-gray-700"
                    }
                  >
                    {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Results Summary */}
            <div className="mb-4">
              <p className="text-gray-400">
                {loading
                  ? 'Searching...'
                  : `Found ${filteredResults.length} result${filteredResults.length !== 1 ? 's' : ''}`
                }
              </p>
            </div>

            {/* Search Results */}
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Searching...</p>
              </div>
            ) : filteredResults.length === 0 ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-400 mb-2">No results found</p>
                  <p className="text-gray-500 text-sm">
                    {query
                      ? `Try adjusting your search terms or filters`
                      : 'Enter a search term to find results'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredResults.map((result) => (
                  <Link key={`${result.type}-${result.id}`} href={result.url}>
                    <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <span className="text-2xl">{getTypeIcon(result.type)}</span>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-white">{result.title}</h3>
                              <Badge className={`${getTypeColor(result.type)} text-white`}>
                                {result.type}
                              </Badge>
                            </div>
                            <p className="text-gray-400 text-sm mb-2">{result.description}</p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-500">
                                Relevance: {Math.round((result.relevanceScore / 10) * 100)}%
                              </p>
                              <p className="text-xs text-blue-400 hover:text-blue-300">
                                View details →
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}