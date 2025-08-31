import axios from 'axios';
import { getAuthHeader } from '../utils/getAuthHeader';

import { config } from '../config/config.js';

const API_BASE_URL = config.API_BASE_URL;

// Enhanced in-memory cache for frontend with better performance
class SlotCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes TTL
    this.cache = new Map();
    this.ttl = ttl;
    this.pendingRequests = new Map(); // Track pending requests to prevent duplicates
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  // Clear cache for specific doctor
  clearDoctor(doctorId) {
    const keysToDelete = [];
    for (const key of this.cache.keys()) {
      if (key.includes(`doctor_${doctorId}`)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => this.cache.delete(key));
    
    // Also clear pending requests for this doctor
    for (const key of this.pendingRequests.keys()) {
      if (key.includes(`doctor_${doctorId}`)) {
        this.pendingRequests.delete(key);
      }
    }
  }

  // Check if request is pending
  isPending(key) {
    return this.pendingRequests.has(key);
  }

  // Set pending request
  setPending(key, promise) {
    this.pendingRequests.set(key, promise);
    promise.finally(() => {
      this.pendingRequests.delete(key);
    });
    return promise;
  }

  // Get pending request
  getPending(key) {
    return this.pendingRequests.get(key);
  }
}

const slotCache = new SlotCache();

class SlotService {
  /**
   * Get available slots for a doctor (optimized API)
   * Returns slots grouped by date
   */
  static async getAvailableSlots(doctorId) {
    const cacheKey = `doctor_${doctorId}_available_slots`;
    
    // Check cache first
    const cached = slotCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Check if request is already pending to prevent duplicate requests
    if (slotCache.isPending(cacheKey)) {
      return slotCache.getPending(cacheKey);
    }

    const requestPromise = (async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/slots/doctor/${doctorId}/available`,
          {
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeader()
            },
            timeout: 10000 // 10 second timeout
          }
        );

        const slotsGroupedByDate = response.data;
        
        // Cache the result
        slotCache.set(cacheKey, slotsGroupedByDate);
        
        return slotsGroupedByDate;
      } catch (error) {
        console.error('Error fetching available slots:', error);
        throw this.handleError(error);
      }
    })();

    // Track the pending request
    return slotCache.setPending(cacheKey, requestPromise);
  }

  /**
   * Get slots for specific date range
   */
  static async getSlotsByDateRange(doctorId, startDate, endDate, status = null) {
    const cacheKey = `doctor_${doctorId}_slots_${startDate}_${endDate}_${status || 'all'}`;
    
    // Check cache first
    const cached = slotCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const params = {
        startDate,
        endDate,
      };
      
      if (status) {
        params.status = status;
      }

      const response = await axios.get(
        `${API_BASE_URL}/slots/doctor/${doctorId}`,
        {
          params,
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
          }
        }
      );

      const slots = response.data;
      
      // Cache the result
      slotCache.set(cacheKey, slots);
      
      return slots;
    } catch (error) {
      console.error('Error fetching slots by date range:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get slot availability summary
   * Returns count of available slots per day
   */
  static async getSlotSummary(doctorId, days = 7) {
    const cacheKey = `doctor_${doctorId}_summary_${days}`;
    
    // Check cache first
    const cached = slotCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/slots/doctor/${doctorId}/summary`,
        {
          params: { days },
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
          }
        }
      );

      const summary = response.data;
      
      // Cache the result
      slotCache.set(cacheKey, summary);
      
      return summary;
    } catch (error) {
      console.error('Error fetching slot summary:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Convert grouped slots to flat array for backward compatibility
   */
  static flattenGroupedSlots(groupedSlots) {
    const flatSlots = [];
    
    Object.entries(groupedSlots).forEach(([date, slots]) => {
      slots.forEach(slot => {
        flatSlots.push({
          ...slot,
          date: date // Ensure date is set
        });
      });
    });

    // Sort by date and time
    return flatSlots.sort((a, b) => {
      const dateCompare = new Date(a.date) - new Date(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.startTime.localeCompare(b.startTime);
    });
  }

  /**
   * Get available dates with slot counts
   */
  static async getAvailableDates(doctorId, days = 14) {
    try {
      const summary = await this.getSlotSummary(doctorId, days);
      
      return Object.entries(summary)
        .map(([date, count]) => ({
          date,
          availableCount: count,
          hasSlots: count > 0
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (error) {
      console.error('Error fetching available dates:', error);
      return [];
    }
  }

  /**
   * Clear cache for specific doctor (useful when availability changes)
   */
  static clearDoctorCache(doctorId) {
    slotCache.clearDoctor(doctorId);
  }

  /**
   * Clear all cache
   */
  static clearAllCache() {
    slotCache.clear();
  }

  /**
   * Handle API errors consistently
   */
  static handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          return new Error('Unauthorized. Please login again.');
        case 403:
          return new Error('Access forbidden.');
        case 404:
          return new Error('Doctor or slots not found.');
        case 500:
          return new Error('Server error. Please try again later.');
        default:
          return new Error(data?.message || 'An error occurred while fetching slots.');
      }
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your connection.');
    } else {
      // Other error
      return new Error('An unexpected error occurred.');
    }
  }

  /**
   * Preload slots for multiple doctors (useful for doctor list pages)
   */
  static async preloadSlots(doctorIds) {
    const promises = doctorIds.map(doctorId => 
      this.getAvailableSlots(doctorId).catch(error => {
        console.warn(`Failed to preload slots for doctor ${doctorId}:`, error);
        return null;
      })
    );

    return Promise.allSettled(promises);
  }

  /**
   * Check if slots are cached for a doctor
   */
  static hasCachedSlots(doctorId) {
    const cacheKey = `doctor_${doctorId}_available_slots`;
    return slotCache.get(cacheKey) !== null;
  }
}

export default SlotService;
