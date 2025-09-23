# OMNI Hospitals - CORS & Proxy Setup Guide

## 🎯 Overview

This guide shows the complete setup for connecting your Angular frontend to Node.js backend without CORS issues in both development and production environments.

## 📁 Project Structure

```
D:\omni_final\                    # Angular Frontend
├── src/environments/
│   ├── environment.ts            # Development config
│   └── environment.prod.ts       # Production config
├── proxy.conf.json              # Proxy configuration
└── angular.json                 # Updated with proxy config

D:\omni_new\omniServiceBackend\   # Node.js Backend
├── server.js                    # Updated with secure CORS
├── .env.example                 # Environment variables template
└── routes/                      # API routes
```

## 🔧 Angular Frontend Configuration

### 1. Environment Files

#### `src/environments/environment.ts` (Development)
```typescript
export const environment = {
  production: false,
  // Use proxy in development to avoid CORS issues
  apiBaseUrl: '/api',
  omniApiUrl: '/api',
  specialtiesApiUrl: '/api',
  blogApiUrl: 'https://omniservicebackend.onrender.com',
  // Direct URLs for fallback (if proxy fails)
  directApiUrl: 'http://localhost:3000',
  leadsquared: {
    baseUrl: 'https://api-in21.leadsquared.com/v2/',
    accessKey: 'u$r56afea08b32d556818ad1a5f69f0e7f0',
    secretKey: '8d7f86d677dadaba209b4dead3cfcc4ab019031b'
  }
};
```

#### `src/environments/environment.prod.ts` (Production)
```typescript
export const environment = {
  production: true,
  // Production API URLs (use HTTPS in production)
  apiBaseUrl: 'https://api.omni-hospitals.in/api',
  omniApiUrl: 'https://api.omni-hospitals.in/api',
  specialtiesApiUrl: 'https://api.omni-hospitals.in/api',
  blogApiUrl: 'https://omniservicebackend.onrender.com',
  // Fallback direct URL
  directApiUrl: 'https://api.omni-hospitals.in',
  leadsquared: {
    baseUrl: 'https://api-in21.leadsquared.com/v2/',
    accessKey: 'u$r56afea08b32d556818ad1a5f69f0e7f0',
    secretKey: '8d7f86d677dadaba209b4dead3cfcc4ab019031b'
  }
};
```

### 2. Proxy Configuration

#### `proxy.conf.json`
```json
{
  "/api/*": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  }
}
```

### 3. Angular JSON Update

#### `angular.json` (serve section)
```json
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "options": {
    "proxyConfig": "proxy.conf.json"
  },
  "configurations": {
    "production": {
      "browserTarget": "omni-project-frontend:build:production"
    },
    "development": {
      "browserTarget": "omni-project-frontend:build:development"
    }
  },
  "defaultConfiguration": "development"
}
```

## 🚀 Node.js Backend Configuration

### 1. Secure CORS Setup

#### `server.js` (Updated CORS Configuration)
```javascript
// CORS Configuration - Secure setup for OMNI Hospitals
const parsedEnvOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const defaultOrigins = [
  // Production domains
  'https://omnihospitals.in',
  'http://omni-hospitals.in',
  'https://www.omni-hospitals.in',
  'http://www.omni-hospitals.in',
  // Development
  'http://localhost:4200',
  'http://127.0.0.1:4200',
  // Legacy domains (if needed)
  'https://omni-fronted-final.vercel.app',
  'https://omni-frontend-final.vercel.app',
  'https://omniprojects2025.github.io'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = parsedEnvOrigins.length ? parsedEnvOrigins : defaultOrigins;
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-HTTP-Method-Override'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
```

### 2. Route Configuration

#### API Routes Setup
```javascript
// Register routes with proper API prefixing
// Mount all routes under /api for better organization and security
app.use('/api', userRouter);
app.use('/api', specialtiesRouter);
app.use('/api', doctorRoutes);
app.use('/api', mailRoutes);
app.use('/api', healthpackage);
app.use('/api', surgicalpackage);
app.use('/api', doctorsnew);

// Legacy routes for backward compatibility (if needed)
// Remove these after frontend is fully migrated to /api prefix
app.use('/', userRouter);
app.use('/', specialtiesRouter);
app.use('/', doctorRoutes);
app.use('/', mailRoutes);
app.use('/', healthpackage);
app.use('/', surgicalpackage);
app.use('/', doctorsnew);
```

