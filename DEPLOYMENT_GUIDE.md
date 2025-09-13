# 🚀 Angular App Deployment Guide

## 📋 **Pre-Deployment Checklist**

Before deploying, ensure you have:
- [x] **Production build working locally** ✅
- [x] **Production API endpoints tested** ✅ (`http://api.omni-hospitals.in:3000`)
- [x] **Environment configuration updated** ✅
- [ ] **SSH access to your production server**
- [ ] **Domain configured** (omni-hospitals.in)

## 🏗️ **Step 1: Build Your Angular App**

```bash
# Navigate to your Angular project
cd D:\omni_final

# Build for production
ng build --configuration production

# Verify build output
ls dist/omni-project-frontend/
```

**Expected output**: HTML, CSS, JS files in `dist/omni-project-frontend/`

## 📦 **Step 2: Prepare Files for Upload**

### **Option A: Create ZIP Archive**
```bash
# Create a zip file for easy upload
cd dist
powershell Compress-Archive -Path omni-project-frontend -DestinationPath omni-frontend-production.zip
```

### **Option B: Use File Transfer Tools**
- **WinSCP** (Windows GUI)
- **FileZilla** (Cross-platform GUI)
- **SCP command** (Command line)

## 🌐 **Step 3: Deploy to Your Server**

### **SSH Connection**
```bash
# Connect to your server
ssh root@your-server-ip
# or
ssh root@omni-hospitals.in
```

### **Upload Methods**

#### **Method 1: Using SCP (Recommended)**
```bash
# From your local machine (D:\omni_final)
scp -r dist/omni-project-frontend/* root@your-server-ip:/var/www/html/

# Or if using domain
scp -r dist/omni-project-frontend/* root@omni-hospitals.in:/var/www/html/
```

#### **Method 2: Using WinSCP (GUI)**
1. Open WinSCP
2. Connect to your server (Host: `omni-hospitals.in`, Username: `root`)
3. Navigate to `/var/www/html/` (or your web root)
4. Upload all files from `dist/omni-project-frontend/`

#### **Method 3: Upload ZIP and Extract**
```bash
# Upload zip file
scp dist/omni-frontend-production.zip root@omni-hospitals.in:/var/www/html/

# SSH into server and extract
ssh root@omni-hospitals.in
cd /var/www/html/
unzip omni-frontend-production.zip
mv omni-project-frontend/* ./
rm -rf omni-project-frontend omni-frontend-production.zip
```

## ⚙️ **Step 4: Server Configuration**

### **Apache Configuration** (if using Apache)
```bash
# SSH into your server
ssh root@omni-hospitals.in

# Edit Apache virtual host
nano /etc/apache2/sites-available/omni-hospitals.conf
```

**Apache Virtual Host Configuration:**
```apache
<VirtualHost *:80>
    ServerName omni-hospitals.in
    ServerAlias www.omni-hospitals.in
    DocumentRoot /var/www/html
    
    # Enable Angular routing
    <Directory /var/www/html>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Angular routing fallback
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/omni_error.log
    CustomLog ${APACHE_LOG_DIR}/omni_access.log combined
</VirtualHost>
```

### **Nginx Configuration** (if using Nginx)
```bash
# Edit Nginx configuration
nano /etc/nginx/sites-available/omni-hospitals
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name omni-hospitals.in www.omni-hospitals.in;
    root /var/www/html;
    index index.html;
    
    # Angular routing fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

## 🔧 **Step 5: Restart Web Server**

### **Apache**
```bash
# Test configuration
apache2ctl configtest

# Restart Apache
systemctl restart apache2

# Check status
systemctl status apache2
```

### **Nginx**
```bash
# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx

# Check status
systemctl status nginx
```

## 🧪 **Step 6: Test Deployment**

### **1. Test Website Access**
```bash
# From your local machine
curl http://omni-hospitals.in
curl http://www.omni-hospitals.in
```

### **2. Test in Browser**
Open browser and navigate to:
- http://omni-hospitals.in
- http://www.omni-hospitals.in

### **3. Test API Connections**
Open browser console (F12) and run:
```javascript
// Test API connection
fetch('http://api.omni-hospitals.in:3000/getspecialty')
  .then(res => res.json())
  .then(data => console.log('✅ API working:', data))
  .catch(err => console.error('❌ API error:', err));
