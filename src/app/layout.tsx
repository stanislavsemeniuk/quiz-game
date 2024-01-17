import Header from '@/components/Header';
import AuthContextProvider from '@/context/AuthContext';
import NotificationContextProvider from '@/context/NotificationContext';
import './globals.css';

export const metadata = {
  title: 'Quiz Game',
  description:
    'Challenge your knowledge in various categories and have fun while answering exciting questions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          <NotificationContextProvider>
            <Header />
            {children}
          </NotificationContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
