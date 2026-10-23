import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to poll an async API function at specified interval (default 10s).
 * Automatically pauses when window/document is inactive/hidden to conserve bandwidth.
 */
export function useAutoPolling(fetcherFn, intervalMs = 10000, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const isMounted = useRef(true);

  const execute = async () => {
    try {
      const result = await fetcherFn();
      if (isMounted.current) {
        if (result && result.success !== false) {
          setData(result);
          setError(null);
          setLastUpdated(new Date());
        } else {
          setError(result?.message || 'Failed to load data');
        }
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err.message || 'Network error');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    execute();

    let intervalId = null;

    const startTimer = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (!document.hidden) {
          execute();
        }
      }, intervalMs);
    };

    startTimer();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Trigger immediate fetch when tab comes back to view
        execute();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted.current = false;
      if (intervalId) clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [intervalMs, ...dependencies]);

  return { data, loading, error, lastUpdated, refetch: execute };
}
