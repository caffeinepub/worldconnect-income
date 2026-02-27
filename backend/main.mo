import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Time "mo:core/Time";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";
import Text "mo:core/Text";

(with migration = Migration.run)
actor {
  include MixinStorage();
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

  public type LoanReferralRecord = {
    id : Nat;
    referrer : Principal;
    borrowerName : Text;
    phoneNumber : Text;
    loanAmount : Nat;
    notes : Text;
    commission : Nat;
    timestamp : Time.Time;
  };

  public type OTPEntry = {
    phoneNumber : Text;
    otp : Text;
    timestamp : Time.Time;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let loanReferrals = Map.empty<Principal, LoanReferral>();
  let memberReferrals = Map.empty<Principal, MemberReferral>();
  let withdrawalRequests = Map.empty<Nat, WithdrawalRequest>();
  let loanReferralRecords = Map.empty<Nat, LoanReferralRecord>();
  let levelRewardedUsers = Map.empty<Nat, List.List<Principal>>();
  let phoneToPrincipal = Map.empty<Text, Principal>();
  let otpRecords = Map.empty<Text, OTPEntry>();

  var nextWithdrawalRequestId = 0;
  var nextLoanReferralId = 0;
  let adminPhoneNumber = "9422018674";
  let registrationFee : Nat = 100;
  let levelThresholds : [Nat] = [10, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120];

  // Public lookup by phone number - accessible to anyone (needed for login flow)
  // Only returns non-sensitive profile info; no auth check needed as it's used pre-authentication
  public query func getUserProfileByPhoneNumber(phoneNumber : Text) : async ?UserProfile {
    switch (phoneToPrincipal.get(phoneNumber)) {
      case (null) { null };
      case (?principal) {
        userProfiles.get(principal);
      };
    };
  };

  // Generates an OTP for a given phone number.
  // Accessible to anyone (guest) since this is called during the login flow
  // before the user is authenticated. We only require the phone number to be
  // registered in the system.
  public shared func generateOTPForPhone(phoneNumber : Text) : async Text {
    switch (phoneToPrincipal.get(phoneNumber)) {
      case (null) {
        Runtime.trap("No user registered with this phone number. Please register first.");
      };
      case (?_foundPrincipal) {
        let newOtpEntry : OTPEntry = {
          phoneNumber;
          otp = "1234";
          timestamp = Time.now();
        };
        otpRecords.add(phoneNumber, newOtpEntry);
        // Return a confirmation message; the OTP is simulated as "1234"
        "OTP sent to " # phoneNumber;
      };
    };
  };

  // Verifies OTP and returns the associated principal.
  // Accessible to anyone (guest) since this is called during the login flow
  // before the user is authenticated.
  public shared func verifyPhoneAndLogin(phoneNumber : Text, otp : Text) : async ?Principal {
    switch (otpRecords.get(phoneNumber)) {
      case (null) { return null };
      case (?otpEntry) {
        if (otpEntry.otp != otp) {
          Runtime.trap("Invalid OTP");
        };
        switch (phoneToPrincipal.get(phoneNumber)) {
          case (null) { Runtime.trap("No user registered with this phone number") };
          case (?foundPrincipal) { ?foundPrincipal };
        };
      };
    };
  };

  // Registration is open to anyone (guest) - no auth check needed
  public shared ({ caller }) func registerUser(name : Text, phoneNumber : Text, referrer : ?Principal, paymentAmount : Nat) : async () {
    if (userProfiles.containsKey(caller)) {
      Runtime.trap("User already registered");
    };

    if (paymentAmount < registrationFee) {
      Runtime.trap("Registration fee of \u{20B9}100 is required");
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
    phoneToPrincipal.add(phoneNumber, caller);
    AccessControl.assignRole(accessControlState, caller, caller, #user);
  };

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

  // Admin-only: update a specific user's level
  public shared ({ caller }) func updateLevel(user : Principal, level : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update levels");
    };

    let profile = switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?p) { p };
    };

    let updatedProfile = { profile with level };
    userProfiles.add(user, updatedProfile);
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

  // Admin login - accessible to anyone (guest), no auth check needed
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

  public shared ({ caller }) func submitLoanReferral(borrowerName : Text, phoneNumber : Text, loanAmount : Nat, notes : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit loan referrals");
    };

    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?p) { p };
    };

    if (not profile.active) {
      Runtime.trap("Only active members can refer loans");
    };

    let commission = calculateLoanReferralCommission(loanAmount);

    let referralId = nextLoanReferralId;
    let newReferral : LoanReferralRecord = {
      id = referralId;
      referrer = caller;
      borrowerName;
      phoneNumber;
      loanAmount;
      notes;
      commission;
      timestamp = Time.now();
    };

    loanReferralRecords.add(referralId, newReferral);
    nextLoanReferralId += 1;

    let updatedProfile = {
      profile with balance = profile.balance + commission;
    };

    userProfiles.add(caller, updatedProfile);

    referralId;
  };

  func calculateLoanReferralCommission(loanAmount : Nat) : Nat {
    loanAmount / 100;
  };

  func calcTotalLoanReferralCommissionFor(user : Principal) : Nat {
    var totalCommission = 0;
    for ((_, referral) in loanReferralRecords.entries()) {
      if (referral.referrer == user) {
        totalCommission += referral.commission;
      };
    };
    totalCommission;
  };

  public query ({ caller }) func getTotalLoanReferralCommission() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view loan referral commission");
    };

    calcTotalLoanReferralCommissionFor(caller);
  };

  func getDirectDownline(parentPrincipal : Principal) : [Principal] {
    var children : [Principal] = [];
    for ((p, profile) in userProfiles.entries()) {
      switch (profile.referrer) {
        case (?ref) {
          if (ref == parentPrincipal) {
            children := children.concat([p]);
          };
        };
        case (null) {};
      };
    };
    children;
  };

  func countTeamRecursive(parentPrincipal : Principal) : Nat {
    let directChildren = getDirectDownline(parentPrincipal);
    var count = directChildren.size();
    for (child in directChildren.values()) {
      count += countTeamRecursive(child);
    };
    count;
  };

  public query ({ caller }) func getTotalTeamSize() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view team size");
    };

    countTeamRecursive(caller);
  };

  public query ({ caller }) func getTotalEarnings() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view total earnings");
    };

    getTotalLevelIncomeForUser(caller);
  };

  public query ({ caller }) func getLoanReferralRecord(referralId : Nat) : async ?LoanReferralRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view loan referral records");
    };

    switch (loanReferralRecords.get(referralId)) {
      case (null) { null };
      case (?record) {
        if (caller != record.referrer and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own referral records");
        };
        ?record;
      };
    };
  };

  public query ({ caller }) func getAllLoanReferralRecords() : async [LoanReferralRecord] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all loan referral records");
    };

    loanReferralRecords.values().toArray();
  };

  public query ({ caller }) func getUserLoanReferralRecords(user : Principal) : async [LoanReferralRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view loan referral records");
    };

    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own loan referral records");
    };

    loanReferralRecords.values().toArray().filter(func(record) { record.referrer == user });
  };

  public shared ({ caller }) func markLevelRewarded(user : Principal, level : Nat) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can mark level rewards");
    };

    if (level < 1 or level > 10) {
      Runtime.trap("Invalid level. Must be between 1 and 10.");
    };

    var currentUsers = switch (levelRewardedUsers.get(level)) {
      case (null) {
        let newList = List.empty<Principal>();
        levelRewardedUsers.add(level, newList);
        newList;
      };
      case (?users) { users };
    };

    if (currentUsers.any(func(p) { p == user })) {
      return false;
    };
    currentUsers.add(user);
    levelRewardedUsers.add(level, currentUsers);
    true;
  };

  public query ({ caller }) func getTotalLevelIncome() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view total level income");
    };

    getTotalLevelIncomeForUser(caller);
  };

  func getTotalLevelIncomeForUser(user : Principal) : Nat {
    var totalIncome = 0;

    for ((level, users) in levelRewardedUsers.entries()) {
      if (users.any(func(p) { p == user })) {
        let rewardAmountPerLevel = 1000;
        totalIncome += rewardAmountPerLevel;
      };
    };
    totalIncome;
  };
};
