# Enable MongoDB Replica Set
# Run this as Administrator

$mongoPath = "C:\Program Files\MongoDB\Server\8.3\bin\mongod.cfg"
$config = @"
# mongod.conf

storage:
  dbPath: C:\Program Files\MongoDB\Server\8.3\data

systemLog:
  destination: file
  logAppend: true
  path: C:\Program Files\MongoDB\Server\8.3\log\mongod.log

net:
  port: 27017
  bindIp: 127.0.0.1

replication:
  replSetName: rs0
"@

try {
    Write-Host "📝 Updating MongoDB configuration..." -ForegroundColor Cyan
    
    # Backup original
    Copy-Item $mongoPath "$mongoPath.backup" -Force
    Write-Host "✅ Backup created: $mongoPath.backup" -ForegroundColor Green
    
    # Write new config
    $config | Out-File -FilePath $mongoPath -Encoding UTF8 -Force
    Write-Host "✅ Configuration updated" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "🔄 Restarting MongoDB service..." -ForegroundColor Cyan
    Restart-Service MongoDB -Force
    
    Start-Sleep -Seconds 3
    
    Write-Host "✅ MongoDB restarted" -ForegroundColor Green
    Write-Host ""
    Write-Host "⏳ Waiting for MongoDB to be ready..." -ForegroundColor Cyan
    Start-Sleep -Seconds 5
    
    Write-Host "✅ MongoDB is ready!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Run: node scripts/init-replica-set.js" -ForegroundColor White
    Write-Host "2. Run: npx prisma db seed" -ForegroundColor White
    Write-Host "3. Run: npm run dev" -ForegroundColor White
    
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run this script as Administrator" -ForegroundColor Yellow
}
