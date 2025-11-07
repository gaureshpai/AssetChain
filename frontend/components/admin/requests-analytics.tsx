"use client";

import { useEffect, useState } from "react";
import { blockchainService } from "@/lib/blockchain-service";
import { PropertyRequest, PropertyRequestStatus } from "@/lib/contract-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RequestsAnalytics() {
  const [requests, setRequests] = useState<PropertyRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const count = await blockchainService.requestCount();
        const allFetchedRequests: PropertyRequest[] = [];
        for (let i = 1; i <= count; i++) {
          const req = await blockchainService.getRequest(i);
          if (req) {
            allFetchedRequests.push({
              ...req,
              owners: [], // Owners are not needed for analytics, but PropertyRequest requires it
              status: req.status as PropertyRequestStatus,
            });
          }
        }
        setRequests(allFetchedRequests);
      } catch (err) {
        console.error("Failed to fetch requests for analytics:", err);
      }
    };
    fetchRequests();
  }, []);

  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === PropertyRequestStatus.Pending).length;
  const approvedRequests = requests.filter((r) => r.status === PropertyRequestStatus.Approved).length;
  const rejectedRequests = requests.filter((r) => r.status === PropertyRequestStatus.Rejected).length;

  return (
    <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-lg mt-6">
      <CardHeader>
        <CardTitle className="text-white">Requests Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Total Requests</p>
            <p className="text-2xl font-bold text-white">{totalRequests}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">{pendingRequests}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-400">{approvedRequests}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Rejected</p>
            <p className="text-2xl font-bold text-red-400">{rejectedRequests}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
