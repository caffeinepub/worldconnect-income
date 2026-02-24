import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Time "mo:core/Time";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    phoneNumber : Text;
    balance : Nat;
    referrer : ?Principal;
    level : Nat;
    active : Bool;
  };

  public type LoanReferral = {
    member : Principal;
    amount : Nat;
  };

  public type MemberReferral = {
    referrer : Principal;
    newMember : Principal;
  };

  public type WithdrawalRequest = {
    id : Nat;
    user : Principal;
    amount : Nat;
    bankDetails : Text;
    timestamp : Time.Time;
    status : WithdrawalStatus;
  };

  public type WithdrawalStatus = {
    #pending;
    #approved;
    #rejected : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let loanReferrals = Map.empty<Principal, LoanReferral>();
  let memberReferrals = Map.empty<Principal, MemberReferral>();
  let withdrawalRequests = Map.empty<Nat, WithdrawalRequest>();

  var nextWithdrawalRequestId = 0;
  let adminPhoneNumber = "9422018674";
  let registrationFee : Nat = 100;
  let levelThresholds : [Nat] = [10, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120];

  func calculateLevel(teamSize : Nat) : Nat {
    var remainingTeamSize = teamSize;
    var level = 0;
    for (threshold in levelThresholds.values()) {
      if (remainingTeamSize >= threshold) {
        level += 1;
        remainingTeamSize := threshold;
      } else {
        return level;
      };
    };
    level;
  };

  public shared ({ caller }) func registerUser(name : Text, phoneNumber : Text, referrer : ?Principal, paymentAmount : Nat) : async () {
    if (userProfiles.containsKey(caller)) {
      Runtime.trap("User already registered");
    };

    if (paymentAmount < registrationFee) {
      Runtime.trap("Registration fee of ₹100 is required");
    };

    switch (referrer) {
      case (?ref) {
        if (not userProfiles.containsKey(ref)) {
          Runtime.trap("Invalid referrer: referrer must be a registered user");
        };
      };
      case (null) {};
    };

    let initialProfile : UserProfile = {
      name;
      phoneNumber;
      balance = 0;
      referrer;
      level = 1;
      active = false;
    };

    userProfiles.add(caller, initialProfile);
    AccessControl.assignRole(accessControlState, caller, caller, #user);
  };

  public shared ({ caller }) func updateLevel(level : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update levels");
    };

    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?p) { p };
    };

    let updatedProfile = { profile with level };

    userProfiles.add(caller, updatedProfile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func deposit(amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can deposit funds");
    };

    if (amount == 0) {
      Runtime.trap("Deposit amount must be greater than 0");
    };

    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?p) { p };
    };

    let updatedProfile = {
      profile with
      balance = profile.balance + amount;
      active = true;
    };
    userProfiles.add(caller, updatedProfile);
  };

  public shared ({ caller }) func createWithdrawalRequest(amount : Nat, bankDetails : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request withdrawals");
    };

    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?p) { p };
    };

    let maxWithdrawal = profile.balance / 100;
    if (amount > maxWithdrawal) {
      Runtime.trap("Withdrawal amount cannot exceed 1% of your total balance (max: " # maxWithdrawal.toText() # ")");
    };

    if (profile.balance < amount) {
      Runtime.trap("Insufficient balance");
    };

    let updatedProfile = {
      profile with balance = profile.balance - amount;
    };
    userProfiles.add(caller, updatedProfile);

    let requestId = nextWithdrawalRequestId;
    let newRequest : WithdrawalRequest = {
      id = requestId;
      user = caller;
      amount;
      bankDetails;
      timestamp = Time.now();
      status = #pending;
    };

    withdrawalRequests.add(requestId, newRequest);
    nextWithdrawalRequestId += 1;

    requestId;
  };

  public query ({ caller }) func getAllWithdrawalRequests() : async [WithdrawalRequest] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view withdrawal requests");
    };

    withdrawalRequests.values().toArray();
  };

  public query ({ caller }) func getPendingWithdrawalRequests() : async [WithdrawalRequest] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view withdrawal requests");
    };

    withdrawalRequests.values().toArray().filter(
      func(request) {
        switch (request.status) {
          case (#pending) { true };
          case (_) { false };
        };
      }
    );
  };

  public shared ({ caller }) func approveWithdrawalRequest(requestId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can approve withdrawals");
    };

    let request = switch (withdrawalRequests.get(requestId)) {
      case (null) { Runtime.trap("Withdrawal request not found") };
      case (?r) { r };
    };

    switch (request.status) {
      case (#pending) { };
      case (#approved) { Runtime.trap("Withdrawal request already approved") };
      case (#rejected(_)) { Runtime.trap("Cannot approve a rejected withdrawal request") };
    };

    let updatedRequest = { request with status = #approved };
    withdrawalRequests.add(requestId, updatedRequest);
  };

  public shared ({ caller }) func rejectWithdrawalRequest(requestId : Nat, reason : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can reject withdrawals");
    };

    let request = switch (withdrawalRequests.get(requestId)) {
      case (null) { Runtime.trap("Withdrawal request not found") };
      case (?r) { r };
    };

    switch (request.status) {
      case (#pending) { };
      case (#approved) { Runtime.trap("Cannot reject an approved withdrawal request") };
      case (#rejected(_)) { Runtime.trap("Withdrawal request already rejected") };
    };

    let updatedRequest = { request with status = #rejected(reason) };
    withdrawalRequests.add(requestId, updatedRequest);

    let profile = switch (userProfiles.get(request.user)) {
      case (null) { Runtime.trap("User not found") };
      case (?p) { p };
    };

    let updatedProfile = {
      profile with balance = profile.balance + request.amount;
    };

    userProfiles.add(request.user, updatedProfile);
  };

  public query ({ caller }) func getCallerWithdrawalRequests() : async [WithdrawalRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view withdrawal requests");
    };

    withdrawalRequests.values().toArray().filter(func(request) { request.user == caller });
  };

  public shared ({ caller }) func addLoanReferral(referredMember : Principal, amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add loan referrals");
    };

    let referredProfile = switch (userProfiles.get(referredMember)) {
      case (null) { Runtime.trap("Referred member not found") };
      case (?p) { p };
    };

    switch (referredProfile.referrer) {
      case (?ref) {
        if (ref != caller) {
          Runtime.trap("Unauthorized: You can only add loan referrals for members you referred");
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: This member has no referrer");
      };
    };

    loanReferrals.add(referredMember, { member = referredMember; amount });
  };

  public shared ({ caller }) func addMemberReferral(referrer : Principal, newMember : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add member referrals");
    };

    if (caller != referrer) {
      Runtime.trap("Unauthorized: You can only add member referrals where you are the referrer");
    };

    let newMemberProfile = switch (userProfiles.get(newMember)) {
      case (null) { Runtime.trap("New member not found") };
      case (?p) { p };
    };

    switch (newMemberProfile.referrer) {
      case (?ref) {
        if (ref != caller) {
          Runtime.trap("Unauthorized: You are not the referrer for this member");
        };
      };
      case (null) {
        Runtime.trap("This member has no referrer");
      };
    };

    memberReferrals.add(newMember, { referrer; newMember });
  };

  public shared ({ caller }) func adminLogin(phoneNumber : Text) : async Bool {
    if (phoneNumber == adminPhoneNumber) {
      AccessControl.assignRole(accessControlState, caller, caller, #admin);
      true;
    } else {
      false;
    };
  };

  public query ({ caller }) func getLoanReferral(member : Principal) : async ?LoanReferral {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view loan referrals");
    };

    if (not AccessControl.isAdmin(accessControlState, caller)) {
      let memberProfile = switch (userProfiles.get(member)) {
        case (null) { Runtime.trap("Member not found") };
        case (?p) { p };
      };

      switch (memberProfile.referrer) {
        case (?ref) {
          if (ref != caller) {
            Runtime.trap("Unauthorized: Can only view loan referrals for members you referred");
          };
        };
        case (null) {
          Runtime.trap("Unauthorized: This member has no referrer");
        };
      };
    };

    loanReferrals.get(member);
  };

  public query ({ caller }) func getMemberReferral(newMember : Principal) : async ?MemberReferral {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view member referrals");
    };

    let referral = memberReferrals.get(newMember);
    switch (referral) {
      case (null) { null };
      case (?ref) {
        if (caller != ref.referrer and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own member referrals");
        };
        ?ref;
      };
    };
  };

  public query ({ caller }) func getAllMemberReferrals() : async [MemberReferral] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all member referrals");
    };

    memberReferrals.values().toArray();
  };

  public query ({ caller }) func getAllLoanReferrals() : async [LoanReferral] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all loan referrals");
    };

    loanReferrals.values().toArray();
  };
};
