'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/wydarzenia');
  }, [router]);

  return null; // No need to render anything as we're redirecting
}
