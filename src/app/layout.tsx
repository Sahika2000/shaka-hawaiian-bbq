import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'Shaka Hawaiian BBQ | The Colony, TX',
  description: 'Authentic Hawaiian BBQ in The Colony, TX. Aloha plates, BBQ chicken, kalbi short ribs, and island favorites.',
  keywords: 'Hawaiian BBQ, The Colony TX, Aloha Plate, Kalbi, BBQ Chicken',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