### 3. Health Check Endpoints

```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'OMNI Hospitals API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'OMNI Hospitals API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});
```

## 🔄 How It Works

### Development Flow
```
Angular (localhost:4200) 
    ↓ API call to /api/getspecialty
Proxy (proxy.conf.json)
    ↓ Forwards to http://localhost:3000/api/getspecialty
Node.js Backend (localhost:3000)
    ↓ CORS allows localhost:4200
Response sent back through proxy
```

### Production Flow
```
Angular (https://omnihospitals.in)
    ↓ API call to https://api.omni-hospitals.in/api/getspecialty
Node.js Backend (https://api.omni-hospitals.in)
    ↓ CORS allows omni-hospitals.in
Direct response (no proxy needed)
```

## 🛠️ Commands to Run

### Development

#### 1. Start Backend
```bash
cd D:\omni_new\omniServiceBackend
npm run dev
# Server starts on http://localhost:3000
```

#### 2. Start Frontend (in separate terminal)
```bash
cd D:\omni_final
ng serve
# App starts on http://localhost:4200 with proxy
```

### Production

#### 1. Build Frontend
```bash
cd D:\omni_final
ng build --configuration production
# Builds to dist/ folder
```

#### 2. Deploy Backend
```bash
cd D:\omni_new\omniServiceBackend
npm start
# Runs on production server
```

## 🔍 API Endpoints

### Available Endpoints

| Endpoint | Development URL | Production URL |
|----------|----------------|----------------|
| Health Check | `http://localhost:4200/api/health` | `https://api.omni-hospitals.in/api/health` |
| Specialties | `http://localhost:4200/api/getspecialty` | `https://api.omni-hospitals.in/api/getspecialty` |
| Doctors | `http://localhost:4200/api/getdoctors` | `https://api.omni-hospitals.in/api/getdoctors` |
| Health Packages | `http://localhost:4200/api/gethealthpackages` | `https://api.omni-hospitals.in/api/gethealthpackages` |
| Surgery Packages | `http://localhost:4200/api/getfixedsurgicalpackages` | `https://api.omni-hospitals.in/api/getfixedsurgicalpackages` |

## ✅ Testing the Setup

### 1. Test Backend Health
```bash
curl http://localhost:3000/api/health
# Should return: {"status":"OK","message":"OMNI Hospitals API is running"...}
```

### 2. Test Frontend-Backend Connection
```bash
# Start both servers, then:
curl http://localhost:4200/api/health
# Should return same response (proxied through Angular)
```

### 3. Test CORS
```javascript
// In browser console on http://localhost:4200
fetch('/api/health')
  .then(res => res.json())
  .then(data => console.log('✅ Success:', data))
  .catch(err => console.log('❌ Error:', err));
```

## 🔐 Security Features

1. **Strict CORS**: Only allows specific origins
2. **Method Restrictions**: Only allows necessary HTTP methods
3. **Header Control**: Restricts allowed headers
4. **Rate Limiting**: Built-in rate limiting
5. **Helmet**: Security headers
6. **HPP**: HTTP Parameter Pollution protection

## 🚨 Troubleshooting

### Common Issues

1. **CORS Error in Development**
   - Check if proxy.conf.json is correctly configured
   - Ensure backend is running on localhost:3000
   - Verify angular.json has proxyConfig setting

2. **CORS Error in Production**
   - Check if your domain is in the CORS origins list
   - Ensure HTTPS is used in production
   - Verify environment variables are set correctly

3. **Proxy Not Working**
   - Restart `ng serve` after changing proxy.conf.json
   - Check console for proxy logs
   - Verify backend server is accessible

### Debug Commands

```bash
# Check if backend is running
curl http://localhost:3000/api/health

# Check proxy in development
curl http://localhost:4200/api/health

# Check CORS headers
curl -H "Origin: http://localhost:4200" -v http://localhost:3000/api/health
```

## 🎯 Benefits

1. **No CORS Issues**: Proxy handles CORS in development
2. **Secure Production**: Strict CORS policy for production
3. **Clean URLs**: All API calls use consistent `/api` prefix
4. **Environment-Specific**: Different configs for dev/prod
5. **Health Monitoring**: Built-in health check endpoints
6. **Backward Compatible**: Legacy routes still work during transition

---

**Setup Status**: ✅ Complete
**CORS Issues**: ✅ Resolved
**Proxy**: ✅ Configured
**Security**: ✅ Implemented



