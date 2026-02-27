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
export interface LoanReferralRecord {
    id: bigint;
    referrer: Principal;
    loanAmount: bigint;
    commission: bigint;
    notes: string;
    timestamp: Time;
    phoneNumber: string;
    borrowerName: string;
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
export interface WithdrawalRequest {
    id: bigint;
    status: WithdrawalStatus;
    bankDetails: string;
    user: Principal;
    timestamp: Time;
    amount: bigint;
}
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
    generateOTPForPhone(phoneNumber: string): Promise<string>;
    getAllLoanReferralRecords(): Promise<Array<LoanReferralRecord>>;
    getAllLoanReferrals(): Promise<Array<LoanReferral>>;
    getAllMemberReferrals(): Promise<Array<MemberReferral>>;
    getAllWithdrawalRequests(): Promise<Array<WithdrawalRequest>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCallerWithdrawalRequests(): Promise<Array<WithdrawalRequest>>;
    getLoanReferral(member: Principal): Promise<LoanReferral | null>;
    getLoanReferralRecord(referralId: bigint): Promise<LoanReferralRecord | null>;
    getMemberReferral(newMember: Principal): Promise<MemberReferral | null>;
    getPendingWithdrawalRequests(): Promise<Array<WithdrawalRequest>>;
    getTotalEarnings(): Promise<bigint>;
    getTotalLevelIncome(): Promise<bigint>;
    getTotalLoanReferralCommission(): Promise<bigint>;
    getTotalTeamSize(): Promise<bigint>;
    getUserLoanReferralRecords(user: Principal): Promise<Array<LoanReferralRecord>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProfileByPhoneNumber(phoneNumber: string): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markLevelRewarded(user: Principal, level: bigint): Promise<boolean>;
    registerUser(name: string, phoneNumber: string, referrer: Principal | null, paymentAmount: bigint): Promise<void>;
    rejectWithdrawalRequest(requestId: bigint, reason: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitLoanReferral(borrowerName: string, phoneNumber: string, loanAmount: bigint, notes: string): Promise<bigint>;
    updateLevel(user: Principal, level: bigint): Promise<void>;
    verifyPhoneAndLogin(phoneNumber: string, otp: string): Promise<Principal | null>;
}
