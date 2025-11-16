# Backup Current Environment Configuration
# Run this before updating .env.local with new database credentials
# Usage: .\backup-env.ps1

$ErrorActionPreference = "Stop"

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Environment Backup Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Define paths
$envFile = ".env.local"
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupFile = ".env.local.backup_$timestamp"

# Check if .env.local exists
if (-Not (Test-Path $envFile)) {
    Write-Host "❌ Error: $envFile not found!" -ForegroundColor Red
    Write-Host "Make sure you're running this from the project root directory." -ForegroundColor Yellow
    exit 1
}

try {
    # Create backup
    Copy-Item $envFile $backupFile
    Write-Host "✅ Backup created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📄 Original file: $envFile" -ForegroundColor White
    Write-Host "💾 Backup saved as: $backupFile" -ForegroundColor White
    Write-Host ""
    
    # Show current content
    Write-Host "Current .env.local content:" -ForegroundColor Cyan
    Write-Host "─────────────────────────────" -ForegroundColor Gray
    Get-Content $envFile | ForEach-Object {
        Write-Host $_ -ForegroundColor White
    }
    Write-Host "─────────────────────────────" -ForegroundColor Gray
    Write-Host ""
    
    # Next steps
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Get your new Supabase credentials from the dashboard" -ForegroundColor White
    Write-Host "2. Update $envFile with new values" -ForegroundColor White
    Write-Host "3. Restart your dev server: npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "If anything goes wrong, restore with:" -ForegroundColor Yellow
    Write-Host "   Copy-Item $backupFile $envFile -Force" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "✅ Backup complete!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error creating backup: $_" -ForegroundColor Red
    exit 1
}
