"use client"
import { useEffect, useState } from 'react';

async function checkInternetConnectivity() {
  try {
    const response = await fetch("https://www.google.com/favicon.ico?_=" + new Date().getTime(), {
      mode: 'no-cors',
      cache: 'no-store'
    });

    return response.ok || response.type === 'opaque'; // opaque responses for 'no-cors'
  } catch (error) {
    return false;
  }
}

const useNetworkStatusAndConnectivity = () => {
  const [isOnline, setIsOnline] = useState<boolean | undefined>(undefined);
  const [connectionType, setConnectionType] = useState<string | undefined>(undefined);
  const [hasInternetAccess, setHasInternetAccess] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateOnlineStatus = () => setIsOnline(navigator.onLine);

      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);

      updateOnlineStatus();

      return () => {
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
      };
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateConnectionType = () => setConnectionType(navigator.connection?.effectiveType.toUpperCase());

      if (navigator.connection) {
        navigator.connection.addEventListener('change', updateConnectionType);
      }

      updateConnectionType();

      return () => {
        if (navigator.connection) {
          navigator.connection.removeEventListener('change', updateConnectionType);
        }
      };
    }
  }, [isOnline]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const verifyInternetAccess = async () => {
        if (isOnline) {
          const internetAccess = await checkInternetConnectivity();
          setHasInternetAccess(internetAccess);
        } else {
          setHasInternetAccess(false);
        }
      };

      verifyInternetAccess();

      const intervalId = setInterval(() => {
        verifyInternetAccess();
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [isOnline]);

  return { isOnline, connectionType, hasInternetAccess };
}

export default useNetworkStatusAndConnectivity;