```

## 🔍 **Troubleshooting**

### **Common Issues & Solutions**

#### **1. 404 Errors on Page Refresh**
**Problem**: Angular routes return 404 when accessed directly
**Solution**: Ensure server fallback to index.html is configured (see Step 4)

#### **2. API CORS Errors**
**Problem**: API calls blocked by CORS
**Solution**: Update your backend CORS configuration:
```javascript
// In your backend server.js
const corsOptions = {
  origin: [
    'http://omni-hospitals.in',
    'http://www.omni-hospitals.in',
    'https://omni-hospitals.in',
    'https://www.omni-hospitals.in'
  ],
  credentials: true
};
```

#### **3. Assets Not Loading**
**Problem**: CSS/JS files return 404
**Solution**: Check file permissions and paths:
```bash
# Fix permissions
chmod -R 755 /var/www/html/
chown -R www-data:www-data /var/www/html/
```

#### **4. Server Not Accessible**
**Problem**: Can't access the website
**Solution**: Check firewall and DNS:
```bash
# Check if port 80 is open
ufw status
ufw allow 80
ufw allow 443

# Check DNS
nslookup omni-hospitals.in
```

## 📁 **File Structure After Deployment**

```
/var/www/html/
├── index.html                 # Main Angular app
├── main.*.js                  # Angular application code
├── polyfills.*.js            # Browser compatibility
├── runtime.*.js              # Angular runtime
├── styles.*.css              # Application styles
├── assets/                   # Static assets
│   ├── images/
│   ├── icons/
│   └── json_data_files/
└── favicon.ico               # Website icon
```

## 🔐 **Security Recommendations**

### **1. Enable HTTPS**
```bash
# Install Certbot for Let's Encrypt
apt update
apt install certbot python3-certbot-apache

# Get SSL certificate
certbot --apache -d omni-hospitals.in -d www.omni-hospitals.in
```

### **2. Enable Firewall**
```bash
# Configure UFW
ufw enable
ufw allow ssh
ufw allow 80
ufw allow 443
```

### **3. Regular Updates**
```bash
# Keep server updated
apt update && apt upgrade -y
```

## 📊 **Deployment Verification Checklist**

- [ ] **Files uploaded successfully**
- [ ] **Web server restarted**
- [ ] **Website accessible** (http://omni-hospitals.in)
- [ ] **Angular routing works** (try different pages)
- [ ] **API calls successful** (check browser console)
- [ ] **Assets loading** (images, CSS, JS)
- [ ] **Mobile responsive** (test on phone)
- [ ] **Performance good** (check loading times)

## 🚀 **Quick Deployment Commands**

Here's a complete script you can run:

```bash
# On your local machine (Windows PowerShell)
cd D:\omni_final
ng build --configuration production
cd dist
powershell Compress-Archive -Path omni-project-frontend -DestinationPath omni-frontend.zip

# Upload to server (replace with your server details)
scp omni-frontend.zip root@omni-hospitals.in:/var/www/html/

# On your server (via SSH)
ssh root@omni-hospitals.in
cd /var/www/html
unzip omni-frontend.zip
mv omni-project-frontend/* ./
rm -rf omni-project-frontend omni-frontend.zip
systemctl restart apache2  # or nginx
```

## 🎯 **Success Indicators**

When deployment is successful, you should see:
- ✅ Website loads at http://omni-hospitals.in
- ✅ All pages accessible (no 404s)
- ✅ API calls working (specialties load)
- ✅ Images and assets display correctly
- ✅ No console errors in browser

---

**Need Help?** If you encounter any issues during deployment, share the specific error messages and I'll help you troubleshoot! 🤝

**Note**: I cannot directly access your server, but I can guide you through every step of the process! 🚀



