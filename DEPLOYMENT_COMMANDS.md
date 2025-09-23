# Complete Deployment Guide for GoDaddy VPS

## **Root Cause of Mixed-Content Error**
Mixed-content means your frontend is loaded via `https://` but your API requests use `http://`. Browsers block these requests for security. **Solution**: Ensure both frontend and API are served via HTTPS.

---

## **PART A: File Changes Summary**

### **Files Changed:**

#### Backend (`D:\omni_new\omniServiceBackend\`):
- `server.js` - Added HTTPS redirect, updated CORS origins
- `env.example` - Environment variables template

#### Frontend (`D:\omni_final\`):
- `src/environments/environment.ts` - Added baseUrl for consistency
- `src/environments/environment.prod.ts` - Added baseUrl for consistency  
- `src/app/doctordetails.service.ts` - Fixed hardcoded URL, added environment import
- `src/app/careers/careers.component.ts` - Fixed hardcoded URL, added environment import
- `src/app/home/home.component.ts` - Fixed hardcoded URLs, secured LeadSquared calls
- `src/app/health-checkup/health-checkup.component.ts` - Fixed LeadSquared URLs
- `src/app/doctor-details/doctor-details.component.ts` - Fixed LeadSquared URLs
- `src/app/package-details/package-details.component.ts` - Fixed LeadSquared URLs
- `proxy.conf.json` - Cleaned up proxy configuration

---

## **PART B: Deployment Commands**

### **Step 1: Prepare Local Builds**

#### **1.1 Build Angular Frontend**
```bash
# Navigate to Angular project
cd D:\omni_final

# Install dependencies (if needed)
npm install

# Build for production
ng build --configuration=production

# Verify dist folder created
ls dist/
```

#### **1.2 Prepare Backend**
```bash
# Navigate to backend project
cd D:\omni_new\omniServiceBackend

# Install dependencies (if needed)
npm install

# Test locally first
npm start
```

---

### **Step 2: GoDaddy cPanel Setup**

#### **2.1 Domain and Subdomain Setup**
1. **Login to cPanel**
   - Go to your GoDaddy hosting control panel
   - Access cPanel

2. **Create API Subdomain**
   - Go to **Subdomains** in cPanel
   - Create subdomain: `api.omni-hospitals.in`
   - Point to folder: `/public_html/api` (or create new folder)

3. **Enable AutoSSL (CRITICAL)**
   - Go to **SSL/TLS** → **Let's Encrypt**
   - Enable AutoSSL for both:
     - `omni-hospitals.in`
     - `api.omni-hospitals.in`
   - Wait for SSL certificates to be issued (5-10 minutes)

#### **2.2 Upload Frontend Files**
1. **Via cPanel File Manager:**
   - Go to **File Manager**
   - Navigate to `/public_html/`
   - Delete default files (index.html, etc.)
   - Upload contents of `D:\omni_final\dist\omni_final\*` to `/public_html/`
   - Ensure `index.html` is in root of `/public_html/`

2. **Via WinSCP/SFTP (Alternative):**
   ```bash
   # Upload dist contents to /public_html/
   # Server: your-server-ip
   # Username: your-cpanel-username  
   # Password: your-cpanel-password
   # Port: 22
   ```

#### **2.3 Setup Node.js Application**
1. **Via cPanel Node.js App Manager:**
   - Go to **Node.js** in cPanel
   - Click **Create Application**
   - Settings:
     - **Node.js Version**: 18.x or latest
     - **Application Mode**: Production
     - **Application Root**: `api` (or your chosen folder)
     - **Application URL**: `api.omni-hospitals.in`
     - **Application Startup File**: `server.js`

2. **Upload Backend Files:**
   - Upload contents of `D:\omni_new\omniServiceBackend\*` to `/public_html/api/`
   - Exclude `node_modules` folder (will install on server)

---

### **Step 3: Server Configuration (SSH/PuTTY)**

#### **3.1 Connect via PuTTY**
```bash
# PuTTY Connection Settings:
# Host Name: your-server-ip or your-domain.com
# Port: 22
# Connection Type: SSH
# Username: your-cpanel-username
# Password: your-cpanel-password
```

#### **3.2 Navigate and Setup Backend**
```bash
# Navigate to API directory
cd public_html/api

# Install dependencies
npm install

# Create environment file
cp env.example .env
nano .env
```

#### **3.3 Configure Environment Variables**
```bash
# Edit .env file with your values:
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/omni_hospitals
PORT=3000
CORS_ORIGINS=https://omnihospitals.in,https://api.omni-hospitals.in
LEADSQUARED_ACCESS_KEY=your_access_key_here
LEADSQUARED_SECRET_KEY=your_secret_key_here
```

