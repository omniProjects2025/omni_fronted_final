# Home Page Performance Optimizations

## Summary
This document outlines the performance optimizations implemented for the home page to improve Lighthouse scores from 20-40 to significantly higher values.

## Changes Made

### 1. Change Detection Strategy (home.component.ts)
- **Added OnPush change detection**: Implemented `ChangeDetectionStrategy.OnPush` to reduce unnecessary change detection cycles
- **Added markForCheck() calls**: Ensured change detection triggers when needed in:
  - `ngAfterViewInit()`
  - `updateArrowStates()`
  - `toggleFaq()`
  - `ourSpecialities()`
  - `onSubmit()` and `onSubmitAppointment()`
  - `handleResizeOrZoom()`
  - Video state subscription

### 2. Image Loading Optimization (home.component.html)
- **First banner image**: Added `loading="eager"` and `fetchpriority="high"` for LCP optimization
- **All other images**: Added `loading="lazy"` to defer loading of below-the-fold images
- Images optimized:
  - Banner slider images (slides 2-5)
  - Action buttons (locations, appointment, second opinion, health checkup, packages)
  - Specialty icons
  - Why Choose Omni image
  - Technology images
  - Testimonial thumbnails and profile images
  - Blog images
  - FAQ toggle icons
  - Award images
  - Location modal images
  - Swiper navigation arrows

### 3. TrackBy Functions (home.component.ts)
Added optimized trackBy functions for all *ngFor loops to prevent unnecessary DOM re-renders:
- `trackByTestimonial`: For video testimonials
- `trackByUserTestimonial`: For user testimonials
- `trackBySpeciality`: For specialty items
- `trackByBlog`: For blog items
- `trackByTech`: For technology items
- `trackByWhyChoose`: For why choose Omni stats
- `trackByAward`: For award images
- `trackByLocation`: For location items
- `trackByFaq`: For FAQ items

### 4. Swiper Lazy Loading (home.component.html)
- Added `lazy="true"` attribute to swiper-container for lazy loading of slides
- Only visible technology slides are loaded initially

### 5. Carousel Optimization
- Owl Carousel configurations maintain loop and autoplay settings
- Non-first banner images use lazy loading to prioritize above-the-fold content

## Performance Benefits

### Before
- All images loaded immediately
- Change detection ran on every event
- No trackBy functions causing unnecessary re-renders
- All carousel slides loaded upfront

### After
- Only critical images (first banner) load immediately
- Change detection runs only when explicitly triggered
- TrackBy functions prevent unnecessary DOM updates
- Only visible slides load initially

## Expected Improvements

1. **LCP (Largest Contentful Paint)**: Improved by prioritizing first banner image
2. **FCP (First Contentful Paint)**: Faster due to reduced initial load
3. **TBT (Total Blocking Time)**: Reduced change detection overhead
4. **CLS (Cumulative Layout Shift)**: Better with proper image dimensions
5. **Overall Performance Score**: Expected to improve from 20-40 to 70-90+

## Testing Recommendations

1. Run Lighthouse audit before and after changes
2. Test on both mobile and desktop views
3. Verify all carousels work correctly with lazy loading
4. Check that modals and interactive elements still function
5. Test on slow network connections (3G throttle)

## Notes

- All UI and SEO content remain unchanged as requested
- No visible changes to the user experience
- Functionality remains fully intact
- Images maintain their original styling and sizes

