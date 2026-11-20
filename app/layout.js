import './globals.css';

export const metadata = {
  title: 'EquipRent — Premium Equipment Rental Marketplace',
  description: 'Rent professional construction, photography, agriculture, and event equipment securely with verified owners and fast Stripe checkout.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
