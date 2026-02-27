import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, MemberReferral, LoanReferral, WithdrawalRequest, LoanReferralRecord } from '../backend';
import { Principal } from '@dfinity/principal';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetUserProfile() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUserProfile(user);
    },
  });
}

// Registration
export function useRegisterUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      phoneNumber,
      referrer,
      paymentAmount,
    }: {
      name: string;
      phoneNumber: string;
      referrer: Principal | null;
      paymentAmount: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerUser(name, phoneNumber, referrer, paymentAmount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Deposit & Withdrawal
export function useDeposit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deposit(amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useCreateWithdrawalRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, bankDetails }: { amount: bigint; bankDetails: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createWithdrawalRequest(amount, bankDetails);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['callerWithdrawalRequests'] });
      queryClient.invalidateQueries({ queryKey: ['pendingWithdrawalRequests'] });
      queryClient.invalidateQueries({ queryKey: ['allWithdrawalRequests'] });
    },
  });
}

export function useGetCallerWithdrawalRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WithdrawalRequest[]>({
    queryKey: ['callerWithdrawalRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerWithdrawalRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Admin Withdrawal Operations
export function useGetAllWithdrawalRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WithdrawalRequest[]>({
    queryKey: ['allWithdrawalRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWithdrawalRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetPendingWithdrawalRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WithdrawalRequest[]>({
    queryKey: ['pendingWithdrawalRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingWithdrawalRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useApproveWithdrawalRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveWithdrawalRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingWithdrawalRequests'] });
      queryClient.invalidateQueries({ queryKey: ['allWithdrawalRequests'] });
      queryClient.invalidateQueries({ queryKey: ['callerWithdrawalRequests'] });
    },
  });
}

export function useRejectWithdrawalRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, reason }: { requestId: bigint; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectWithdrawalRequest(requestId, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingWithdrawalRequests'] });
      queryClient.invalidateQueries({ queryKey: ['allWithdrawalRequests'] });
      queryClient.invalidateQueries({ queryKey: ['callerWithdrawalRequests'] });
    },
  });
}

// Admin Authentication
export function useAdminLogin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (phoneNumber: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminLogin(phoneNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// Member Phone OTP Authentication
export function useRequestMemberOTP() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (phoneNumber: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.generateOTPForPhone(phoneNumber);
    },
  });
}

export function useVerifyMemberOTP() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ phoneNumber, otp }: { phoneNumber: string; otp: string }) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.verifyPhoneAndLogin(phoneNumber, otp);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
    },
  });
}

// Member Referrals
export function useGetAllMemberReferrals() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<MemberReferral[]>({
    queryKey: ['memberReferrals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMemberReferrals();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddMemberReferral() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      referrer,
      newMember,
    }: {
      referrer: Principal;
      newMember: Principal;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMemberReferral(referrer, newMember);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberReferrals'] });
    },
  });
}

// Loan Referrals (legacy)
export function useGetAllLoanReferrals() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<LoanReferral[]>({
    queryKey: ['loanReferrals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLoanReferrals();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddLoanReferral() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      referredMember,
      amount,
    }: {
      referredMember: Principal;
      amount: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addLoanReferral(referredMember, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loanReferrals'] });
    },
  });
}

// Loan Referral Records (new)
export function useSubmitLoanReferral() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      borrowerName,
      phoneNumber,
      loanAmount,
      notes,
    }: {
      borrowerName: string;
      phoneNumber: string;
      loanAmount: bigint;
      notes: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitLoanReferral(borrowerName, phoneNumber, loanAmount, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLoanReferralRecords'] });
      queryClient.invalidateQueries({ queryKey: ['totalLoanReferralCommission'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['totalEarnings'] });
    },
  });
}

export function useGetUserLoanReferralRecords(user: Principal | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<LoanReferralRecord[]>({
    queryKey: ['userLoanReferralRecords', user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return [];
      return actor.getUserLoanReferralRecords(user);
    },
    enabled: !!actor && !actorFetching && !!user,
  });
}

export function useGetTotalLoanReferralCommission() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['totalLoanReferralCommission'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalLoanReferralCommission();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Team Size
export function useGetTotalTeamSize() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['totalTeamSize'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalTeamSize();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 60000,
  });
}

// Total Earnings
export function useGetTotalEarnings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['totalEarnings'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalEarnings();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Level Income
export function useGetTotalLevelIncome() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['totalLevelIncome'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalLevelIncome();
    },
    enabled: !!actor && !actorFetching,
  });
}
