# MongoDB Setup for Enterprise BPM

## After MongoDB Installation

### Step 1: Verify MongoDB is Running
```bash
netstat -ano | findstr :27017
```
You should see: `TCP    127.0.0.1:27017    LISTENING`

### Step 2: Initialize Replica Set (Required for Prisma Transactions)

**Option A: Using MongoDB Service (Recommended)**

1. Open PowerShell as Administrator
2. Run:
```powershell
$config = @"
storage:
  dbPath: C:\Program Files\MongoDB\Server\7.0\data
  journal:
    enabled: true
net:
  port: 27017
  bindIp: 127.0.0.1
replication:
  replSetName: rs0
"@

$config | Out-File -FilePath "C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg" -Encoding UTF8
```

3. Restart MongoDB Service:
```powershell
Restart-Service MongoDB
```

**Option B: Manual Replica Set Initialization**

1. Open Command Prompt as Administrator
2. Run:
```bash
mongod --replSet rs0
```
(Keep this window open)

3. Open another Command Prompt and run:
```bash
mongosh
```

4. In mongosh shell, run:
```javascript
rs.initiate()
```

### Step 3: Seed the Database

Once replica set is initialized:
```bash
npx prisma db seed
```

This creates:
- ✅ Admin tenant
- ✅ Demo users (6 total)
- ✅ Authority levels
- ✅ Demo request

### Step 4: Start Dev Server

```bash
npm run dev
```

Then visit: **http://localhost:3000/login**

### Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | ChangeMe123! | Super Admin |
| manager@example.com | ChangeMe123! | Manager |
| finance@example.com | ChangeMe123! | Finance |
| requester@example.com | ChangeMe123! | Requester |
| tenant.admin@example.com | ChangeMe123! | Tenant Admin |
| it.support@example.com | ChangeMe123! | IT Support |

### Troubleshooting

**"Prisma needs transactions, which requires MongoDB replica set"**
- Replica set not initialized
- Solution: Run `rs.initiate()` in mongosh

**"Connection refused on port 27017"**
- MongoDB not running
- Solution: Check Windows Services or run `mongod` manually

**"mongosh/mongo not found"**
- MongoDB tools not in PATH
- Solution: Add `C:\Program Files\MongoDB\Server\7.0\bin` to Windows PATH

### Connection String Used

```
mongodb://127.0.0.1:27017/enterprise_bpm
```

This is configured in `.env` as `MONGODB_URI`
