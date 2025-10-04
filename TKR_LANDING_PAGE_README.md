# Total Knee Replacement Landing Page Component

## Overview
A responsive Angular landing page component for Total Knee Replacement (TKR) surgery at Omni Hospitals, Kukatpally, Hyderabad.

## Features
- ✅ Responsive design with Bootstrap 5.3
- ✅ Fixed navigation bar with 3 buttons (Home, Key Surgeries, TKR Landing)
- ✅ Fixed phone button with tel: functionality
- ✅ LeadSquared API integration for form submissions
- ✅ AOS (Animate on Scroll) animations
- ✅ SEO-optimized with meta tags and Open Graph
- ✅ Omni Hospitals brand colors (#0E5EB1 blue, #00A859 green)
- ✅ Mobile-responsive design
- ✅ Form validation and error handling

## URL
`/total-knee-replacement-surgery-kukatpally-hyderabad`

## Setup Instructions

### 1. Dependencies
The component uses the following dependencies (already installed):
- Angular 16.2.0
- Bootstrap 5.3.7
- AOS (Animate on Scroll) - installed via npm
- Font Awesome 5.15.4 (already in index.html)

### 2. Configuration Required

#### Phone Number
Update the phone number in `total-knee-replacement.component.ts`:
```typescript
// Line 189: Replace with actual Omni Hospitals phone number
const phoneNumber = '+91-XXXXXXXXXX';
```

#### LeadSquared API Configuration
The LeadSquared API configuration is already set up in `environment.ts`:
```typescript
leadsquared: {
  baseUrl: 'https://api-in21.leadsquared.com/v2/',
  accessKey: 'u$r56afea08b32d556818ad1a5f69f0e7f0',
  secretKey: '8d7f86d677dadaba209b4dead3cfcc4ab019031b'
}
```

**Note**: Update the API endpoint in the component if needed (line 120 in component).

#### Banner Image
Replace the placeholder banner image:
- File: `src/assets/images/tkr-banner-placeholder.jpg`
- Recommended dimensions: 1920x600px
- Should show: Modern hospital environment, orthopaedic surgery, or knee replacement imagery

### 3. SEO Meta Tags
The component automatically sets:
- Page Title: "Best Total Knee Replacement Surgery in Kukatpally, Hyderabad | Omni Hospitals"
- Meta Description: "Get Total Knee Replacement (TKR) in Kukatpally, Hyderabad, for an all-inclusive cost of ₹1.5 Lacs (Stryker implants included). Consult our expert orthopaedic team for minimal-invasive TKR and fast recovery."
- Open Graph tags for social sharing
- Canonical URL
- Keywords and robots meta tags

### 4. Form Fields
The consultation form includes:
- Name (required, min 2 characters)
- Phone (required, 10-digit Indian format)
- Email (required, valid email format)
- Preferred Date (required)
- Message (optional, max 500 characters)

### 5. Brand Colors
- Primary Blue: #0E5EB1
- Secondary Green: #00A859
- Light Gray: #f8f9fa
- Used consistently throughout the component

### 6. Responsive Breakpoints
- Desktop: Full layout with all features
- Tablet: Adjusted spacing and grid layouts
- Mobile: Collapsed navigation, stacked layouts, hidden text labels

### 7. Animation Features
- AOS animations on scroll
- Fade-in effects for sections
- Slide-up animations for content
- Hover effects on buttons and cards
- Smooth scrolling to form

### 8. Accessibility Features
- Semantic HTML structure
- Proper heading hierarchy (H1, H2, H3, H4)
- Alt text for images
- Form labels and validation messages
- Keyboard navigation support

## File Structure
```
src/app/total-knee-replacement/
├── total-knee-replacement.component.ts
├── total-knee-replacement.component.html
└── total-knee-replacement.component.scss
```

## Testing
1. Start the development server: `ng serve`
2. Navigate to: `http://localhost:4200/total-knee-replacement-surgery-kukatpally-hyderabad`
3. Test responsive design on different screen sizes
4. Test form submission (requires LeadSquared API setup)
5. Test phone call functionality
6. Test navigation buttons

## Production Deployment
1. Update phone number and API endpoints
2. Replace banner image with actual image
3. Test LeadSquared API integration
4. Build for production: `ng build --configuration production`

## Support
For any issues or modifications, refer to the component code comments and this documentation.
