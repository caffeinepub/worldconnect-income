import React from 'react';
import { useGetAllMemberReferrals } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import ReferralLinkGenerator from '../components/referrals/ReferralLinkGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function MemberReferralsPage() {
  const { identity } = useInternetIdentity();
  const { data: allReferrals, isLoading } = useGetAllMemberReferrals();

  const myReferrals = allReferrals?.filter(
    (referral) => identity && referral.referrer.toString() === identity.getPrincipal().toString()
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading referrals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2 font-display">Member Referrals</h1>
        <p className="text-purple-100">Share your referral link and grow your network</p>
      </div>

      {/* Referral Link Generator */}
      <ReferralLinkGenerator />

      {/* Referral Stats */}
      <Card className="border-purple-200 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Users className="h-5 w-5 text-primary" />
            Your Referrals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-5xl font-bold text-primary mb-2">{myReferrals?.length || 0}</div>
            <p className="text-muted-foreground">Total Members Referred</p>
          </div>

          {myReferrals && myReferrals.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Recent Referrals</h3>
              <div className="space-y-2">
                {myReferrals.slice(0, 5).map((referral, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Member {index + 1}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {referral.newMember.toString().slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
