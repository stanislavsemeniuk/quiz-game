'use client';

import React, { createContext, useState, useContext } from 'react';
import { Alert, Snackbar } from '@mui/material';

type Notification = {
  type: 'error' | 'success';
  message: string;
};

type EnableNotification = (notification: Notification) => void;

const NotificationContext = createContext<{ enableNotification: EnableNotification } | null>(null);

export default function NotificationContextProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<Notification>({ type: 'success', message: '' });
  const [isVisible, setIsVisible] = useState(false);

  function enableNotification(notification: Notification) {
    setNotification(notification);
    setIsVisible(true);
  }

  return (
    <NotificationContext.Provider value={{ enableNotification }}>
      <Snackbar
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        open={isVisible}
        onClose={() => setIsVisible(false)}
        autoHideDuration={5000}>
        <Alert variant="filled" severity={notification.type}>
          {notification.message}
        </Alert>
      </Snackbar>

      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('NotificationContext should be used within a NotificationContextProvider');
  }
  return context;
}
