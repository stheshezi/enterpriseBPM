@echo off
REM MongoDB Replica Set Initialization Script for Windows

echo Starting MongoDB Replica Set initialization...
echo.

REM Connect to MongoDB and initialize replica set
mongosh --eval "rs.initiate()" 2>&1

if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Could not initialize replica set
    echo Make sure MongoDB is running and mongosh is in PATH
    echo.
    echo Troubleshooting:
    echo 1. Start MongoDB with: mongod --replSet rs0
    echo 2. Or add to MongoDB config file and restart service
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Replica Set initialized successfully!
echo.
echo Now you can run: npx prisma db seed
pause
