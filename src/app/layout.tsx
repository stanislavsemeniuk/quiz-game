import Header from '@/components/Header';
import AuthContextProvider from '@/context/AuthContext';
import NotificationContextProvider from '@/context/NotificationContext';

export const metadata = {
  title: 'Quiz Game',
  description:
    'Challenge your knowledge in various categories and have fun while answering exciting questions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <body
        style={{
          height: '100%',
          margin: '0',
          backgroundColor: '#f7f9fe',
          backgroundImage: `linear-gradient(135deg, #e8ddff 0%, #f7f9fe00 527px),
            linear-gradient(45deg, #e8ddff 10%, #f7f9fe00 27%),
            linear-gradient(215deg, #fffbeb 0%, #f7f9fe00 40%)`,
        }}>
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
