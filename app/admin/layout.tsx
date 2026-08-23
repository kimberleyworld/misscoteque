'use client';

import { useEffect } from 'react';
import { useMusicContext } from '@/app/context/MusicContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setPageType } = useMusicContext();

  useEffect(() => {
    setPageType('archive');
    return () => setPageType('default');
  }, [setPageType]);

  return children;
}
