import React, { createContext, useState, useCallback } from "react";

// Create the context object
export const ErrorContext = createContext({
  error: null,
  setError: () => {},
  clearError: () => {},
});

// Provider wraps your entire app
export function ErrorProvider({ children }) {
  const [error, setError] = useState(null);

  // called by the toast auto-close or manually
  const clearError = useCallback(() => setError(null), []);

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
}
