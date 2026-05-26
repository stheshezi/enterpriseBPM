# Quick Reference Card - Enterprise BPM Platform Team

**Print this or bookmark it. Reference whenever needed.**

---

## 🎯 Core Principle

```
Frontend builds PAGES & FORMS
Backend builds APIS & LOGIC

They don't fight. 
They don't block each other.
They communicate.
They ship fast.
```

---

## 📍 Where Things Live

```
Pages:           app/(dashboard)/**/page.tsx
Forms:           components/requests, approvals, admin
API Routes:      app/api/**/route.ts
Business Logic:  modules/requests, tasks, approvals
Database:        Prisma + PostgreSQL
Config:          config/permissions.ts, roles.ts
Auth:            lib/auth.ts
```

---

## 🔄 Frontend → Backend

```
Frontend does:
✅ Shows page
✅ Shows form
✅ Handles clicks
✅ Calls API
✅ Shows errors
✅ Redirects

Frontend doesn't do:
❌ Check permissions (shows UI only)
❌ Validate business rules
❌ Access database
❌ Create audit logs
❌ Enforce workflow
```

---

## 🔧 Backend → Frontend

```
Backend does:
✅ Validate authentication
✅ Validate permissions
✅ Validate input (Zod)
✅ Business logic
✅ Database operations
✅ Create audit logs
✅ Return clear errors

Backend doesn't do:
❌ Render HTML
❌ Handle UI state
❌ Show loading spinners
❌ Make routing decisions
❌ Choose what to display
```

---

## 🚀 The Flow (Request Example)

```
1. User clicks "Submit Request"
   ↓
2. Frontend POST to /api/travel-requests
   ↓
3. Backend validates everything
   ↓
4. Backend creates record + workflow
   ↓
5. Backend returns { travelRequest: {...} }
   ↓
6. Frontend redirects to /requests/[id]
   ↓
7. Detail page fetches from GET /api/travel-requests/[id]
   ↓
8. Backend returns full request with audit + tasks
   ↓
9. Frontend displays it all beautifully
```

---

## ✅ Page Checklist (Frontend)

```typescript
export default async function PageName() {
  // 1. Auth check
  const session = await getServerSession();
  if (!session) redirect('/login');

  // 2. Permission check (for UX)
  if (!session.user.permissions.includes(...)) {
    redirect('/unauthorized');
  }

  // 3. Fetch from API
  const data = await fetch('/api/...');

  // 4. Render
  return <Component data={data} />;
}
```

---

## ✅ API Checklist (Backend)

```typescript
export async function GET/POST(request: Request) {
  // 1. Auth
  const session = await getServerSession();
  if (!session) return { error: 'Unauthorized', status: 401 };

  // 2. Permission
  if (!session.user.permissions.includes(...)) {
    return { error: 'Forbidden', status: 403 };
  }

  // 3. Validate input (POST/PUT)
  const parsed = schema.safeParse(body);
  if (!parsed.success) return { error: '...', status: 400 };

  // 4. Business logic
  const result = await businessLogic(...);

  // 5. Log audit
  await logAudit(...);

  // 6. Return
  return { data: result, status: 200 };
}
```

---

## 🆘 When Stuck

| Stuck On | Do This |
|----------|---------|
| API not ready | Add to form anyway, frontend sends it, backend uses/ignores |
| Form field missing | Just add it, it's optional, backend handles it |
| Permission issue | Frontend checks for UX, backend enforces security |
| Data not displaying | Check API response format, adjust component |
| Workflow broken | Trace through each step, check audit logs |
| Permission denied | Check user roles in database |

---

## 💬 Communication

```
Slack: #bpm-integration
Issue: "Form has no X field"
Action: Add it to form
Time: 5 minutes
Result: Keeps shipping
```

**NOT:**
```
Email: "We need field X"
Waiting for: 3 days
Meeting: 1 hour
Result: Blocked
```

---

## 🎯 Daily Standup

```
Frontend: "Built /requests/new and /requests/[id], need budget API"
Backend: "Built /api/travel-requests, working on /api/approvals"
Together: "If frontend needs field, just add it, I'll handle backend"
Result: Keep shipping
```

---

## 📊 This Week's Focus

**Frontend Priority:**
- [ ] All pages created
- [ ] All forms integrated
- [ ] All error states working

**Backend Priority:**
- [ ] All APIs created
- [ ] All permissions working
- [ ] All business logic done

**Together:**
- [ ] End-to-end workflow tested
- [ ] No blockers, no waiting

---

## 🚀 Ship It

```
Code → Commit → PR Review → Merge → Deploy → Monitor

No big meetings needed.
No long wait times.
Just keep moving.
```

---

## 🎓 Key Docs to Know

```
TEAM_ARCHITECTURE_COLLABORATION.md
  └─ Read this first

FRONTEND_IMPLEMENTATION_GUIDE.md
  └─ Frontend: Detailed how-to

BACKEND_IMPLEMENTATION_GUIDE.md
  └─ Backend: Detailed how-to

SMART_FORM_COMPLETION_SYSTEM.md
  └─ When things are missing

COMPLETE_WORKFLOW_IMPLEMENTATION.md
  └─ See how it all flows together
```

---

## ⚡ Emergency Contacts

```
Frontend blocked:     Post in #bpm-integration
Backend blocked:      Post in #bpm-integration
Production issues:    Post in #bpm-urgent
Architecture Q:       Read TEAM_ARCHITECTURE_COLLABORATION.md
```

---

## 🏆 Success Looks Like

✅ User creates request in 2 minutes
✅ Manager approves in 1 minute
✅ Finance approves in 1 minute
✅ Request shows APPROVED immediately
✅ Audit log has complete history
✅ No errors anywhere
✅ Everyone shipped fast

---

**Bookmark this. Reference it daily. Ship like gods.** 🚀

