import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

module {
  type OldUserProfile = {
    name : Text;
    phoneNumber : Text;
    balance : Nat;
    referrer : ?Principal;
    level : Nat;
    active : Bool;
  };

  type OldLoanReferral = {
    member : Principal;
    amount : Nat;
  };

  type OldMemberReferral = {
    referrer : Principal;
    newMember : Principal;
  };

  type OldWithdrawalRequest = {
    id : Nat;
    user : Principal;
    amount : Nat;
    bankDetails : Text;
    timestamp : Time.Time;
    status : OldWithdrawalStatus;
  };

  type OldWithdrawalStatus = {
    #pending;
    #approved;
    #rejected : Text;
  };

  type OldLoanReferralRecord = {
    id : Nat;
    referrer : Principal;
    borrowerName : Text;
    phoneNumber : Text;
    loanAmount : Nat;
    notes : Text;
    commission : Nat;
    timestamp : Time.Time;
  };

  type OTPEntry = {
    phoneNumber : Text;
    otp : Text;
    timestamp : Time.Time;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    loanReferrals : Map.Map<Principal, OldLoanReferral>;
    memberReferrals : Map.Map<Principal, OldMemberReferral>;
    withdrawalRequests : Map.Map<Nat, OldWithdrawalRequest>;
    loanReferralRecords : Map.Map<Nat, OldLoanReferralRecord>;
    levelRewardedUsers : Map.Map<Nat, List.List<Principal>>;
    nextWithdrawalRequestId : Nat;
    nextLoanReferralId : Nat;
    registrationFee : Nat;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    loanReferrals : Map.Map<Principal, OldLoanReferral>;
    memberReferrals : Map.Map<Principal, OldMemberReferral>;
    withdrawalRequests : Map.Map<Nat, OldWithdrawalRequest>;
    loanReferralRecords : Map.Map<Nat, OldLoanReferralRecord>;
    levelRewardedUsers : Map.Map<Nat, List.List<Principal>>;
    phoneToPrincipal : Map.Map<Text, Principal>;
    otpRecords : Map.Map<Text, OTPEntry>;
    nextWithdrawalRequestId : Nat;
    nextLoanReferralId : Nat;
    registrationFee : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      phoneToPrincipal = Map.empty<Text, Principal>();
      otpRecords = Map.empty<Text, OTPEntry>();
    };
  };
};
