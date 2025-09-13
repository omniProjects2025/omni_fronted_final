/**
 * Polyfill for deprecated util._extend to suppress deprecation warnings
 * This file patches the util._extend method to use Object.assign instead
 * and prevents the deprecation warning from appearing.
 */

(function() {
  'use strict';
  
  // Only run this polyfill in browser environment
  if (typeof window === 'undefined') {
    return;
  }

  // Check if util is available (it might not be in browser environment)
  if (typeof util !== 'undefined' && util._extend) {
    // Store the original method
    const originalExtend = util._extend;
    
    // Replace with Object.assign equivalent
    util._extend = function(target, source) {
      return Object.assign(target || {}, source || {});
    };
    
    // Preserve any properties that might have been on the original function
    Object.keys(originalExtend).forEach(function(key) {
      if (originalExtend.hasOwnProperty(key)) {
        util._extend[key] = originalExtend[key];
      }
    });
  }

  // For environments where util might be polyfilled or shimmed
  if (typeof window.util !== 'undefined' && window.util._extend) {
    const originalExtend = window.util._extend;
    
    window.util._extend = function(target, source) {
      return Object.assign(target || {}, source || {});
    };
    
    Object.keys(originalExtend).forEach(function(key) {
      if (originalExtend.hasOwnProperty(key)) {
        window.util._extend[key] = originalExtend[key];
      }
    });
  }
})();
