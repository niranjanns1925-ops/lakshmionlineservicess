# Security Specification for Lakshmi E-Sevai Maiyam

## Data Invariants
1. **User Identity Isolation**: A citizen should only be able to read and write their own profile data.
2. **Request Ownership**: A citizen can only read or create requests where the `userId` matches their `auth.uid`.
3. **Officer Authorization**: Only users present in the `/admins/` collection can modify service catalogs or update request statuses.
4. **Immutable Fields**: `submittedAt` and `userId` in a request must be immutable after creation. `createdAt` in a profile or service must be immutable.
5. **Role Integrity**: A user cannot upgrade their own role to 'Admin' via client-side code.
6. **Relational Consistency**: A request can only be submitted for a service that exists in the `/services/` collection.

## The "Dirty Dozen" Payloads (Denial Tests)

### 1. Identity Spoofing (Profile)
**Goal**: Create a profile for another UID.
**Payload**: `setDoc(doc(db, 'users', 'someone_else_uid'), { name: 'Attacker', role: 'User', ... })`
**Expected**: PERMISSION_DENIED.

### 2. Privilege Escalation
**Goal**: Citizen tries to set their own role to 'Admin'.
**Payload**: `setDoc(doc(db, 'users', myUid), { name: 'Me', role: 'Admin', ... })`
**Expected**: PERMISSION_DENIED (isValidUser helper must check role).

### 3. Service Poisoning
**Goal**: Citizen tries to hijack a service catalog item.
**Payload**: `updateDoc(doc(db, 'services', 'svc_1'), { fee: 0 })`
**Expected**: PERMISSION_DENIED (isOfficer check required).

### 4. Admin Access Hijack
**Goal**: Citizen tries to add themselves to the admins collection.
**Payload**: `setDoc(doc(db, 'admins', myUid), { role: 'Admin' })`
**Expected**: PERMISSION_DENIED (admins collection should be restricted).

### 5. Cross-User Request Scrape
**Goal**: User A tries to list User B's requests.
**Payload**: `getDocs(query(collection(db, 'requests'), where('userId', '==', 'user_B_uid')))`
**Expected**: PERMISSION_DENIED (List rule must enforce `resource.data.userId == request.auth.uid`).

### 6. Orphaned Request Creation
**Goal**: Submit a request for a non-existent service.
**Payload**: `addDoc(collection(db, 'requests'), { serviceId: 'fake_service', ... })`
**Expected**: PERMISSION_DENIED (exists check for serviceId required).

### 7. Status Shortcutting
**Goal**: Citizen tries to self-approve their own request.
**Payload**: `updateDoc(doc(db, 'requests', 'req_123'), { status: 'Approved' })`
**Expected**: PERMISSION_DENIED (Update check must restrict status field modification to Officers).

### 8. Ghost Field Injection
**Goal**: Inject a hidden field into a service to bypass logic.
**Payload**: `updateDoc(doc(db, 'services', 'svc_1'), { isFree: true })`
**Expected**: PERMISSION_DENIED (affectedKeys().hasOnly() check).

### 9. ID Poisoning (Service)
**Goal**: Create a service with a massive/illegal ID.
**Payload**: `setDoc(doc(db, 'services', 'A'.repeat(2000)), { ... })`
**Expected**: PERMISSION_DENIED (isValidId size check).

### 10. Temporal Fraud
**Goal**: User tries to set a backdated `submittedAt`.
**Payload**: `addDoc(collection(db, 'requests'), { submittedAt: '2000-01-01T00:00:00Z', ... })`
**Expected**: PERMISSION_DENIED (Strict `request.time` check).

### 11. PII Blanket Read
**Goal**: Authenticated user tries to read all user emails.
**Payload**: `getDocs(collection(db, 'users'))`
**Expected**: PERMISSION_DENIED (Read restricted to owner or admin).

### 12. Immutable Field Override (Request)
**Goal**: User tries to change `userId` of an existing request to someone else to "transfer" it.
**Payload**: `updateDoc(doc(db, 'requests', 'my_req'), { userId: 'other_uid' })`
**Expected**: PERMISSION_DENIED (Immutability check).
