"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationProps {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  onClose?: (id: string) => void;
}

const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose?.(id);
    }, 300); // Match the animation duration
  }, [id, onClose]);

  useEffect(() => {
    // Trigger entrance animation
    const enterTimer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    // Auto-dismiss after duration
    const dismissTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(dismissTimer);
    };
  }, [duration, handleClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-400" />;
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-green-600';
      case 'error':
        return 'border-red-600';
      case 'warning':
        return 'border-yellow-600';
      case 'info':
        return 'border-blue-600';
      default:
        return 'border-blue-600';
    }
  };

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50 max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
        }
      `}
    >
      <div className={`
        bg-gray-800 border-l-4 rounded-lg shadow-2xl backdrop-blur-sm
        ${getBorderColor()}
      `}>
        <div className="flex items-start p-4">
          <div className="flex-shrink-0 mr-3">
            {getIcon()}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm mb-1">
              {title}
            </h4>
            {message && (
              <p className="text-gray-300 text-sm leading-relaxed">
                {message}
              </p>
            )}
          </div>

          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-3 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-700 rounded-b-lg overflow-hidden">
          <div
            className={`
              h-full transition-all ease-linear
              ${type === 'success' ? 'bg-green-400' :
                type === 'error' ? 'bg-red-400' :
                type === 'warning' ? 'bg-yellow-400' :
                'bg-blue-400'}
            `}
            style={{
              width: '100%',
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Notification;