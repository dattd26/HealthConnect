import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import SlotService from '../services/slotService';

/**
 * Custom hook for managing doctor slots with caching and optimizations
 */
export const useSlots = (doctorId, options = {}) => {
  const {
    autoRefresh = false,
    refreshInterval = 5 * 60 * 1000, // 5 minutes
    enableCache = true,
    onError = null
  } = options;

  const [slotsGroupedByDate, setSlotsGroupedByDate] = useState({});
  const [flatSlots, setFlatSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  
  const refreshIntervalRef = useRef(null);
  const mountedRef = useRef(true);
  const fetchingRef = useRef(false); // Prevent concurrent fetches

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  const fetchSlots = useCallback(async (force = false) => {
    if (!doctorId || fetchingRef.current) return;

    // Check cache first if not forcing refresh
    if (!force && enableCache && SlotService.hasCachedSlots(doctorId)) {
      try {
        const groupedSlots = await SlotService.getAvailableSlots(doctorId);
        const flatSlotsData = SlotService.flattenGroupedSlots(groupedSlots);
        
        if (mountedRef.current) {
          setSlotsGroupedByDate(prev => {
            // Only update if data actually changed
            const prevKeys = Object.keys(prev).sort().join(',');
            const newKeys = Object.keys(groupedSlots).sort().join(',');
            return prevKeys === newKeys ? prev : groupedSlots;
          });
          setFlatSlots(flatSlotsData);
          setLastFetch(new Date());
        }
        return;
      } catch (err) {
        // If cache fails, continue to fetch from server
      }
    }

    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const groupedSlots = await SlotService.getAvailableSlots(doctorId);
      const flatSlotsData = SlotService.flattenGroupedSlots(groupedSlots);

      if (mountedRef.current) {
        setSlotsGroupedByDate(prev => {
          // Only update if data actually changed
          const prevKeys = Object.keys(prev).sort().join(',');
          const newKeys = Object.keys(groupedSlots).sort().join(',');
          return prevKeys === newKeys ? prev : groupedSlots;
        });
        setFlatSlots(flatSlotsData);
        setLastFetch(new Date());
        setError(null);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message);
        if (onError) {
          onError(err);
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        fetchingRef.current = false;
      }
    }
  }, [doctorId, enableCache, onError]);

  // Initial fetch
  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // Auto refresh setup
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      refreshIntervalRef.current = setInterval(() => {
        fetchSlots(true); // Force refresh
      }, refreshInterval);

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, fetchSlots]);

  const refreshSlots = useCallback(() => {
    fetchSlots(true);
  }, [fetchSlots]);

  const clearCache = useCallback(() => {
    if (doctorId) {
      SlotService.clearDoctorCache(doctorId);
    }
  }, [doctorId]);

  return {
    slotsGroupedByDate,
    flatSlots,
    loading,
    error,
    lastFetch,
    refreshSlots,
    clearCache,
    hasCachedData: enableCache && SlotService.hasCachedSlots(doctorId)
  };
};

/**
 * Hook for getting slot summary
 */
export const useSlotSummary = (doctorId, days = 7) => {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    if (!doctorId) return;

    setLoading(true);
    setError(null);

    try {
      const summaryData = await SlotService.getSlotSummary(doctorId, days);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [doctorId, days]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    loading,
    error,
    refreshSummary: fetchSummary
  };
};

/**
 * Hook for getting available dates
 */
export const useAvailableDates = (doctorId, days = 14) => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDates = async () => {
      if (!doctorId) return;

      setLoading(true);
      setError(null);

      try {
        const availableDates = await SlotService.getAvailableDates(doctorId, days);
        setDates(availableDates);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDates();
  }, [doctorId, days]);

  return {
    dates,
    loading,
    error
  };
};
