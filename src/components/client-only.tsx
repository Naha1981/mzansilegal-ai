// src/components/client-only.tsx
'use client';

import type React from 'react';
import { useState, useEffect } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
}

/**
 * Utility component that delays rendering its children until the component has mounted on the client.
 * This prevents hydration mismatches, especially when dealing with components that rely on browser APIs
 * or might be affected by browser extensions modifying the DOM before hydration.
 */
export function ClientOnly({ children }: ClientOnlyProps): React.JSX.Element | null {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    // Render nothing on the server or during the initial client render before mounting.
    // You could optionally return a placeholder/spinner here.
    return null;
  }

  // Render children only after the component has mounted on the client.
  return <>{children}</>;
}
