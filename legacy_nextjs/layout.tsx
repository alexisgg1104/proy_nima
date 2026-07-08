import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SAII - Sistema Administrativo',
  description: 'Sistema Administrativo del Instituto de Informática',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
