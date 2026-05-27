# Production Deployment Checklist & Monitoring

## Pre-Deployment (Staging)

- [ ] Run validation script: `npx tsx scripts/test-migration.ts`
- [ ] Verify all tests pass with 100% success rate
- [ ] Load test with expected production volume
- [ ] Verify database backup taken pre-migration
- [ ] Test rollback procedure on staging clone
- [ ] Verify monitoring dashboards are active
- [ ] Review migration report for any warnings

## Deployment Steps

### Phase 1: Pre-Migration Setup (Production)

```bash
# 1. Create database backup
# Work with DBA team to backup production MongoDB

# 2. Verify deployment window
# Ensure maintenance window is scheduled
# Notify stakeholders

# 3. Enable monitoring
# Start monitoring aggregation
# Set up alert thresholds
```

### Phase 2: Execute Migration

```bash
# 1. Put application in maintenance mode
NODE_ENV=production npm run maintenance:on

# 2. Generate Prisma client with new schema
npx prisma generate

# 3. Run data migration
npx tsx scripts/migrate-travel-requests.ts

# 4. Run validation
npx tsx scripts/test-migration.ts

# 5. Verify migration report
cat migration-report-*.json
```

### Phase 3: Application Deployment

```bash
# 1. Build new application code
npm run build

# 2. Run database migrations (if any)
# MongoDB doesn't require schema migrations, but verify indexes

# 3. Deploy application
# Use your CI/CD pipeline (GitHub Actions, etc)

# 4. Health checks
npm run health:check

# 5. Exit maintenance mode
NODE_ENV=production npm run maintenance:off
```

## Monitoring During Deployment

### Key Metrics to Monitor

```
API Endpoints
  - POST /api/requests - Response time < 500ms, Error rate < 0.1%
  - GET /api/requests/[id] - Response time < 200ms, Error rate < 0.1%
  - GET /api/requests/list - Response time < 300ms, Error rate < 0.1%

Database Performance
  - Request collection query time (should be similar to before)
  - Connection pool utilization < 80%
  - Network I/O < 100 Mbps

Application Health
  - Error rate < 0.5%
  - Memory usage stable (check for memory leaks)
  - CPU usage < 75%
  - Request queue length < 100
```

### Monitoring Dashboard Setup

```javascript
// Example Prometheus metrics to track
request_duration_seconds{endpoint="/api/requests"}
request_errors_total{endpoint="/api/requests"}
request_payload_size_bytes
request_database_query_time_seconds
request_collection_count
```

### Alert Thresholds

| Metric | Threshold | Action |
|--------|-----------|--------|
| API Error Rate | > 1% | Page on-call engineer |
| API Response Time (p95) | > 1000ms | Investigate database |
| Request Collection Query Time | > 500ms | Check MongoDB indexes |
| Memory Growth Rate | > 5%/min | Check for memory leak |
| Sync Errors | Any | Immediate investigation |

## Rollback Plan

### If Migration Fails

```bash
# 1. Note the backup collection name from migration report
BACKUP_COLLECTION="travelRequests_backup_1234567890"

# 2. Run rollback script
npx tsx scripts/rollback-migration.ts --backup $BACKUP_COLLECTION

# 3. Verify rollback success
npx tsx scripts/test-migration.ts

# 4. Restore from database backup if needed
# Work with DBA team
```

### Critical Failure Response

1. **Immediate Actions** (First 5 minutes)
   - Put application in maintenance mode
   - Start database backup verification
   - Notify on-call team and stakeholders

2. **Assessment** (5-15 minutes)
   - Review migration logs and errors
   - Check application error logs
   - Determine if rollback is necessary

3. **Execute Rollback** (15-30 minutes)
   - Run rollback script
   - Verify data integrity
   - Monitor application recovery

4. **Post-Incident** (After 1 hour)
   - Document root cause
   - Review monitoring alerts
   - Update migration procedures
   - Schedule post-mortem

## Post-Deployment Verification (First 24 Hours)

```bash
# 1. Verify data consistency (1 hour post-deployment)
npx tsx scripts/test-migration.ts

# 2. Check for any failed jobs
# Review application logs for errors
grep "ERROR" logs/* | head -50

# 3. Monitor workflow execution
# Sample requests through approval workflows
# Verify tasks are being assigned correctly

# 4. Database statistics
# Check request count matches expectations
# Verify indexes are being used

# 5. User feedback
# Monitor support tickets
# Check application usage patterns
```

## Long-term Monitoring (First 7 Days)

### Daily Checks

- [ ] Zero data loss or corruption
- [ ] API response times normalized
- [ ] No memory leaks (memory usage stable)
- [ ] Approval workflows executing correctly
- [ ] Audit logs capturing events
- [ ] No orphaned references

### Weekly Optimization

- [ ] Analyze database query performance
- [ ] Verify index usage statistics
- [ ] Review slow query logs
- [ ] Plan for any performance optimizations

## Communication Template

### Pre-Deployment Notification

```
Subject: Production Maintenance - Generic Request Model Migration

Impact: All request management features will be temporarily unavailable
Duration: [X] hours
Time: [Day] [Time] [Timezone]

Details:
We're migrating to a more flexible generic request system. This will enable
support for additional request types in the future while maintaining all
existing travel request functionality.

What to expect:
- Brief maintenance window (typically < 30 minutes)
- All existing data will be preserved
- No user action required

Thank you for your patience.
```

### Post-Deployment Notification

```
Subject: Production Maintenance Complete - Generic Request Model Active

✅ Migration completed successfully at [time]

Status: All systems operational
Performance: Normal
Data: All preserved with no loss

The generic request system is now live. Travel requests continue to work
exactly as before, with enhanced capabilities for future request types.
```

## Success Criteria

✅ Migration marked successful when:
- [ ] All validation tests pass
- [ ] Zero data loss or corruption
- [ ] API response times meet SLA (< 500ms p95)
- [ ] Error rate < 0.5%
- [ ] Audit trail complete and accurate
- [ ] Approval workflows functional
- [ ] User-reported issues resolved within 1 hour

## Emergency Contacts

- Database Team: [contact]
- DevOps Team: [contact]
- On-Call Engineer: [contact]
- Product Lead: [contact]

---

**Last Updated**: [Date]
**Migration Version**: 1.0
**Rollback Backup**: Check migration report for collection name
