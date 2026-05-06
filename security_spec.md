# Security Specification - Portunol Plus

## 1. Data Invariants
- `settings/global`: Only specific admin emails (hardcoded or in-doc) can modify. Read access is public for app config.
- `users/{userId}`: Only the authenticated user with `uid == userId` can read or write their own progress.
- `iaCredits`: Users should not be able to arbitrarily increase their credits (only via rewarded actions). *Note: Currently the app is client-heavy, but rules should restrict profile updates.*

## 2. The "Dirty Dozen" Payloads

### P1: Global Config Overwrite (Anonymous)
- **Path**: `settings/global`
- **Operation**: `write`
- **Auth**: None
- **Payload**: `{ "unityAds": { ... }, "adminEmails": ["attacker@evil.com"] }`
- **Expected**: `PERMISSION_DENIED`

### P2: Global Config Overwrite (Non-Admin User)
- **Path**: `settings/global`
- **Operation**: `write`
- **Auth**: `uid: "normal_user"`
- **Payload**: `{ "adminEmails": ["attacker@evil.com"] }`
- **Expected**: `PERMISSION_DENIED`

### P3: User Data Theft
- **Path**: `users/victim_uid`
- **Operation**: `read`
- **Auth**: `uid: "attacker_uid"`
- **Expected**: `PERMISSION_DENIED`

### P4: User Data Spoofing
- **Path**: `users/victim_uid`
- **Operation**: `write`
- **Auth**: `uid: "attacker_uid"`
- **Payload**: `{ "xp": 999999 }`
- **Expected**: `PERMISSION_DENIED`

### P5: Large ID Poisoning
- **Path**: `users/[1.5KB_STRING_ID]`
- **Operation**: `create`
- **Auth**: `uid: "[1.5KB_STRING_ID]"`
- **Expected**: `PERMISSION_DENIED` (via `isValidId` check)

### P6: Invalid Data Type (XP as String)
- **Path**: `users/user_uid`
- **Operation**: `write`
- **Auth**: `uid: "user_uid"`
- **Payload**: `{ "xp": "lots_of_xp" }`
- **Expected**: `PERMISSION_DENIED` (via `isValidUserProgress` check)

### P7: Ghost Field Injection
- **Path**: `users/user_uid`
- **Operation**: `write`
- **Auth**: `uid: "user_uid"`
- **Payload**: `{ "xp": 100, "isVip": true }`
- **Expected**: `PERMISSION_DENIED` (via `affectedKeys().hasOnly()` or strict schema)

### P8: Email Spoofing (Unverified)
- **Path**: `settings/global`
- **Operation**: `write`
- **Auth**: `uid: "hacker", email: "m.sazzad2467@gmail.com", email_verified: false`
- **Expected**: `PERMISSION_DENIED`

### P9: Arbitrary Credit Increase
- **Path**: `users/user_uid`
- **Operation**: `update`
- **Auth**: `uid: "user_uid"`
- **Payload**: `{ "rewards": { "aiCredits": 10000 } }`
- **Expected**: `PERMISSION_DENIED` (if we strictly control update fields)

### P10: Admin bypass attempt
- **Path**: `settings/global`
- **Operation**: `delete`
- **Auth**: `uid: "user_uid"`
- **Expected**: `PERMISSION_DENIED`

### P11: Root Level Access
- **Path**: `random_collection/doc`
- **Operation**: `read`
- **Auth**: `uid: "user_uid"`
- **Expected**: `PERMISSION_DENIED` (via default-deny)

### P12: Resource Exhaustion (Massive Array)
- **Path**: `users/user_uid`
- **Operation**: `write`
- **Auth**: `uid: "user_uid"`
- **Payload**: `{ "badges": [ "badge", ... x 5000 ] }`
- **Expected**: `PERMISSION_DENIED` (via `.size() <= 100` check)

## 3. The Test Runner 
(Conceptual - to be implemented in `DRAFT_firestore.rules` validation)
