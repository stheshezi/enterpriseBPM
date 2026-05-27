# Quick Start Guide - Enterprise BPM

## Current Status ✅

Your application is now running at: **http://localhost:3000**

### Dev Server Running
- ✓ Next.js development server started
- ✓ MongoDB connected (via cloud)
- ✓ NextAuth configured
- ✓ Login page fixed with actual form

## First Time Setup

### 1. Seed Database (One-time)

Run in another terminal:
```bash
npx prisma db seed
```

This creates:
- Admin tenant
- Demo users with different roles
- Authority levels (LM, BUMA, C5, CEO)
- Demo travel request (TR-001)

**Demo Credentials:**
```
Email: admin@example.com
Password: ChangeMe123!
```

### 2. Access the Application

1. Open **http://localhost:3000** in your browser
2. You'll be redirected to **/login** 
3. Enter demo credentials above
4. Click "Sign In"
5. You'll land on the dashboard

## Demo Users (All use password: ChangeMe123!)

| Role | Email | Purpose |
|------|-------|---------|
| Super Admin | admin@example.com | System administrator, full access |
| Tenant Admin | tenant.admin@example.com | Tenant management |
| IT Support | it.support@example.com | Technical support |
| Manager | manager@example.com | Approves travel requests |
| Finance | finance@example.com | Finance approvals |
| Requester | requester@example.com | Creates travel requests |

## Key Features Available

✅ **Travel Request Workflow**
- Create, submit, and track travel requests
- Multi-level approval chain
- Real-time status updates
- Audit trail

✅ **Generic Request Model** (Just Deployed!)
- Polymorphic request system
- Ready for expense claims, leave requests, etc.
- Payload-based data storage

✅ **Approval Engine**
- Authority level-based approvals
- Delegation support
- Workflow automation
- SLA tracking

✅ **Admin Features**
- User management
- Role configuration
- Approval policies
- Authority levels
- Department hierarchy

## Available API Endpoints

### Requests
```bash
POST   /api/requests              # Create request
GET    /api/requests/[id]         # Get request details
PATCH  /api/requests/[id]         # Update draft request
DELETE /api/requests/[id]         # Delete draft request
GET    /api/requests/list         # List all requests
```

### Approvals
```bash
POST   /api/approvals/[taskId]    # Approve/reject task
GET    /api/approvals/pending     # Get pending approvals
```

### Users
```bash
GET    /api/users                 # List users
GET    /api/users/[id]            # Get user details
```

### Audit
```bash
GET    /api/audit-logs            # Get audit trail
```

## File Structure

```
├── app/                          # Next.js app directory
│   ├── login/                    # Login page ✨ Fixed!
│   ├── dashboard/                # Main dashboard
│   ├── requests/                 # Request management
│   ├── approvals/                # Approval workflows
│   ├── api/                      # REST API endpoints
│   └── admin/                    # Admin panel
├── components/                   # React components
├── modules/                      # Business logic
│   ├── requests/                 # Request service ✨ Updated!
│   ├── workflow/                 # Workflow engine
│   ├── approvals/                # Approval logic
│   └── authority/                # Authority resolution
├── prisma/                       # Database schema
│   ├── schema.prisma             # ✨ Generic Request model
│   └── seed.ts                   # Database seeding
├── types/                        # TypeScript types
├── lib/                          # Utilities
│   ├── auth.ts                   # NextAuth config
│   └── prisma.ts                 # Prisma client
├── scripts/                      # Utility scripts
│   ├── migrate-travel-requests.ts ✨ Data migration
│   ├── test-migration.ts          # Validation
│   └── rollback-migration.ts      # Rollback
└── DEPLOYMENT.md                 # Production guide ✨ New!
```

## Troubleshooting

### "Stuck at redirecting..." before changes
- Old code was using redirect loop without form
- ✅ **FIXED:** New login form created with email/password fields

### Database Errors on First Run
- Make sure MongoDB URI in `.env` is correct
- Run seed: `npx prisma db seed`
- Check MongoDB Atlas connection string

### "Module not found" errors after changing schema
- Kill dev server: `Ctrl+C`
- Regenerate Prisma: `npx prisma generate`
- Restart: `npm run dev`

### Changes not appearing
- Check `.next` build cache
- Try: `rm -r .next` then `npm run dev` again

## Next Steps

1. **Seed the database:**
   ```bash
   npx prisma db seed
   ```

2. **Login and explore:**
   - Visit http://localhost:3000/login
   - Use demo credentials

3. **Try creating a request:**
   - Go to /requests/new
   - Fill travel request form
   - Submit for approval

4. **Test approval workflow:**
   - Login as manager or finance user
   - Go to /approvals
   - Review pending requests

5. **Check the refactoring:**
   - All new endpoints use generic `/api/requests`
   - Request data stored in polymorphic `payload` field
   - See `REFACTOR_COMPLETE.md` for full details

## Recent Changes ✨

### Phase 10: Production Ready Deployment
- ✅ Login form fixed and functional
- ✅ Generic Request API endpoints live
- ✅ Data migration scripts tested
- ✅ Comprehensive deployment guide created
- ✅ Production monitoring setup documented

### For Production Deployment
See `DEPLOYMENT.md` for:
- Step-by-step production deployment
- Data migration checklist
- Monitoring and alerts
- Rollback procedures

---

**Ready to go!** Start the dev server and login at http://localhost:3000

For more details, see:
- `REFACTOR_COMPLETE.md` - Refactoring summary
- `DEPLOYMENT.md` - Production deployment
- `REFACTOR_EXECUTION_SUMMARY.md` - Technical reference
