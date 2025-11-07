"use client";

import React, { useEffect, useState, Fragment } from "react";
import { CONTRACT_CONFIG } from "@/lib/contract-config";
import { ethers, Interface, Log } from "ethers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ParsedLogEntry {
  blockNumber: number;
  address: string;
  event: string;
  args: any;
  txHash: string;
}

export default function TransactionsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]); // New state for grouped transactions
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const provider = new ethers.JsonRpcProvider((await import("@/lib/contract-config")).getRpcUrl());
        const latest = await provider.getBlockNumber();
        const fromBlock = Math.max(0, latest - 2000);

        const prAddr = CONTRACT_CONFIG.propertyRegistry.address.toLowerCase();
        const fracAddr = CONTRACT_CONFIG.fractionalizer.address.toLowerCase();

        const prIface = new Interface(CONTRACT_CONFIG.propertyRegistry.abi);
        const fracIface = new Interface(CONTRACT_CONFIG.fractionalizer.abi);

        const prFilter = { address: prAddr, fromBlock, toBlock: latest };
        const frFilter = { address: fracAddr, fromBlock, toBlock: latest };
        const [prLogs, frLogs] = await Promise.all([
          provider.getLogs(prFilter as any),
          provider.getLogs(frFilter as any),
        ]);

        const parsed: ParsedLogEntry[] = [...prLogs, ...frLogs]
          .map((lg: Log) => {
            try {
              const iface = lg.address.toLowerCase() === prAddr ? prIface : fracIface;
              const ev = iface.parseLog(lg);
              // Ensure all properties are non-null/non-undefined before returning
              if (lg.blockNumber !== undefined && lg.transactionHash !== undefined && ev?.name !== undefined && ev?.args !== undefined) {
                return {
                  blockNumber: lg.blockNumber,
                  address: lg.address,
                  event: ev.name,
                  args: ev.args,
                  txHash: lg.transactionHash,
                };
              }
              return null;
            } catch {
              return null;
            }
          })
          .filter((entry): entry is ParsedLogEntry => entry !== null) // Type guard for filter
          .sort((a, b) => b.blockNumber - a.blockNumber);

        setLogs(parsed as any[]); // Keep logs state for potential future use or debugging

        // Group logs by transaction hash
        const transactionsMap = new Map<string, { txHash: string; blockNumber: number; events: any[] }>();
        parsed.forEach(logEntry => {
          if (!transactionsMap.has(logEntry.txHash)) {
            transactionsMap.set(logEntry.txHash, {
              txHash: logEntry.txHash,
              blockNumber: logEntry.blockNumber,
              events: [],
            });
          }
          transactionsMap.get(logEntry.txHash)?.events.push(logEntry);
        });

        // Convert map to array and sort by blockNumber
        const groupedTransactions = Array.from(transactionsMap.values()).sort(
          (a, b) => b.blockNumber - a.blockNumber
        );

        setTransactions(groupedTransactions);
      } catch (e: any) {
        setError(e.message || "Failed to load transaction history");
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Transaction History</h2>
        <p className="text-muted-foreground text-sm">Recent events from PropertyRegistry and Fractionalizer</p>
      </div>

      {error ? (
        <Card>
          <CardContent className="pt-12 text-center">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : transactions.length === 0 ? (
        <Card>
          <CardContent className="pt-12 text-center">
            <p className="text-muted-foreground">No recent transactions</p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          {transactions.map((tx, i) => (
            <Fragment key={tx.txHash}>
              <Card>
                <CardHeader>
                  <CardTitle>Transaction: {tx.txHash.substring(0, 10)}...</CardTitle>
                  <p className="text-sm text-muted-foreground">Block: {tx.blockNumber}</p>
                </CardHeader>
                <CardContent>
                  <div className="">
                    {tx.events.map((event: any, eventIdx: number) => (
                      <div key={eventIdx} className="text-xs text-muted-foreground font-mono break-all border-l-2 pl-2">
                        <div>Event: {event.event}</div>
                        <div>Address: {event.address}</div>
                        <div>Args: {JSON.stringify(event.args, (key, value) =>
                            typeof value === 'bigint' ? value.toString() : value
                          )}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {i < transactions.length - 1 && (
                <div className="flex justify-center">
                  <div className="w-0.5 h-16 bg-gray-300 dark:bg-gray-700 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                  </div>
                </div>
              )}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}