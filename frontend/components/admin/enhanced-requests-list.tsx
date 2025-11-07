"use client";

import { useEffect, useState } from "react";
import { requestService, Request } from "@/lib/request-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function EnhancedRequestsList({ propertyId }: { propertyId: number }) {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const fetchedRequests = await requestService.getRequestsForProperty(propertyId);
      setRequests(fetchedRequests);
    };
    fetchRequests();
  }, [propertyId]);

  const handleApprove = async (requestId: number) => {
    await requestService.updateRequestStatus(requestId, "Approved");
    const updatedRequests = await requestService.getRequestsForProperty(propertyId);
    setRequests(updatedRequests);
  };

  const handleReject = async (requestId: number) => {
    await requestService.updateRequestStatus(requestId, "Rejected");
    const updatedRequests = await requestService.getRequestsForProperty(propertyId);
    setRequests(updatedRequests);
  };

  if (requests.length === 0) {
    return <p>No requests for this property.</p>;
  }

  return (
    <div className="space-y-4 mt-6">
      {requests.map((request) => (
        <Card key={request.id} className="border-slate-700 bg-slate-800/50 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white">Request #{request.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400">Requester: {request.requester}</p>
            <p className="text-slate-400">Type: {request.requestType}</p>
            <p className="text-slate-400">Details: {request.details}</p>
            <div className="flex items-center justify-between mt-4">
              <Badge
                variant={request.status === "Pending" ? "default" : request.status === "Approved" ? "outline" : "destructive"}
              >
                {request.status}
              </Badge>
              {request.status === "Pending" && (
                <div className="space-x-2">
                  <Button onClick={() => handleApprove(request.id)} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    Approve
                  </Button>
                  <Button onClick={() => handleReject(request.id)} size="sm" variant="destructive">
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
