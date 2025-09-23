# 🚀 Complete Deployment Guide via SSH/PuTTY

## Prerequisites
- PuTTY installed on your computer
- SSH access to your server
- Your server credentials (IP, username, password)

## Step 1: Build Angular App for Production

### On Your Local Machine:
```bash
# Navigate to your Angular project
cd D:\omni_final

# Install dependencies
npm install

# Build for production
ng build --configuration=production
```

This creates a `dist/omni-project-frontend/` folder with your built app.

## Step 2: Connect to Server via PuTTY

1. **Open PuTTY**
2. **Enter your server details:**
   - Host Name: `your-server-ip` or `your-domain.com`
   - Port: `22` (default SSH port)
   - Connection type: SSH
3. **Click "Open"**
4. **Login with your credentials**

## Step 3: Prepare Server Environment

### Install Node.js and PM2 (if not already installed):
```bash
# Update system
sudo apt update

# Install Node.js (version 18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for web server
sudo apt install nginx -y
```

## Step 4: Upload Backend Files

### Create backend directory:
```bash
# Create app directory
sudo mkdir -p /var/www/omni-backend
sudo chown $USER:$USER /var/www/omni-backend
cd /var/www/omni-backend
```

### Upload your backend files using SCP or SFTP:
```bash
# From your local machine (use Command Prompt or PowerShell)
scp -r "D:\omni_new\omniServiceBackend\*" username@your-server:/var/www/omni-backend/
```

### Or use WinSCP/FileZilla to upload files to `/var/www/omni-backend/`

## Step 5: Configure Backend

### Install backend dependencies:
```bash
cd /var/www/omni-backend
npm install
```

### Create production .env file:
```bash
nano .env
```

### Add this content to .env:
```env
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb+srv://omniServices:Pallesathish%40123@omniservices.b4pjssa.mongodb.net/omniService
CORS_ORIGINS=https://omnihospitals.in,https://www.omni-hospitals.in,http://localhost:4200
```

### Start backend with PM2:
```bash
pm2 start server.js --name "omni-backend"
pm2 startup
pm2 save
```

## Step 6: Upload Frontend Files

### Create frontend directory:
```bash
sudo mkdir -p /var/www/html/omni-frontend
sudo chown $USER:$USER /var/www/html/omni-frontend
```

### Upload frontend files:
```bash
# From your local machine
scp -r "D:\omni_final\dist\omni-project-frontend\*" username@your-server:/var/www/html/omni-frontend/
```

## Step 7: Configure Nginx

### Create Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/omni-hospitals
```

### Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/html/omni-frontend;
    index index.html;

    # Frontend routing
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, must-revalidate";
    }

    # API proxy to backend
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/omni-hospitals /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 8: Configure SSL (Optional but Recommended)

### Install Certbot:
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Get SSL certificate:
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Step 9: Test Your Deployment

### Check backend status:
```bash
pm2 status
curl http://localhost:3000/health
```

### Check frontend:
```bash
curl http://your-domain.com
```

### Check logs if needed:
```bash
pm2 logs omni-backend
sudo tail -f /var/log/nginx/error.log
```

## Step 10: Update DNS (if needed)

Point your domain to your server's IP address:
- A record: `your-domain.com` → `your-server-ip`
- A record: `www.your-domain.com` → `your-server-ip`

## Maintenance Commands

### Update backend:
```bash
cd /var/www/omni-backend
git pull  # if using git
pm2 restart omni-backend
```

### Update frontend:
```bash
# Upload new build files
# Then restart nginx
sudo systemctl restart nginx
```

### Monitor:
```bash
pm2 monit
sudo systemctl status nginx
```

## Troubleshooting

### If API calls fail:
1. Check PM2 status: `pm2 status`
2. Check backend logs: `pm2 logs omni-backend`
3. Check CORS origins in your .env file
4. Verify MongoDB connection

### If frontend doesn't load:
1. Check Nginx status: `sudo systemctl status nginx`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify file permissions: `ls -la /var/www/html/omni-frontend/`

### If CORS errors persist:
1. Update CORS_ORIGINS in backend .env file
2. Restart backend: `pm2 restart omni-backend`
3. Check browser console for exact error messages
