import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';


export const metadata = {
  title: 'HelpDeskPro',
  description: 'Sistema de soporte técnico',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
