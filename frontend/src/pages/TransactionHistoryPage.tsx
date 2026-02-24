import React from 'react';
import { useGetCallerWithdrawalRequests } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '../components/common/StatusBadge';
import AmountDisplay from '../components/common/AmountDisplay';
import { format } from 'date-fns';

export default function TransactionHistoryPage() {
  const { data: withdrawalRequests, isLoading } = useGetCallerWithdrawalRequests();

  const sortedRequests = withdrawalRequests
    ? [...withdrawalRequests].sort((a, b) => Number(b.timestamp - a.timestamp))
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2 font-display">Transaction History</h1>
        <p className="text-purple-100">View all your withdrawal requests and their status</p>
      </div>

      {/* Transactions Table */}
      <Card className="border-purple-200 shadow-card">
        <CardHeader>
          <CardTitle className="font-display">Withdrawal Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No withdrawal requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-purple-50 dark:bg-purple-900/20">
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Bank Account</TableHead>
                    <TableHead className="font-semibold">IFSC Code</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedRequests.map((request) => {
                    const bankDetailsMatch = request.bankDetails.match(/Account: (\d+), IFSC: ([A-Z0-9]+)/);
                    const bankAccount = bankDetailsMatch ? bankDetailsMatch[1] : 'N/A';
                    const ifscCode = bankDetailsMatch ? bankDetailsMatch[2] : 'N/A';
                    const maskedAccount =
                      bankAccount !== 'N/A' ? `****${bankAccount.slice(-4)}` : bankAccount;

                    return (
                      <TableRow key={Number(request.id)} className="hover:bg-purple-50/50 dark:hover:bg-purple-900/10">
                        <TableCell>{format(new Date(Number(request.timestamp) / 1000000), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <AmountDisplay amount={request.amount} />
                        </TableCell>
                        <TableCell className="font-mono text-sm">{maskedAccount}</TableCell>
                        <TableCell className="font-mono text-sm">{ifscCode}</TableCell>
                        <TableCell>
                          <StatusBadge status={request.status} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
