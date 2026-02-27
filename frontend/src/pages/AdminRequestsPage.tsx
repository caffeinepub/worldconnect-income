import React, { useState } from 'react';
import {
  useGetAllWithdrawalRequests,
  useApproveWithdrawalRequest,
  useRejectWithdrawalRequest,
} from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ClipboardList, CheckCircle, XCircle } from 'lucide-react';
import AmountDisplay from '../components/common/AmountDisplay';
import StatusBadge from '../components/common/StatusBadge';

export default function AdminRequestsPage() {
  const { data: requests, isLoading } = useGetAllWithdrawalRequests();
  const approveMutation = useApproveWithdrawalRequest();
  const rejectMutation = useRejectWithdrawalRequest();

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<bigint | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = async (id: bigint) => {
    try {
      await approveMutation.mutateAsync(id);
    } catch (err: any) {
      console.error('Approve error:', err);
    }
  };

  const handleRejectOpen = (id: bigint) => {
    setSelectedRequestId(id);
    setRejectReason('');
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedRequestId) return;
    try {
      await rejectMutation.mutateAsync({ requestId: selectedRequestId, reason: rejectReason });
      setRejectDialogOpen(false);
    } catch (err: any) {
      console.error('Reject error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-600 rounded-2xl p-6 text-white shadow-red-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Withdrawal Requests</h1>
            <p className="text-red-200 text-sm">Manage and process withdrawal requests</p>
          </div>
        </div>
      </div>

      <Card className="border-red-100 shadow-red-sm">
        <CardHeader>
          <CardTitle className="font-heading">All Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
            </div>
          ) : !requests || requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>No withdrawal requests</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-red-50">
                    <TableHead className="text-red-700">ID</TableHead>
                    <TableHead className="text-red-700">User</TableHead>
                    <TableHead className="text-red-700">Amount</TableHead>
                    <TableHead className="text-red-700">Bank Details</TableHead>
                    <TableHead className="text-red-700">Date</TableHead>
                    <TableHead className="text-red-700">Status</TableHead>
                    <TableHead className="text-red-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id.toString()} className="hover:bg-red-50/50">
                      <TableCell className="font-medium text-red-700">#{req.id.toString()}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-24 truncate">
                        {req.user.toString()}
                      </TableCell>
                      <TableCell>
                        <AmountDisplay amount={Number(req.amount)} size="sm" />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-32 truncate">
                        {req.bankDetails}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(Number(req.timestamp) / 1_000_000).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={req.status} />
                      </TableCell>
                      <TableCell>
                        {req.status.__kind__ === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(req.id)}
                              disabled={approveMutation.isPending}
                              className="bg-green-600 hover:bg-green-700 text-white h-7 px-2 text-xs"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectOpen(req.id)}
                              className="border-red-300 text-red-600 hover:bg-red-50 h-7 px-2 text-xs"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">Reject Withdrawal Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this withdrawal request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="rejectReason">Rejection Reason</Label>
            <Input
              id="rejectReason"
              placeholder="Enter reason for rejection"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRejectConfirm}
              disabled={rejectMutation.isPending || !rejectReason.trim()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {rejectMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                  Rejecting...
                </span>
              ) : (
                'Confirm Rejection'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
