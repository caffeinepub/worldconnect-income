# Specification

## Summary
**Goal:** Implement a 1% withdrawal limit to restrict users from withdrawing more than 1% of their current balance.

**Planned changes:**
- Add backend validation in withdrawal request creation logic to calculate and enforce a 1% maximum withdrawal limit based on user's current balance
- Update withdrawal form to display the maximum allowed withdrawal amount (1% of balance)
- Add client-side validation to prevent form submission when withdrawal amount exceeds the 1% limit
- Show clear error messages indicating the maximum allowed withdrawal amount when limit is exceeded

**User-visible outcome:** Users can see their maximum allowed withdrawal amount (1% of balance) on the withdrawal page and receive clear feedback if they attempt to withdraw more than the allowed limit.
