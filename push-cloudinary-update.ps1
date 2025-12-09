# Git commands to push Cloudinary update
# Run this script or copy commands to terminal

Write-Host "📦 Installing Cloudinary package..." -ForegroundColor Cyan
npm install cloudinary

Write-Host "`n📝 Staging changes..." -ForegroundColor Cyan
git add app/api/admin/content/upload/route.ts
git add package.json
git add package-lock.json

Write-Host "`n💾 Committing changes..." -ForegroundColor Cyan
git commit -m "Migrate file uploads to Cloudinary for Vercel compatibility"

Write-Host "`n🚀 Pushing to repository..." -ForegroundColor Cyan
git push

Write-Host "`n✅ Done! Don't forget to:" -ForegroundColor Green
Write-Host "1. Add Cloudinary environment variables in Vercel:" -ForegroundColor Yellow
Write-Host "   - CLOUDINARY_CLOUD_NAME" -ForegroundColor Yellow
Write-Host "   - CLOUDINARY_API_KEY" -ForegroundColor Yellow
Write-Host "   - CLOUDINARY_API_SECRET" -ForegroundColor Yellow
Write-Host "2. Get credentials from: https://cloudinary.com/console" -ForegroundColor Yellow



