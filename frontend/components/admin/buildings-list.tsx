"use client"

import { useAssetStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"

export default function BuildingsList() {
  const { buildings, fractionalizeNFT } = useAssetStore()
  const [isFractionalizeModalOpen, setIsFractionalizeModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [fractionalTokenName, setFractionalTokenName] = useState<string>("");
  const [fractionalTokenSymbol, setFractionalTokenSymbol] = useState<string>("");
  const [fractionalTokenSupply, setFractionalTokenSupply] = useState<number>(1000);

  const handleFractionalizeClick = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
    setIsFractionalizeModalOpen(true);
  };

  const handleFractionalizeSubmit = async () => {
    if (selectedPropertyId === null) return;
    if (!fractionalTokenName || !fractionalTokenSymbol || fractionalTokenSupply <= 0) {
      alert("Please fill all fractionalization details.");
      return;
    }

    try {
      await fractionalizeNFT(selectedPropertyId, fractionalTokenName, fractionalTokenSymbol, fractionalTokenSupply);
      alert("NFT fractionalized successfully!");
      setIsFractionalizeModalOpen(false);
      setSelectedPropertyId(null);
      setFractionalTokenName("");
      setFractionalTokenSymbol("");
      setFractionalTokenSupply(1000);
    } catch (error) {
      console.error("Failed to fractionalize NFT:", error);
      alert("Failed to fractionalize NFT.");
    }
  };

  if (buildings.length === 0) {
    return (
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-lg">
        <CardContent className="pt-12 text-center">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No buildings created yet</p>
          <p className="text-sm text-slate-500 mt-1">Create your first tokenized asset</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {buildings.map((building:any) => (
        <Card
          key={building.id}
          className="border-slate-700 bg-slate-800/50 backdrop-blur-lg hover:border-slate-600 transition-colors"
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-500" />
                  {building.name}
                </CardTitle>
                <CardDescription className="text-slate-400 flex items-center gap-1 mt-1">
                  Token ID: {building.id}
                </CardDescription>
              </div>
              <Badge
                variant="default"
                className="bg-green-500/20 text-green-400 border-green-500/30"
              >
                NFT Property
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Owner</p>
                <p className="text-sm font-mono text-slate-300 truncate">{building.owner.slice(0, 8)}...</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Partnership Agreement</p>
                <a href={building.partnershipAgreementUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">View Document</a>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Maintenance Agreement</p>
                <a href={building.maintenanceAgreementUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">View Document</a>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Rent Agreement</p>
                <a href={building.rentAgreementUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">View Document</a>
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={() => handleFractionalizeClick(building.id)} className="bg-purple-600 hover:bg-purple-700 text-white">
                Fractionalize NFT
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={isFractionalizeModalOpen} onOpenChange={setIsFractionalizeModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Fractionalize NFT</DialogTitle>
            <DialogDescription className="text-slate-400">
              Enter details for the fractional tokens.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tokenName" className="text-right text-slate-300">
                Token Name
              </Label>
              <Input
                id="tokenName"
                value={fractionalTokenName}
                onChange={(e) => setFractionalTokenName(e.target.value)}
                className="col-span-3 bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tokenSymbol" className="text-right text-slate-300">
                Token Symbol
              </Label>
              <Input
                id="tokenSymbol"
                value={fractionalTokenSymbol}
                onChange={(e) => setFractionalTokenSymbol(e.target.value)}
                className="col-span-3 bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalSupply" className="text-right text-slate-300">
                Total Supply
              </Label>
              <Input
                id="totalSupply"
                type="number"
                value={fractionalTokenSupply}
                onChange={(e) => setFractionalTokenSupply(Number(e.target.value))}
                className="col-span-3 bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleFractionalizeSubmit} className="bg-purple-600 hover:bg-purple-700 text-white">
              Fractionalize
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}