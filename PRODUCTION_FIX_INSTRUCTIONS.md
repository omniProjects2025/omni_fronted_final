# 🚨 URGENT FIX: Mixed Content Error Solution

## Problem
Your website `https://omnihospitals.in` is calling HTTP API endpoints:
```
❌ http://api.omni-hospitals.in:3000/getspecialty
```

This causes a **Mixed Content** error because HTTPS sites cannot call HTTP APIs.

## Root Cause
Your deployed build is using the wrong environment configuration.

## ✅ SOLUTION (Choose One):

### Option 1: Quick Fix - Run the Batch File
```bash
# Double-click this file:
fix-production-urls.bat
```

### Option 2: Manual Commands
```bash
# 1. Clean everything
Remove-Item -Path ".angular" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue

# 2. Install dependencies
npm install

# 3. Build for production
ng build --configuration production

# 4. Deploy the dist/omni-project-frontend/ folder to your server
```

### Option 3: Alternative Build Command
If the above fails, try:
```bash
npx @angular/cli@16 build --configuration production
```

## 🔍 Verification

After building, your `dist/omni-project-frontend/` folder should contain files that use:
```
✅ https://api.omni-hospitals.in/api/getspecialty
```

Instead of:
```
❌ http://api.omni-hospitals.in:3000/getspecialty
```

## 🚀 Deployment

1. **Upload** the entire `dist/omni-project-frontend/` folder contents to your web server
2. **Replace** all existing files on `https://omnihospitals.in`
3. **Test** - the Mixed Content error should be gone!

## 📋 Environment Configuration (Already Correct)

Your `src/environments/environment.prod.ts` is already correct:
```typescript
apiBaseUrl: 'https://api.omni-hospitals.in/api',
omniApiUrl: 'https://api.omni-hospitals.in/api',
specialtiesApiUrl: 'https://api.omni-hospitals.in/api',
```

## 🎯 Expected Result

After deployment, your API calls will be:
- ✅ `https://api.omni-hospitals.in/api/getspecialty`
- ✅ `https://api.omni-hospitals.in/api/getdoctors`
- ✅ `https://api.omni-hospitals.in/api/gethealthpackages`

This will **completely resolve** the Mixed Content error!

---

**Note**: Make sure your backend server at `api.omni-hospitals.in` supports HTTPS and has CORS configured for `https://omnihospitals.in`.
