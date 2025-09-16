"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { mockGetSession } from "@/lib/mock-auth";
import { mockPlayers, getPlayerAssets, getPlayerTransactions, calculatePlayerBalance, calculatePlayerAssetsValue } from "@/lib/mock-data";
import { Player, Asset, FinanceTransaction } from "@/lib/database";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, DollarSign, Package, FileText, Plus } from "lucide-react";

export default function PlayerDetailPage() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const playerId = params.id as string;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session }, error } = await mockGetSession();
    if (error || !session) {
      router.push("/login");
      return;
    }

    loadPlayerData();
  };

  const loadPlayerData = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const foundPlayer = mockPlayers.find(p => p.id === playerId);
      if (foundPlayer) {
        setPlayer(foundPlayer);
        setAssets(getPlayerAssets(playerId));
        setTransactions(getPlayerTransactions(playerId));
      }
    } catch (error) {
      console.error("Error loading player data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Player not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={() => router.push("/players")}
                className="mb-4 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Players
              </Button>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={player.avatarUrl} alt={player.name} />
                    <AvatarFallback className="bg-blue-600 text-xl">
                      {player.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-bold text-white">{player.name}</h1>
                    <p className="text-gray-400 text-lg">{player.alias}</p>
                    <Badge variant="outline" className="mt-2 border-gray-600 text-gray-300">
                      ID: {player.id}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-sm text-gray-400">Cash Balance</p>
                        <p className="text-xl font-bold text-white">${calculatePlayerBalance(playerId).toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Package className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-400">Total Assets</p>
                        <p className="text-xl font-bold text-white">${calculatePlayerAssetsValue(playerId).toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-purple-400" />
                      <div>
                        <p className="text-sm text-gray-400">Asset Count</p>
                        <p className="text-xl font-bold text-white">{assets.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-gray-700">
                <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:bg-gray-600">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="assets" className="text-gray-300 data-[state=active]:bg-gray-600">
                  Assets & Finances
                </TabsTrigger>
                <TabsTrigger value="documents" className="text-gray-300 data-[state=active]:bg-gray-600">
                  Documents
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Player Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-white mb-2">Notes</h3>
                        <p className="text-gray-400">{player.notes || "No notes available"}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-white mb-2">Joined</h3>
                        <p className="text-gray-400">
                          {new Date(player.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="assets">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-white">Assets</CardTitle>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Asset
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {assets.map((asset) => (
                          <div key={asset.id} className="p-4 bg-gray-700 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium text-white">{asset.name}</h3>
                                <p className="text-sm text-gray-400">{asset.type}</p>
                              </div>
                              <Badge variant="outline" className="border-gray-600 text-gray-300">
                                Qty: {asset.quantity}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-400">Value: ${asset.value.toLocaleString()}</span>
                              <span className="text-white">
                                Total: ${(asset.value * asset.quantity).toLocaleString()}
                              </span>
                            </div>
                            {asset.notes && (
                              <p className="text-sm text-gray-400 mt-2">{asset.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-white">Transactions</CardTitle>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Transaction
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {transactions.map((transaction) => (
                          <div key={transaction.id} className="p-4 bg-gray-700 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium text-white">{transaction.description}</h3>
                              <Badge className={
                                transaction.type === 'credit'
                                  ? 'bg-green-600'
                                  : 'bg-red-600'
                              }>
                                {transaction.type}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-400">
                                {new Date(transaction.createdAt).toLocaleDateString()}
                              </span>
                              <span className={
                                transaction.type === 'credit'
                                  ? 'text-green-400 font-medium'
                                  : 'text-red-400 font-medium'
                              }>
                                {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="documents">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white">Documents</CardTitle>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Document
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-400">No documents attached to this player</p>
                      <p className="text-gray-500 text-sm mt-2">Upload or link documents to track player-related files</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}