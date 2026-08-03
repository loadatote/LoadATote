import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import { NavBar } from '@/components/NavBar';

export const metadata = {
  title: 'Moving Tote Orders',
  description: 'Order moving totes with owner admin controls powered by Supabase and Render.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <NavBar />
          <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
