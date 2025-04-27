
'use client';

import * as React from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
}

/**
 * Renders children only on the client-side after the component has mounted.
 * This is useful to prevent hydration mismatches for components that might
 * render differently on the server and client (e.g., due to browser extensions,
 * window object usage, etc.).
 */
export function ClientOnly({ children }: ClientOnlyProps): React.ReactNode {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    // Render nothing on the server and during the initial client render.
    return null;
  }

  // Render children only after the component has mounted on the client.
  return children;
}
