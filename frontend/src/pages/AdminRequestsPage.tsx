import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  useIsCallerAdmin,
  useGetPendingWithdrawalRequests,
  useApproveWithdrawalRequest,
  useRejectWithdrawalRequest,
  useGetAllMemberReferrals,
} from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import AmountDisplay from '../components/common/AmountDisplay';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { CheckCircle, XCircle } from 'lucide-react';
import type { UserProfile } from '../backend';

export default function AdminRequestsPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: pendingRequests, isLoading: requestsLoading } = useGetPendingWithdrawalRequests();
  const { data: allReferrals } = useGetAllMemberReferrals();
  const approveMutation = useApproveWithdrawalRequest();
  const rejectMutation = useRejectWithdrawalRequest();
  const navigate = useNavigate();

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<bigint | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate({ to: '/dashboard' });
    }
  }, [isAdmin, adminLoading, navigate]);

  const handleApprove = async (requestId: bigint) => {
    try {
      await approveMutation.mutateAsync(requestId);
      toast.success('Withdrawal request approved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve request');
    }
  };

  const handleRejectClick = (requestId: bigint) => {
    setSelectedRequestId(requestId);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedRequestId) return;

    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      await rejectMutation.mutateAsync({ requestId: selectedRequestId, reason: rejectionReason });
      toast.success('Withdrawal request rejected');
      setRejectDialogOpen(false);
      setRejectionReason('');
      setSelectedRequestId(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject request');
    }
  };

  const getUserName = (userPrincipal: string): string => {
    const referral = allReferrals?.find((ref) => ref.newMember.toString() === userPrincipal);
    return referral ? `User ${userPrincipal.slice(0, 8)}...` : `User ${userPrincipal.slice(0, 8)}...`;
  };

  if (adminLoading || requestsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2 font-display">Withdrawal Requests</h1>
        <p className="text-purple-100">Review and manage pending withdrawal requests</p>
      </div>

      {/* Requests Table */}
      <Card className="border-purple-200 shadow-card">
        <CardHeader>
          <CardTitle className="font-display">Pending Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {!pendingRequests || pendingRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No pending withdrawal requests</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-purple-50 dark:bg-purple-900/20">
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Bank Account</TableHead>
                    <TableHead className="font-semibold">IFSC Code</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((request) => {
                    const bankDetailsMatch = request.bankDetails.match(/Account: (\d+), IFSC: ([A-Z0-9]+)/);
                    const bankAccount = bankDetailsMatch ? bankDetailsMatch[1] : 'N/A';
                    const ifscCode = bankDetailsMatch ? bankDetailsMatch[2] : 'N/A';
                    const maskedAccount =
                      bankAccount !== 'N/A' ? `****${bankAccount.slice(-4)}` : bankAccount;

                    return (
                      <TableRow key={Number(request.id)} className="hover:bg-purple-50/50 dark:hover:bg-purple-900/10">
                        <TableCell>{format(new Date(Number(request.timestamp) / 1000000), 'MMM dd, yyyy')}</TableCell>
                        <TableCell className="font-medium">{getUserName(request.user.toString())}</TableCell>
                        <TableCell>
                          <AmountDisplay amount={request.amount} />
                        </TableCell>
                        <TableCell className="font-mono text-sm">{maskedAccount}</TableCell>
                        <TableCell className="font-mono text-sm">{ifscCode}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(request.id)}
                              disabled={approveMutation.isPending}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectClick(request.id)}
                              disabled={rejectMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
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

      {/* Rejection Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Withdrawal Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Rejection</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for rejecting this withdrawal request..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="border-purple-200 focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectConfirm} disabled={rejectMutation.isPending}>
              {rejectMutation.isPending ? 'Rejecting...' : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
