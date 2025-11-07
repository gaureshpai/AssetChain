import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BuildingAsset } from "@/lib/asset-data";
import { useAssetStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

interface AssetTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: BuildingAsset | null;
}

export default function AssetTransferModal({ isOpen, onClose, asset }: AssetTransferModalProps) {
  const [newOwnerAddress, setNewOwnerAddress] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const { transferFullOwnership, registerPropertyOnBlockchain } = useAssetStore(); // Assuming transferFullOwnership is in useAssetStore
  const { user } = useAuth();

  if (!asset) return null;

  const handleTransferFullOwnership = async () => {
    if (!newOwnerAddress) {
      toast.error("Please enter a new owner address.");
      return;
    }
    if (!user.address) {
      toast.error("User address not found. Please log in.");
      return;
    }

    setIsTransferring(true);
    try {
      // For simplicity, assuming the current user is the sole owner for full transfer
      // In a real scenario, you'd verify ownership and permissions
      await transferFullOwnership({
        propertyId: parseInt(asset.id.replace("bld-", "")),
        to: newOwnerAddress,
      });
      toast.success("Full ownership transferred successfully!");
      onClose();
    } catch (error: any) {
      console.error("Failed to transfer full ownership:", error);
      toast.error(`Transfer failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsTransferring(false);
    }
  };

  // Placeholder for multi-owner transfer logic
  const handleMultiOwnerTransfer = () => {
    toast.info("Multi-owner transfer logic not yet implemented.");
    // This would involve initiating a request, getting approvals, and then admin finalization
  };

  const isSingleOwner = asset.fractionalOwnership?.length === 1 && asset.fractionalOwnership[0].address.toLowerCase() === user.address?.toLowerCase();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Transfer Asset: {asset.name}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {isSingleOwner
              ? "Transfer full ownership of this asset to a new address." 
              : "This asset has multiple owners. A multi-step approval process is required."}
          </DialogDescription>
        </DialogHeader>
        
        {isSingleOwner && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newOwner" className="text-right text-gray-300">
                New Owner Address
              </Label>
              <Input
                id="newOwner"
                value={newOwnerAddress}
                onChange={(e) => setNewOwnerAddress(e.target.value)}
                className="col-span-3 bg-gray-700 border-gray-600 text-white"
                placeholder="0x..."
              />
            </div>
          </div>
        )}

        {!isSingleOwner && (
          <div className="grid gap-4 py-4 text-gray-300">
            <p>Current Owners:</p>
            <ul className="list-disc pl-5">
              {asset.fractionalOwnership?.map((owner, index) => (
                <li key={index}>{owner.address.slice(0, 8)}...{owner.address.slice(-6)} ({owner.percentage}%)</li>
              ))}
            </ul>
            <p className="text-sm text-yellow-400">Multi-owner transfer requires all owners' approval and then admin finalization.</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-gray-600 text-white hover:bg-gray-700">
            Cancel
          </Button>
          {isSingleOwner && (
            <Button onClick={handleTransferFullOwnership} disabled={isTransferring} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isTransferring ? "Transferring..." : "Transfer Full Ownership"}
            </Button>
          )}
          {!isSingleOwner && (
            <Button onClick={handleMultiOwnerTransfer} disabled={isTransferring} className="bg-blue-600 hover:bg-blue-700 text-white">
              Initiate Multi-Owner Transfer (WIP)
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
