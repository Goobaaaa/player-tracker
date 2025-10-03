"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { getPlayers, getPlayerAssets } from "@/lib/data";
import { Player } from "@/lib/database";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { useTemplate } from "@/contexts/template-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, Eye, Edit } from "lucide-react";
import FadeInCard from "@/components/fade-in-card";
import PlayerModal from "@/components/player-modal";

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [assetCounts, setAssetCounts] = useState<Record<string, number>>({});
  
  const router = useRouter();
  const supabase = createClient();

  const loadPlayers = useCallback(async () => {
    try {
      const playersData = await getPlayers();
      setPlayers(playersData);
      setFilteredPlayers(playersData);

      // Fetch asset counts for all players
      const counts: Record<string, number> = {};
      for (const player of playersData) {
        const assets = await getPlayerAssets(player.id);
        counts[player.id] = assets.length;
      }
      setAssetCounts(counts);
    } catch (error) {
      console.error("Error loading players:", error);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setIsAuthenticated(true);
      loadPlayers();
    };
    checkAuth();
  }, [loadPlayers, router, supabase.auth]);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredPlayers(players);
    } else {
      const filtered = players.filter(player =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.alias.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPlayers(filtered);
    }
  }, [searchQuery, players]);

  const handleViewPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlayer(null);
    setIsEditMode(false);
  };

  const handlePlayerSaved = () => {
    // Reload players to get the updated list
    loadPlayers();
    setIsModalOpen(false);
    setSelectedPlayer(null);
    setIsEditMode(false);
  };

  const handlePlayerDeleted = (playerId: string) => {
    // Remove the player from the local state to update UI immediately
    setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== playerId));
  };

  const handleCreatePlayer = () => {
    setSelectedPlayer(null);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div className="h-8 bg-gray-700 rounded w-32"></div>
                <div className="h-10 bg-gray-700 rounded w-40"></div>
              </div>
              <div className="mb-6">
                <div className="relative max-w-md">
                  <div className="h-10 bg-gray-700 rounded w-full"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-800 border-gray-700 rounded-lg p-6 animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                        <div>
                          <div className="h-5 bg-gray-700 rounded w-32 mb-1"></div>
                          <div className="h-4 bg-gray-700 rounded w-24"></div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                      <div className="h-4 bg-gray-700 rounded w-16"></div>
                      <div className="h-4 bg-gray-700 rounded w-16"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-8 bg-gray-700 rounded flex-1"></div>
                      <div className="h-8 bg-gray-700 rounded w-8"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">Suspects</h1>
              <Button onClick={handleCreatePlayer} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Suspect
              </Button>
            </div>

            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search suspects by name or alias..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlayers.map((player, index) => (
                <FadeInCard
                    key={player.id}
                    delay={index + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      return false;
                    }}
                  >
                  <Card
                    className="bg-gray-800 border-gray-700 transition-all-smooth hover:shadow-lg hover:border-blue-500 hover:scale-102"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      return false;
                    }}
                  >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={player.avatarUrl || undefined} alt={player.name} />
                          <AvatarFallback className="bg-blue-600">
                            {player.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-white text-lg">{player.name}</CardTitle>
                          <p className="text-gray-400 text-sm">{player.alias}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {player.notes && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {player.notes}
                      </p>
                    )}

                    <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                      <span>Assets: {assetCounts[player.id] || 0}</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleViewPlayer(player);
                          return false;
                        }}
                        className="flex-1 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEditPlayer(player);
                          return false;
                        }}
                        className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                </FadeInCard>
                );
              })}
            </div>

            {filteredPlayers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No suspects found</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <PlayerModal
        player={selectedPlayer}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPlayerSaved={handlePlayerSaved}
        onPlayerDeleted={handlePlayerDeleted}
        isEditMode={isEditMode}
      />
    </div>
  );
}