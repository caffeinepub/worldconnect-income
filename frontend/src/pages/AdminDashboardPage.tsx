import React from 'react';
import { useGetAllWithdrawalRequests } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Clock, CheckCircle, XCircle, IndianRupee, Link } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import ReferralLinkGenerator from '../components/referrals/ReferralLinkGenerator';

export default function AdminDashboardPage() {
  const { data: requests, isLoading } = useGetAllWithdrawalRequests();
  const { identity } = useInternetIdentity();

  const pending = requests?.filter(r => r.status.__kind__ === 'pending').length ?? 0;
  const approved = requests?.filter(r => r.status.__kind__ === 'approved').length ?? 0;
  const rejected = requests?.filter(r => r.status.__kind__ === 'rejected').length ?? 0;
  const totalAmount = requests?.reduce((sum, r) => sum + Number(r.amount), 0) ?? 0;

  const adminPrincipalId = identity?.getPrincipal().toString() ?? '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-600 rounded-2xl p-6 text-white shadow-red-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Admin Dashboard</h1>
            <p className="text-red-200 text-sm">Overview of system activity</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-red-100 shadow-red-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100 shadow-red-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100 shadow-red-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100 shadow-red-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Requested</p>
                  <p className="text-xl font-bold text-red-700">₹{totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Referral Link Section — Admin Only */}
      {adminPrincipalId && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Link className="w-4 h-4 text-red-600" />
            <h2 className="text-base font-semibold text-foreground">Referral Link</h2>
          </div>
          <ReferralLinkGenerator principalId={adminPrincipalId} />
        </div>
      )}
    </div>
  );
}
