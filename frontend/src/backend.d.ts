import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface LoanReferral {
    member: Principal;
    amount: bigint;
}
export interface MemberReferral {
    referrer: Principal;
    newMember: Principal;
}
export interface WithdrawalRequest {
    id: bigint;
    status: WithdrawalStatus;
    bankDetails: string;
    user: Principal;
    timestamp: Time;
    amount: bigint;
}
export type WithdrawalStatus = {
    __kind__: "pending";
    pending: null;
} | {
    __kind__: "approved";
    approved: null;
} | {
    __kind__: "rejected";
    rejected: string;
};
export interface UserProfile {
    active: boolean;
    referrer?: Principal;
    balance: bigint;
    name: string;
    level: bigint;
    phoneNumber: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addLoanReferral(referredMember: Principal, amount: bigint): Promise<void>;
    addMemberReferral(referrer: Principal, newMember: Principal): Promise<void>;
    adminLogin(phoneNumber: string): Promise<boolean>;
    approveWithdrawalRequest(requestId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createWithdrawalRequest(amount: bigint, bankDetails: string): Promise<bigint>;
    deposit(amount: bigint): Promise<void>;
    getAllLoanReferrals(): Promise<Array<LoanReferral>>;
    getAllMemberReferrals(): Promise<Array<MemberReferral>>;
    getAllWithdrawalRequests(): Promise<Array<WithdrawalRequest>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCallerWithdrawalRequests(): Promise<Array<WithdrawalRequest>>;
    getLoanReferral(member: Principal): Promise<LoanReferral | null>;
    getMemberReferral(newMember: Principal): Promise<MemberReferral | null>;
    getPendingWithdrawalRequests(): Promise<Array<WithdrawalRequest>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerUser(name: string, phoneNumber: string, referrer: Principal | null, paymentAmount: bigint): Promise<void>;
    rejectWithdrawalRequest(requestId: bigint, reason: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateLevel(level: bigint): Promise<void>;
}
