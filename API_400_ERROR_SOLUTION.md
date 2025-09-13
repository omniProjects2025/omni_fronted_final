# Solution for 400 Bad Request Error on /api/send-email

## Problem Analysis
The API is returning: `"Missing required fields or resume file"`

## Root Cause
The backend expects a multipart form with file upload, but there might be issues with:
1. Multer file processing configuration
2. Frontend form data structure
3. Proxy configuration affecting file uploads

## Backend Analysis
Looking at `mailController.js` line 11:
```javascript
if (!firstName || !lastName || !phone || !email || !position || !file) {
  throw new AppError('Missing required fields or resume file', 400);
}
```

The file is extracted from:
```javascript
const file = (req.files && req.files[0]) || req.file;
```

## Solutions Applied

### 1. Fix Proxy Configuration for File Uploads
The proxy might not be handling multipart form data correctly.

### 2. Update Multer Configuration
Ensure multer is properly configured to handle file uploads.

### 3. Frontend Form Data Structure
Verify the frontend is sending the correct FormData structure.

### 4. Add Debug Logging
Add logging to identify exactly what's being received.

## Implementation Steps

1. **Update proxy.conf.json** - Add proper headers for file uploads
2. **Add debug endpoint** - Create a test endpoint to see what's being received
3. **Fix frontend form submission** - Ensure proper FormData construction
4. **Test with direct API call** - Bypass proxy for testing

## Files to Modify
- `proxy.conf.json` - Update proxy configuration
- Backend mail routes - Add debug logging
- Frontend careers component - Verify FormData structure


