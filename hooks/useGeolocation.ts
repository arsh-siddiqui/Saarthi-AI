"use client";

import { useCallback, useState } from "react";

interface GeolocationState {
  coords: [number, number] | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    loading: false,
    error: null,
  });

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setState((s) => ({ ...s, error: "Geolocation isn't supported on this device." }));
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coords: [position.coords.latitude, position.coords.longitude],
          loading: false,
          error: null,
        });
      },
      (error) => {
        setState({
          coords: null,
          loading: false,
          error: error.message || "Couldn't fetch your location.",
        });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  return { ...state, locate };
}
