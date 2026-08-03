import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import { TopBar } from '@/components/TopBar';

export const metadata = {
  title: 'Load A Tote Moving Solutions',
  description: 'Order moving totes, manage owner controls, and track bills of sale.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <TopBar />
          <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
