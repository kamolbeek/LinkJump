import { redirect } from 'next/navigation';
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

  // Muddat tekshirish — agar vaqt o'tgan bo'lsa, yo'naltirmaydi
  if (link.expiresAt && new Date() > link.expiresAt) {
    redirect('/?error=expired');
  }

  // Bosish cheklovi tekshirish — agar limit tugagan bo'lsa, yo'naltirmaydi
  if (link.maxClicks !== null && link.clickCount >= link.maxClicks) {
    redirect('/?error=limit-reached');
  }

  // Bosish sonini oshirish (increment)
  await prisma.link.update({
    where: { code },
    data: { clickCount: { increment: 1 } },
  });

  return (
    <RedirectClient
      platform={link.platform}
      normalizedUrl={link.normalizedUrl}
      originalUrl={link.originalUrl}
    />
  );
}
