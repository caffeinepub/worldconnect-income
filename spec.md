# Specification

## Summary
**Goal:** Add mobile number login with OTP verification for regular members on the LoginPage, alongside the existing admin login flow.

**Planned changes:**
- Add a "Member Login" tab/section to `LoginPage.tsx` where any user can enter their registered mobile number and request an OTP.
- Display an OTP input field after the mobile number is submitted.
- On correct OTP entry, authenticate the user and redirect them to the dashboard; show an error if the phone number is not registered.
- Keep the existing admin phone login (9422018674) fully intact.
- Add `requestMemberOTP(phone)` to the backend actor that generates and stores a simulated OTP for the given phone number.
- Add `verifyMemberOTP(phone, otp)` to the backend actor that validates the submitted OTP.
- Add `getUserByPhone(phone)` query to the backend actor that returns the matching user profile.

**User-visible outcome:** Regular members can now log in using their registered mobile number and a simulated OTP, while admin login continues to work as before.
