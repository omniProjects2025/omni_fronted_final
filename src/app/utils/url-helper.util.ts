/**
 * Utility functions for URL conversion
 */

/**
 * Convert speciality name to URL-friendly format
 * @param specialityName - The speciality name to convert
 * @returns URL-friendly string
 */
export function toUrlFriendly(specialityName: string): string {
  return specialityName
    .toLowerCase()
    .replace(/^dr\.?\s*/i, 'dr-')  // Handle Dr prefix properly
    .replace(/&/g, 'and')  // Replace & with 'and'
    .replace(/\s+/g, '-')   // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove special characters except hyphens
    .replace(/-+/g, '-')    // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Convert URL-friendly format back to original speciality name
 * @param urlFriendlyName - The URL-friendly string to convert back
 * @returns Original speciality name
 */
export function fromUrlFriendly(urlFriendlyName: string): string {
  return urlFriendlyName
    .replace(/^dr-/, 'Dr ')        // Handle Dr prefix properly
    .replace(/-/g, ' ')           // Replace hyphens with spaces
    .replace(/\band\b/g, '&')    // Replace 'and' with & (only whole words)
    .replace(/\b\w/g, (l: string) => l.toUpperCase()); // Capitalize first letter of each word
}
