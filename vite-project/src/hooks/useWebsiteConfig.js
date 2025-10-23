import { useEffect, useState } from "react";
import fetchWebSiteConfigFile from "../services/fetchWebSiteConfig.mjs";

let cachedConfig = null;
let inFlightPromise = null;

/**
 * Shared hook that fetches the website configuration once and reuses it.
 */
export default function useWebsiteConfig() {
  const [config, setConfig] = useState(cachedConfig);
  const [loading, setLoading] = useState(!cachedConfig);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cachedConfig) return;

    let active = true;

    if (!inFlightPromise) {
      inFlightPromise = fetchWebSiteConfigFile()
        .then((data) => {
          cachedConfig = data;
          return data;
        })
        .finally(() => {
          inFlightPromise = null;
        });
    }

    inFlightPromise
      .then((data) => {
        if (!active) return;
        setConfig(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return {
    config: config ?? cachedConfig,
    loading,
    error,
  };
}
