import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';

export const metadata = {
  title: 'EquipRent — Premium Equipment Rental Marketplace',
  description: 'Rent professional construction, photography, agriculture, and event equipment securely with verified owners and fast Stripe checkout.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
