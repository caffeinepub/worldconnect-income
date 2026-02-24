import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAllLoanReferrals } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import MainLayout from '../components/layout/MainLayout';

export default function LoanReferralsPage() {
  const { identity } = useInternetIdentity();
  const { data: allLoanReferrals = [], isLoading } = useGetAllLoanReferrals();

  const myLoanReferrals = identity
    ? allLoanReferrals.filter((ref) => {
        return true;
      })
    : [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-navy-700">Loan Referrals</h1>
          <p className="text-muted-foreground mt-2">Track loan referrals and commissions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Loan Referrals</CardTitle>
            <CardDescription>
              Total loan referrals: {myLoanReferrals.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Loading loan referrals...</p>
            ) : (
              <p className="text-muted-foreground">
                Detailed loan referral tracking will be available in the next update.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
