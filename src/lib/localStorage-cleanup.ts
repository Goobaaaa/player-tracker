"use client";

export const clearAllAppData = () => {
  if (typeof window !== 'undefined') {
    const keysToRemove = [
      'usms-app-name',
      'usms-app-logo',
      'usms-theme',
      'usms-session-timeout',
      'usms-session'
    ];

    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn(`Failed to remove ${key} from localStorage:`, error);
      }
    });

    console.log('Cleared all USMS application data from localStorage');
  }
};

export const validateAndCleanLocalStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      // Test if localStorage is working
      const testKey = '__usms_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);

      // Clear potentially corrupted data
      clearAllAppData();

      return true;
    } catch (error) {
      console.error('localStorage is not working or corrupted:', error);
      return false;
    }
  }
  return false;
};