# 🚀 Automatic Canonical Tags Update Script

This script automatically adds canonical tags, meta descriptions, and SEO optimization to all your Angular components.

## 📋 What This Script Does

✅ **Adds Canonical Tags** - Prevents "Missing" status in SEO tools  
✅ **Sets Meta Titles** - Optimized titles for each page  
✅ **Adds Meta Descriptions** - SEO-friendly descriptions  
✅ **Includes Keywords** - Relevant keywords for each page  
✅ **Updates Imports** - Adds necessary Angular imports  
✅ **Modifies Constructors** - Injects required services  
✅ **Adds ngOnInit** - Implements OnInit interface  

## 🎯 Components That Will Be Updated

The script will automatically update all these components:

- `blog-details` → `/blogs-details`
- `blog-details-data` → `/blogs-details-data`
- `blogs` → `/blogs`
- `board-members` → `/board-members`
- `book-an-appointment` → `/book-an-appointment`
- `careers` → `/careers`
- `contact-us` → `/contact-us`
- `doctor-details` → `/doctor-details`
- `feedback` → `/feedback`
- `fixed-surgery-details` → `/fixed-surgery-details`
- `fixed-surgical-packages` → `/fixed-surgical-packages`
- `health-checkup` → `/health-checkup`
- `key-surgeries` → `/key-surgeries`
- `news-media` → `/news-media`
- `news-media-details` → `/news-media-details`
- `not-found` → `/not-found`
- `our-branches` → `/our-branches`
- `our-empanelment` → `/our-empanelment`
- `package-details` → `/package-details`
- `patient-care` → `/patient-care`
- `privacy-polocy` → `/privacy-polocy`
- `second-opinion` → `/second-opinion`
- `technologies` → `/technologies`
- `technologies-details` → `/technologies-details`
- `terms-conditions` → `/terms-conditions`
- `thank-you` → `/thank-you`

## 🚀 How to Run the Script

### Option 1: Windows Batch File (Easiest)
```bash
# Double-click this file or run in command prompt:
run-canonical-update.bat
```

### Option 2: PowerShell Script
```powershell
# Run in PowerShell:
.\update-canonical-tags.ps1
```

### Option 3: Node.js Script
```bash
# Make sure Node.js is installed, then run:
node update-canonical-tags.js
```

## 📝 What Gets Added to Each Component

### 1. Imports
```typescript
import { Title, Meta } from '@angular/platform-browser';
import { CanonicalService } from '../services/canonical.service';
```

### 2. OnInit Interface
```typescript
export class YourComponent implements OnInit {
```

### 3. Constructor
```typescript
constructor(
  // ... existing dependencies
  private titleService: Title,
  private metaService: Meta,
  private canonicalService: CanonicalService
) {}
```

### 4. ngOnInit Method
```typescript
ngOnInit(): void {
  this.setSEOTags();
}
```

### 5. SEO Method
```typescript
private setSEOTags(): void {
  this.titleService.setTitle('Your Page Title - OMNI Hospitals');
  this.metaService.updateTag({ 
    name: 'description', 
    content: 'Your page description' 
  });
  this.metaService.updateTag({ 
    name: 'keywords', 
    content: 'your, keywords, here' 
  });
  this.canonicalService.setCanonicalUrl('/your-route');
}
```

## ⚠️ Important Notes

### Before Running:
1. **Backup your project** - The script modifies files
2. **Ensure CanonicalService exists** - Make sure `src/app/services/canonical.service.ts` is present
3. **Check existing components** - Components already with canonical tags will be skipped

### After Running:
1. **Test your application** - Make sure everything compiles
2. **Check SEO tools** - Verify canonical tags are working
3. **Review generated content** - Ensure titles and descriptions are appropriate

## 🔍 Example Output

```
🚀 Starting canonical tags update script...

Found 25 components to process:

🔄 Processing blog-details...
✅ Updated blog-details
🔄 Processing careers...
✅ Updated careers
✅ contact-us already has canonical tags
🔄 Processing doctor-details...
✅ Updated doctor-details

📊 Summary:
✅ Processed: 23 components
⏭️  Skipped: 2 components

🎉 Canonical tags update completed!
```

## 🛠️ Troubleshooting

### Common Issues:

1. **PowerShell Execution Policy Error**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **Node.js Not Found**
   - Install Node.js from https://nodejs.org/
   - Or use PowerShell script instead

3. **File Permission Errors**
   - Run as Administrator
   - Check file permissions

4. **Import Errors After Running**
   - Make sure `CanonicalService` exists in `src/app/services/`
   - Check Angular imports are correct

## 📊 SEO Benefits

After running this script, you'll have:

✅ **No More "Missing" Canonical Tags**  
✅ **Better Search Engine Rankings**  
✅ **Prevented Duplicate Content Issues**  
✅ **Optimized Meta Tags for Each Page**  
✅ **Improved SEO Compliance**  

## 🎯 Next Steps

1. **Run the script** using one of the methods above
2. **Test your application** to ensure everything works
3. **Deploy your changes** to see canonical tags in action
4. **Submit sitemap** to Google Search Console
5. **Monitor SEO improvements** in your analytics tools

---

**Need Help?** Check the console output for detailed error messages and troubleshooting tips.
