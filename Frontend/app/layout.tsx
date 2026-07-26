import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import { UIProvider } from '@/context/UIContext';
import { AuthProvider } from '@/context/AuthContext';
import { AttendanceProvider } from '@/context/AttendanceContext';
import { AppGlobalListener } from '@/components/shared/AppGlobalListener';
import { RouteLoadingHandler } from '@/components/shared/RouteLoadingHandler';
import { AppLayoutContainer } from '@/components/shared/AppLayoutContainer';

export const metadata: Metadata = {
  title: 'EMS - Employee Management System',
  description: 'Simple and clean Employee Management System for Admin and Employees.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased">
        <QueryProvider>
          <UIProvider>
            <AuthProvider>
              <AttendanceProvider>
                <AppGlobalListener />
                <RouteLoadingHandler />
                <AppLayoutContainer>{children}</AppLayoutContainer>
              </AttendanceProvider>
            </AuthProvider>
          </UIProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
