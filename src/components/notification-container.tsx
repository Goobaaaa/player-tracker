"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import Notification, { NotificationType, NotificationProps } from './notification';

interface NotificationContextType {
  showNotification: (type: NotificationType, title: string, message?: string, duration?: number) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  confirm: (message: string, onConfirm: () => void, onCancel?: () => void) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationItem extends NotificationProps {
  id: string;
}

interface ConfirmDialog {
  id: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [confirmDialogs, setConfirmDialogs] = useState<ConfirmDialog[]>([]);

  const showNotification = useCallback((
    type: NotificationType,
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: NotificationItem = {
      id,
      type,
      title,
      message,
      duration
    };

    setNotifications(prev => [...prev, newNotification]);
  }, []);

  const showSuccess = useCallback((title: string, message?: string) => {
    showNotification('success', title, message);
  }, [showNotification]);

  const showError = useCallback((title: string, message?: string) => {
    showNotification('error', title, message, 8000); // Longer duration for errors
  }, [showNotification]);

  const showWarning = useCallback((title: string, message?: string) => {
    showNotification('warning', title, message);
  }, [showNotification]);

  const showInfo = useCallback((title: string, message?: string) => {
    showNotification('info', title, message);
  }, [showNotification]);

  const confirm = useCallback((message: string, onConfirm: () => void, onCancel?: () => void) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newConfirmDialog: ConfirmDialog = {
      id,
      message,
      onConfirm,
      onCancel
    };

    setConfirmDialogs(prev => [...prev, newConfirmDialog]);
  }, []);

  const handleCloseNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const handleConfirm = useCallback((dialog: ConfirmDialog) => {
    dialog.onConfirm();
    setConfirmDialogs(prev => prev.filter(d => d.id !== dialog.id));
  }, []);

  const handleCancel = useCallback((dialog: ConfirmDialog) => {
    dialog.onCancel?.();
    setConfirmDialogs(prev => prev.filter(d => d.id !== dialog.id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        confirm
      }}
    >
      {children}

      {/* Notifications Container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={handleCloseNotification}
          />
        ))}
      </div>

      {/* Confirmation Dialogs */}
      {confirmDialogs.map((dialog) => (
        <div
          key={dialog.id}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4 border border-gray-700">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
                <h3 className="text-lg font-semibold text-white">Confirm Action</h3>
              </div>
              <p className="text-gray-300 mb-6">{dialog.message}</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleCancel(dialog)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirm(dialog)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </NotificationContext.Provider>
  );
};