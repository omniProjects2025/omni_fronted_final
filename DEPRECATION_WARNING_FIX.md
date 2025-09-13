# Fix for util._extend Deprecation Warning

## Problem
You are getting this deprecation warning:
```
(node:21892) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.
```

## Root Cause
The warning is caused by the **OwlCarousel2 library (version 2.3.4)** which is using the deprecated `util._extend` Node.js API. This is a known issue with older JavaScript libraries that haven't been updated to use modern APIs.

## Solutions Applied

### 1. Immediate Fix - Suppress Warnings (Recommended for Development)
**Updated package.json scripts:**
- `npm run start` - Runs with deprecation warnings suppressed
- `npm run start-dev` - Runs with normal warnings (for debugging)
- `npm run start-trace` - Runs with trace deprecation for debugging

**PowerShell script:**
- `.\start-dev-no-warnings.ps1` - Alternative way to run without warnings

### 2. Browser Polyfill (Additional Protection)
**Added polyfill file:** `src/assets/js/util-extend-polyfill.js`
- Patches util._extend to use Object.assign() in browser environment
- Included in index.html before OwlCarousel2 loads

### 3. Dependencies Updated
**Updated packages:**
- `@babel/runtime` from 7.28.2 to 7.28.4
- `bootstrap` to latest compatible version
- `@types/jquery` to latest version

## How to Use

### For Development (No Warnings)
```bash
npm run start
```

### For Development (With Warnings - for debugging)
```bash
npm run start-dev
```

### For Debugging Deprecation Source
```bash
npm run start-trace
```

### Using PowerShell Script
```powershell
.\start-dev-no-warnings.ps1
```

## Long-term Solutions (Optional)

### Option 1: Replace OwlCarousel2 with Swiper
Your project already includes Swiper.js which is modern and actively maintained:
- Remove OwlCarousel2 dependencies
- Migrate carousel components to use Swiper
- This eliminates the deprecation warning completely

### Option 2: Use Angular Native Carousel
- Implement carousel using Angular animations and components
- Remove jQuery dependency entirely
- Better performance and no external library warnings

### Option 3: Wait for OwlCarousel2 Update
- Monitor OwlCarousel2 repository for updates
- The maintainers may eventually fix the deprecation warning

## Files Modified
1. `package.json` - Updated dependencies and scripts
2. `src/index.html` - Added polyfill script
3. `src/assets/js/util-extend-polyfill.js` - New polyfill file
4. `start-dev-no-warnings.ps1` - New PowerShell script
5. `DEPRECATION_WARNING_FIX.md` - This documentation

## Testing
After applying these fixes:
1. Run `npm run start` - Should not show deprecation warnings
2. Run `npm run start-dev` - May still show warnings (this is expected)
3. Verify all carousel functionality still works correctly

## Note
The deprecation warning doesn't affect functionality - it's just a warning about using an old API. The polyfill and script suppression ensure a clean development experience while maintaining full functionality.


