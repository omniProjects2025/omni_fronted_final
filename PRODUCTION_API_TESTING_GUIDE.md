# 🌐 Production API Testing & Deployment Guide

## 🚨 **Current Status**

### ✅ **Local Development** 
- **Backend**: `http://localhost:3000` ✅ Working
- **Frontend**: `http://localhost:4200` ✅ Working  
- **Proxy**: `/api/*` ✅ Working

### ❌ **Production API**
- **URL**: `https://api.omni-hospitals.in`
- **Status**: 500 Internal Server Error ❌
- **Issue**: Server configuration problem

## 🔍 **Production Server Issues Identified**

### Error Details:
```
Internal Server Error
The server encountered an internal error or misconfiguration 
and was unable to complete your request.
```

### Possible Causes:
1. **Server Not Running**: Node.js application might not be running on the production server
2. **Domain Configuration**: DNS or server configuration issues
3. **SSL Certificate**: HTTPS configuration problems
4. **Port Configuration**: Server might be running on wrong port
5. **Environment Variables**: Missing or incorrect environment configuration

## 🛠️ **How to Test Production API**

### 1. **Test Different Endpoints**
```bash
# Test basic connectivity
curl http://api.omni-hospitals.in
curl https://api.omni-hospitals.in

# Test health endpoints
curl http://api.omni-hospitals.in/health
curl http://api.omni-hospitals.in/api/health

# Test API endpoints
curl http://api.omni-hospitals.in/getspecialty
curl http://api.omni-hospitals.in/api/getspecialty
```

### 2. **Test with Different Ports**
```bash
# Test common ports
curl http://api.omni-hospitals.in:3000/health
curl http://api.omni-hospitals.in:8080/health
curl http://api.omni-hospitals.in:5000/health
```

### 3. **Test from Browser**
Open browser and try:
- http://api.omni-hospitals.in/health
- https://api.omni-hospitals.in/health  
- http://api.omni-hospitals.in:3000/health

## 🚀 **Production Deployment Checklist**

### **Server Setup Requirements**
- [ ] Node.js installed on production server
- [ ] MongoDB running and accessible
- [ ] Environment variables configured
- [ ] Domain DNS pointing to server IP
- [ ] SSL certificate installed (for HTTPS)
- [ ] Firewall configured to allow HTTP/HTTPS traffic
- [ ] Process manager (PM2) installed for Node.js

### **Backend Deployment Steps**

#### 1. **Server Environment Setup**
```bash
# On your production server
cd /path/to/your/app
npm install --production
```

#### 2. **Environment Configuration**
Create `.env` file on production server:
```bash
# Production Environment Variables
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/omni_hospitals

# CORS Origins
CORS_ORIGINS=https://omnihospitals.in,https://www.omni-hospitals.in,http://omni-hospitals.in

# Other configs...
```

#### 3. **Start Production Server**
```bash
# Option 1: Direct start
npm start

# Option 2: With PM2 (recommended)
npm install -g pm2
pm2 start server.js --name "omni-api"
pm2 startup
pm2 save
```

#### 4. **Nginx Configuration** (if using Nginx)
```nginx
server {
    listen 80;
    server_name api.omni-hospitals.in;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 **Environment Configuration Fix**

Let me update your environment files to be more flexible:

### **Updated Development Environment**
```typescript
export const environment = {
  production: false,
  // Local development with proxy
  apiBaseUrl: '/api',
  omniApiUrl: '/api', 
  specialtiesApiUrl: '/api',
  
  // Fallback URLs for direct testing
  directApiUrl: 'http://localhost:3000',
  
  // External APIs
  blogApiUrl: 'https://omniservicebackend.onrender.com',
  leadsquared: { /* ... */ }
};
```

### **Updated Production Environment**  
```typescript
export const environment = {
  production: true,
  // Try different production URLs based on server setup
  apiBaseUrl: 'http://api.omni-hospitals.in:3000/api',     // If running on port 3000
  omniApiUrl: 'http://api.omni-hospitals.in:3000/api',
  specialtiesApiUrl: 'http://api.omni-hospitals.in:3000/api',
  
  // Alternative URLs to try
  // apiBaseUrl: 'https://api.omni-hospitals.in/api',      // If HTTPS is configured
  // apiBaseUrl: 'http://api.omni-hospitals.in/api',       // If running on port 80
  
  blogApiUrl: 'https://omniservicebackend.onrender.com',
  leadsquared: { /* ... */ }
};
```

## 🧪 **Testing Strategy**

### **Phase 1: Local Testing** ✅
- [x] Backend running on localhost:3000
- [x] Frontend running on localhost:4200  
- [x] Proxy working for /api/* routes
- [x] All endpoints returning data

### **Phase 2: Production Testing** 
- [ ] Verify production server is running
- [ ] Test direct API endpoints
- [ ] Configure CORS for production domain
- [ ] Test frontend with production API
- [ ] SSL certificate setup (if needed)

## 🔄 **Temporary Workaround**

Until your production server is fixed, you can:

### **Option 1: Use Alternative Backend**
Update production environment to use a working backend:
```typescript
// Temporary production config
export const environment = {
  production: true,
  apiBaseUrl: 'https://omniservicebackend-vnyk.onrender.com',
  // ... other configs
};
```

### **Option 2: Build for Local Testing**
Test production build locally:
```bash
# Build for production
ng build --configuration production

# Serve the built files
npx http-server dist/omni-project-frontend -p 8080

# Test at http://localhost:8080
```

## 📋 **Debugging Commands**

### **Server Status Check**
```bash
# Check if server is running
nslookup api.omni-hospitals.in
ping api.omni-hospitals.in
telnet api.omni-hospitals.in 80
telnet api.omni-hospitals.in 3000
```

### **Network Testing**  
```bash
# Test connectivity
curl -v http://api.omni-hospitals.in
curl -I http://api.omni-hospitals.in:3000
```

### **Browser Testing**
```javascript
// Test in browser console
fetch('http://api.omni-hospitals.in:3000/health')
  .then(res => res.json())
  .then(data => console.log('✅ Success:', data))
  .catch(err => console.log('❌ Error:', err));
```

## 🎯 **Next Steps**

1. **Fix Production Server**: Address the 500 Internal Server Error
2. **Verify Server Configuration**: Ensure Node.js app is running
3. **Test Different URLs**: Try various port and protocol combinations
4. **Update Environment**: Use working production URL once identified
5. **Deploy Frontend**: Build and deploy with correct production API URL

## 💡 **Quick Test Script**

I'll create a script to test multiple production URLs:

```powershell
# Test various production endpoints
$urls = @(
    "http://api.omni-hospitals.in/health",
    "https://api.omni-hospitals.in/health", 
    "http://api.omni-hospitals.in:3000/health",
    "http://api.omni-hospitals.in/api/health",
    "http://api.omni-hospitals.in:3000/api/health"
)

foreach ($url in $urls) {
    Write-Host "Testing: $url" -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri $url -TimeoutSec 10
        Write-Host "✅ Success: $($response.StatusCode)" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}
```

---

**Current Status**: Local development working ✅ | Production server needs fixing ❌

Once your production server is running correctly, your frontend will work seamlessly with both environments! 🚀



