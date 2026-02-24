import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, MemberReferral, LoanReferral, WithdrawalRequest } from '../backend';
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

// Loan Referrals
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
