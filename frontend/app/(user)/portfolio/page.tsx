"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useAssetStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Building2, Wallet } from "lucide-react"
import { useEffect, useState } from "react"
import { OwnedFractionalNFT } from "@/lib/contract-types"
import AssetTransferModal from "@/components/user/asset-transfer-modal"

import { Skeleton } from "@/components/ui/skeleton"

interface OwnershipData {
  totalAssets: number
  fractionalOwnership: OwnedFractionalNFT[]
}

export default function PortfolioDashboard() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { ownedFractionalNFTs, loadOwnedFractionalNFTs } = useAssetStore()
  const [ownershipData, setOwnershipData] = useState<OwnershipData | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!user.isConnected) {
      router.push("/")
      return
    }

    const loadData = async () => {
      if (user.address)
        await loadOwnedFractionalNFTs(user.address);
    };

    loadData();
  }, [user, loadOwnedFractionalNFTs, router])

  useEffect(() => {
    if (!user.isConnected) return;

    setOwnershipData({
      totalAssets: ownedFractionalNFTs.length,
      fractionalOwnership: ownedFractionalNFTs,
    })
  }, [user, ownedFractionalNFTs])

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!mounted || !ownershipData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-1" />
                <Skeleton className="h-3 w-48" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full mb-1" />
                <Skeleton className="h-3 w-48" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-10 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Assets Owned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{ownershipData.totalAssets}</div>
              <p className="text-xs text-muted-foreground mt-1">Approved tokenized assets</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Wallet Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-mono text-muted-foreground truncate">{user.address}</p>
              <p className="text-xs text-muted-foreground mt-2">Ethereum Network</p>
            </CardContent>
          </Card>
        </div>

        {/* Holdings */}
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Your Holdings</h2>
            <p className="text-muted-foreground text-sm">Fractional ownership of tokenized assets</p>
          </div>

          {ownershipData.fractionalOwnership.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ownershipData.fractionalOwnership.map((holding, index) => {
                return (
                  <Card
                    key={index}
                    className="hover:border-primary transition-colors shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{holding.propertyName}</CardTitle>
                          <CardDescription>Token ID: {holding.propertyId}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Ownership Stake</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-full rounded-full"
                                style={{ width: `${holding.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-bold">{holding.percentage.toFixed(2)}%</span>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-border">
                          <p className="text-xs text-muted-foreground">
                            You own <span className="text-foreground font-semibold">{holding.percentage.toFixed(2)}%</span> of this
                            property
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <AssetTransferModal ownedNFT={holding} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-12 text-center">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No tokenized assets in your portfolio yet</p>
                <p className="text-sm text-muted-foreground mt-1">Check back when new assets are listed</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}