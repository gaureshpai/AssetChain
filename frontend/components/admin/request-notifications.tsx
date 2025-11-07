"use client";

import { useEffect, useState } from "react";
import { blockchainService } from "@/lib/blockchain-service";
import { PropertyRequest, PropertyRequestStatus, Owner } from "@/lib/contract-types";
import { toast } from "sonner";

export default function RequestNotifications() {
  const [requests, setRequests] = useState<PropertyRequest[]>([]);

  const fetchRequests = async () => {
    try {
      const count = await blockchainService.requestCount();
      const allFetchedRequests: PropertyRequest[] = [];
      for (let i = 1; i <= count; i++) {
        const req = await blockchainService.getRequest(i);
        if (req) {
          const [ownerAddresses, percentages] = await blockchainService.getRequestOwners(i);
          const owners: Owner[] = ownerAddresses.map((addr, idx) => ({
            ownerAddress: addr,
            percentage: Number(percentages[idx]),
          }));
          allFetchedRequests.push({
            ...req,
            owners: owners,
            status: req.status as PropertyRequestStatus,
          });
        }
      }
      return allFetchedRequests;
    } catch (err) {
      console.error("Failed to fetch requests for notifications:", err);
      return [];
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadAndMonitorRequests = async () => {
      const initialRequests = await fetchRequests();
      if (isMounted) {
        setRequests(initialRequests);
      }

      const interval = setInterval(async () => {
        const currentRequests = await fetchRequests();
        if (!isMounted) return; // Prevent state updates if component unmounted

        if (currentRequests.length > requests.length) {
          const newRequest = currentRequests[currentRequests.length - 1];
          toast.info(`New property tokenization request: ${newRequest.name}`);
        }
        setRequests(currentRequests);
      }, 5000);

      return () => clearInterval(interval);
    };

    const cleanupInterval = loadAndMonitorRequests();

    return () => {
      isMounted = false;
      cleanupInterval.then(clear => clear());
    };
  }, [requests]); // Dependency on requests to re-evaluate new requests

  return null;
}
