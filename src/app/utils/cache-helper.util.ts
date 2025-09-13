/**
 * Utility functions for cache management
 */

/**
 * Clear all doctor-related caches
 */
export function clearAllDoctorCaches(): void {
  try {
    // Clear localStorage caches
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('doctor_') || key === 'doctors_cache') {
        localStorage.removeItem(key);
        console.log(`Cleared cache: ${key}`);
      }
    });
    console.log('All doctor caches cleared successfully');
  } catch (error) {
    console.warn('Failed to clear caches:', error);
  }
}

/**
 * Clear specific doctor cache
 */
export function clearDoctorCache(doctorName: string): void {
  try {
    const cacheKey = `doctor_${doctorName.toLowerCase().replace(/\s+/g, '_')}`;
    localStorage.removeItem(cacheKey);
    console.log(`Cleared cache for doctor: ${doctorName}`);
  } catch (error) {
    console.warn('Failed to clear doctor cache:', error);
  }
}

/**
 * Check if cache is expired
 */
export function isCacheExpired(timestamp: number, durationMinutes: number = 5): boolean {
  const now = Date.now();
  const cacheExpiry = durationMinutes * 60 * 1000;
  return (now - timestamp) >= cacheExpiry;
}






