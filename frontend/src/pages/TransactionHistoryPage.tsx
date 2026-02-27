import React from 'react';
import { useGetCallerWithdrawalRequests } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { History, ArrowUpRight } from 'lucide-react';
import AmountDisplay from '../components/common/AmountDisplay';
import StatusBadge from '../components/common/StatusBadge';

export default function TransactionHistoryPage() {
  const { data: requests, isLoading } = useGetCallerWithdrawalRequests();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-600 rounded-2xl p-6 text-white shadow-red-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <History className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Transaction History</h1>
            <p className="text-red-200 text-sm">View all your withdrawal requests</p>
          </div>
        </div>
      </div>

      <Card className="border-red-100 shadow-red-sm">
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-red-600" />
            Withdrawal Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
            </div>
          ) : !requests || requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>No withdrawal requests yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-red-50">
                    <TableHead className="text-red-700">ID</TableHead>
                    <TableHead className="text-red-700">Amount</TableHead>
                    <TableHead className="text-red-700">Bank Details</TableHead>
                    <TableHead className="text-red-700">Date</TableHead>
                    <TableHead className="text-red-700">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id.toString()} className="hover:bg-red-50/50">
                      <TableCell className="font-medium text-red-700">#{req.id.toString()}</TableCell>
                      <TableCell>
                        <AmountDisplay amount={Number(req.amount)} size="sm" />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-32 truncate">
                        {req.bankDetails}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(Number(req.timestamp) / 1_000_000).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={req.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
