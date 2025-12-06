import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

interface NotificationProps {
  message: string | null;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message && !visible) return null;

  return (
    <div 
      className={`fixed top-24 left-1/2 -translate-x-1/2 z-[200] transition-all duration-300 transform ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-3 px-6 py-3 bg-[var(--bg)] rounded-full shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)] border border-[var(--text)]/10 text-[var(--text)] font-bold text-sm">
        <Bell className="w-4 h-4 text-blue-500 fill-current" />
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Notification;