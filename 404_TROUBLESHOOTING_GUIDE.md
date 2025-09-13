# 🚨 404 Error Troubleshooting Guide

## 🔍 Quick Diagnosis

The 404 error you're experiencing is likely due to one of these common issues:

### ✅ **Issue Found: Angular Development Server Not Running**

Based on our tests:
- ✅ **Backend server is running** (localhost:3000) ✓
- ✅ **API endpoints are working** (/api/getspecialty) ✓  
- ❌ **Angular server is NOT running** (localhost:4200) ✗

## 🚀 **Quick Fix - Start Both Servers**

### Step 1: Start Backend Server
```bash
# Open Terminal 1
cd D:\omni_new\omniServiceBackend
npm run dev
```

### Step 2: Start Frontend Server  
```bash
# Open Terminal 2
cd D:\omni_final
ng serve
```

### Step 3: Test the Connection
Open your browser and go to:
- **Frontend**: http://localhost:4200
- **API Test**: http://localhost:4200/api/health

## 🔧 **Alternative: Use the Startup Script**

I've created a PowerShell script to automate this:

```powershell
# Run this in PowerShell from D:\omni_final
.\start-dev-servers.ps1
```

## 🕵️ **Detailed Troubleshooting Steps**

### 1. Check Backend Server
```bash
curl http://localhost:3000/health
# Should return: {"status":"OK","message":"OMNI Hospitals API is running"...}
```

### 2. Check API Endpoints
```bash
curl http://localhost:3000/api/getspecialty
# Should return: {"message":"I have got all specialty",...}
```

### 3. Check Angular Server
```bash
curl http://localhost:4200
# Should return HTML content (Angular app)
```

### 4. Check Proxy Connection
```bash
curl http://localhost:4200/api/health
# Should return same as step 1 (proxied through Angular)
```

## 🐛 **Common 404 Error Scenarios**

### Scenario 1: Backend Not Running
**Error**: `Failed to load resource: the server responded with a status of 404`
**Solution**: Start backend server
```bash
cd D:\omni_new\omniServiceBackend
npm run dev
```

### Scenario 2: Angular Not Running  
**Error**: `Cannot GET /api/health` or connection refused
**Solution**: Start Angular server
```bash
cd D:\omni_final
ng serve
```

### Scenario 3: Wrong API URL
**Error**: 404 on specific endpoints
**Check**: Make sure your service is using the correct environment URL
```typescript
// Should be using '/api' in development
apiBaseUrl: '/api'  // ✓ Correct
apiBaseUrl: 'http://localhost:3000'  // ✗ Wrong (causes CORS)
```

### Scenario 4: Proxy Not Working
**Error**: CORS errors or 404 on /api/* routes
**Solution**: Check proxy configuration
```json
// proxy.conf.json should have:
{
  "/api/*": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

### Scenario 5: Route Not Found on Backend
**Error**: 404 from backend server
**Check**: Verify the endpoint exists
```bash
# Test direct backend access:
curl http://localhost:3000/api/getspecialty
```

## 🔍 **Browser Console Debugging**

Open browser DevTools (F12) and check:

### Network Tab
- Are requests going to the right URL?
- What's the actual response status and message?
- Are there CORS preflight requests?

### Console Tab
- Any JavaScript errors?
- Service worker issues?
- Environment configuration errors?

## 📋 **Verification Checklist**

Before reporting issues, verify:

- [ ] Backend server running on port 3000
- [ ] Frontend server running on port 4200  
- [ ] `http://localhost:3000/health` returns 200 OK
- [ ] `http://localhost:3000/api/getspecialty` returns data
- [ ] `http://localhost:4200` loads Angular app
- [ ] `http://localhost:4200/api/health` returns 200 OK (proxy test)
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows successful API calls

## 🚀 **Expected Working Flow**

```
1. User opens http://localhost:4200
   ↓
2. Angular app loads and makes API call to /api/getspecialty
   ↓  
3. Proxy intercepts /api/* and forwards to http://localhost:3000/api/getspecialty
   ↓
4. Backend processes request and returns data
   ↓
5. Proxy returns data to Angular app
   ↓
6. Angular displays specialties data
```

## 🆘 **Still Getting 404?**

If you're still experiencing issues:

1. **Share the exact error message** from browser console
2. **Share the Network tab** showing the failed request
3. **Confirm both servers are running** using the verification steps above
4. **Check if you're using the correct URL** in your service calls

## 💡 **Pro Tips**

1. **Always start backend first**, then frontend
2. **Use the startup script** to automate the process
3. **Check both terminals** for error messages
4. **Use browser DevTools** for detailed debugging
5. **Test API endpoints directly** before testing through proxy

---

**Need Help?** Share your browser console errors and I'll help you debug further! 🤝

