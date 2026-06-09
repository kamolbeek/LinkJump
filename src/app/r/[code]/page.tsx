import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import RedirectClient from './RedirectClient';

interface Props {
  params: Promise<{ code: string }>;
}

export default async function RedirectPage({ params }: Props) {
  const { code } = await params;

  const link = await prisma.link.findUnique({
    where: { code },
  });

  // Agar havola topilmasa, bosh sahifaga xato xabari bilan qaytaradi
  if (!link) {
    redirect('/?error=not-found');
  }

  return (
    <RedirectClient
      platform={link.platform}
      normalizedUrl={link.normalizedUrl}
      originalUrl={link.originalUrl}
    />
  );
}