#### **3.4 Setup PM2 (Process Manager)**
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start server.js --name "omni-api"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

# Check status
pm2 status
pm2 logs omni-api
```

---

### **Step 4: Database Setup**

#### **4.1 MongoDB Setup (if using local MongoDB)**
```bash
# Install MongoDB (Ubuntu/CentOS)
# Ubuntu:
sudo apt update
sudo apt install -y mongodb

# CentOS:
sudo yum install -y mongodb-server

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create database and user
mongo
use omni_hospitals
db.createUser({
  user: "omni_user",
  pwd: "secure_password",
  roles: ["readWrite"]
})
exit
```

#### **4.2 Update Connection String**
```bash
# Update .env with proper MongoDB URI
MONGODB_URI=mongodb://omni_user:secure_password@localhost:27017/omni_hospitals
```

---

### **Step 5: Verification Commands**

#### **5.1 Test API Endpoints**
```bash
# Test health check
curl -X GET https://api.omni-hospitals.in/health

# Expected response:
# {"status":"OK","message":"OMNI Hospitals API is running","timestamp":"...","environment":"production"}

# Test API health check
curl -X GET https://api.omni-hospitals.in/api/health

# Test CORS
curl -X OPTIONS https://api.omni-hospitals.in/api/health \
  -H "Origin: https://omnihospitals.in" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Test specific endpoints
curl -X GET https://api.omni-hospitals.in/api/getdoctors
curl -X GET https://api.omni-hospitals.in/api/getspecialty
curl -X GET https://api.omni-hospitals.in/api/gethealthpackages
```

#### **5.2 Test Frontend**
```bash
# Test main site
curl -I https://omnihospitals.in

# Should return 200 OK with Content-Type: text/html

# Test in browser:
# 1. Go to https://omnihospitals.in
# 2. Open Developer Tools → Network tab
# 3. Navigate through site
# 4. Verify API calls go to https://api.omni-hospitals.in/api/*
# 5. No CORS errors should appear
```

#### **5.3 SSL Certificate Verification**
```bash
# Check SSL certificate
openssl s_client -connect omni-hospitals.in:443 -servername omni-hospitals.in
openssl s_client -connect api.omni-hospitals.in:443 -servername api.omni-hospitals.in

# Both should show valid certificates
```

---

### **Step 6: Troubleshooting Commands**

#### **6.1 Backend Issues**
```bash
# Check PM2 logs
pm2 logs omni-api --lines 50

# Restart application
pm2 restart omni-api

# Check port usage
netstat -tulpn | grep :3000

# Check MongoDB connection
mongo omni_hospitals --eval "db.stats()"
```

#### **6.2 Frontend Issues**
```bash
# Check Apache/Nginx logs
tail -f /var/log/apache2/error.log
# or
tail -f /var/log/nginx/error.log

# Check file permissions
ls -la /public_html/
chmod -R 755 /public_html/
```

#### **6.3 SSL Issues**
```bash
# Force SSL renewal
certbot renew --force-renewal

# Check SSL configuration
curl -I https://omnihospitals.in
curl -I https://api.omni-hospitals.in
```

---

### **Step 7: Final Verification Checklist**

- [ ] ✅ Frontend loads at `https://omnihospitals.in`
- [ ] ✅ API responds at `https://api.omni-hospitals.in/health`
- [ ] ✅ No mixed-content errors in browser console
- [ ] ✅ No CORS errors in browser console
- [ ] ✅ SSL certificates valid for both domains
- [ ] ✅ API endpoints return expected data
- [ ] ✅ Form submissions work (LeadSquared integration)
- [ ] ✅ PM2 shows application running
- [ ] ✅ MongoDB connection successful

---

### **Step 8: Maintenance Commands**

#### **8.1 Regular Updates**
```bash
# Update application
cd public_html/api
git pull origin main  # if using git
npm install
pm2 restart omni-api

# Update frontend
# Upload new dist files to /public_html/
```

#### **8.2 Monitoring**
```bash
# Monitor PM2 processes
pm2 monit

# Check system resources
htop
df -h

# Monitor logs
pm2 logs omni-api --follow
```

---

## **Common Issues & Solutions**

1. **Mixed Content Error**: Ensure both domains have valid SSL certificates
2. **CORS Error**: Verify CORS_ORIGINS in .env matches your domains exactly
3. **API Not Responding**: Check PM2 status and logs
4. **404 Errors**: Verify file paths and permissions
5. **Database Connection**: Check MongoDB service and credentials

---

## **Security Notes**

- ✅ API keys moved to backend (.env file)
- ✅ CORS properly configured
- ✅ HTTPS enforced in production
- ✅ Rate limiting enabled
- ✅ Input validation implemented
- ✅ Helmet security headers active
