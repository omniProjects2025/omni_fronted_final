# CORS Issues - Complete Fix Guide

## 🚨 Issues Fixed

### Backend Issues Fixed:
1. ✅ **CORS Origins Updated** - Added all necessary frontend domains
2. ✅ **API Warmup Fixed** - Corrected endpoint paths from `/api/v1` to `/api`
3. ✅ **Enhanced Error Logging** - Better CORS debugging messages
4. ✅ **Additional Headers** - Added required CORS headers

### Frontend Issues Fixed:
1. ✅ **Proxy Configuration Enhanced** - Better error handling and logging
2. ✅ **HTTP Interceptor Added** - Automatic retry and error handling
3. ✅ **Environment URLs Fixed** - All APIs use correct environment URLs
4. ✅ **Debug Logging Added** - Better visibility into API calls

## 🏃‍♂️ How to Test the Fixes

### Step 1: Backend Setup
```bash
# Navigate to backend directory
cd D:\omni_new\omniServiceBackend

# Install dependencies (if not already done)
npm install

# Create .env file with CORS origins
# (Copy the content from the backend fixes above)

# Start the backend server
npm run dev
```

### Step 2: Frontend Setup
```bash
# Navigate to frontend directory
cd D:\omni_final

# Install dependencies (if not already done)
npm install

# Start the frontend with proxy
ng serve
```

### Step 3: Test API Endpoints
```bash
# From frontend directory, run the test script
node test-api.js
```

## 🔍 Debugging CORS Issues

### Check Browser Console
Look for these messages:
- ✅ `CORS allowed origin: http://localhost:4200`
- ❌ `CORS blocked origin: ...`
- 🔄 `Proxying: GET /api/getdoctors`

### Check Network Tab
1. Look for **preflight OPTIONS** requests
2. Check **Access-Control-Allow-Origin** headers
3. Verify **Request URL** is correct

### Backend Console Messages
- ✅ `Server is running on port 3000`
- ✅ `Database successfully connected`
- ✅ `Warmed up: /getdoctors`
- ✅ `CORS allowed origin: http://localhost:4200`

## 🛠️ Manual CORS Configuration

### If you need to add more origins:

**Backend (server.js):**
```javascript
const defaultOrigins = [
  'https://your-production-domain.com',
  'https://www.your-production-domain.com',
  'http://localhost:4200',
  // Add your domains here
];
```

**Or use environment variable:**
```bash
# In .env file
CORS_ORIGINS=https://omnihospitals.in,https://www.omni-hospitals.in,http://localhost:4200
```

## 🚨 Common Issues & Solutions

### Issue 1: "Not allowed by CORS"
**Solution:** Add your frontend domain to CORS origins in backend

### Issue 2: "Network Error" (Status 0)
**Solutions:**
- Check if backend is running on port 3000
- Verify proxy.conf.json is correct
- Check if Angular dev server is using proxy

### Issue 3: "Preflight request failed"
**Solutions:**
- Ensure backend handles OPTIONS requests
- Check CORS headers configuration
- Verify allowed methods and headers

### Issue 4: API calls work in Postman but not browser
**Solution:** This is classic CORS - browser enforces CORS, Postman doesn't

## 📊 Environment Configuration

### Development:
- Frontend: `http://localhost:4200`
- Backend: `http://localhost:3000`
- API Calls: `/api/*` → Proxy → `http://localhost:3000/api/*`

### Production:
- Frontend: `https://omnihospitals.in`
- Backend: `https://api.omni-hospitals.in`
- API Calls: Direct to `https://api.omni-hospitals.in/api/*`

## ✅ Verification Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Browser console shows CORS allowed messages
- [ ] API calls return data (not CORS errors)
- [ ] Network tab shows successful requests
- [ ] No "blocked by CORS" errors

## 🔧 Quick Test Commands

```bash
# Test backend health
curl http://localhost:3000/health

# Test API endpoint
curl -H "Origin: http://localhost:4200" http://localhost:3000/api/getdoctors

# Test with browser (open in browser)
http://localhost:4200
```

## 📞 Support

If you still encounter CORS issues:
1. Check both backend and frontend console logs
2. Verify the exact error message
3. Ensure all origins are added to CORS configuration
4. Check that proxy configuration is working

