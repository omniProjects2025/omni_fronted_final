// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // SECURITY: Use proxy in development to avoid CORS issues
  apiBaseUrl: '/api',
  omniApiUrl: '/api', 
  specialtiesApiUrl: '/api',
  blogApiUrl: 'https://omniservicebackend.onrender.com',
  // Direct URLs for fallback (if proxy fails)
  directApiUrl: 'http://localhost:3000',
  baseUrl: '/api', // Consistent naming
  // LeadSquared configuration (matching existing working pages)
  leadsquared: {
    baseUrl: 'https://api-in21.leadsquared.com/v2/',
    accessKey: 'u$r56afea08b32d556818ad1a5f69f0e7f0',
    secretKey: '8d7f86d677dadaba209b4dead3cfcc4ab019031b'
  }
};
