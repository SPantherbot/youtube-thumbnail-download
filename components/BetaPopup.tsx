import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface BetaPopupProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

const BetaPopup: React.FC<BetaPopupProps> = ({ isOpen, onClose, featureName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 pt-24" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup - Neumorphic Style */}
      <div className="relative bg-[var(--bg)] rounded-3xl p-8 max-w-md w-full shadow-[20px_20px_60px_var(--shadow-dark),-20px_-20px_60px_var(--shadow-light)]">
        {/* Beta Badge */}
        <div className="flex justify-center mb-6">
          <span className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full text-sm shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)]">
            🚧 BETA TESTING
          </span>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[var(--bg)] rounded-full flex items-center justify-center shadow-[inset_8px_8px_16px_var(--shadow-dark),inset_-8px_-8px_16px_var(--shadow-light)]">
            <AlertTriangle className="w-10 h-10 text-orange-500" strokeWidth={2.5} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-[var(--text)] text-center mb-6">
          {featureName}
        </h2>

        {/* Message Box - Neumorphic */}
        <div className="bg-[var(--bg)] p-6 rounded-2xl shadow-[inset_6px_6px_12px_var(--shadow-dark),inset_-6px_-6px_12px_var(--shadow-light)] mb-6">
          <p className="text-[var(--text-muted)] text-center text-base leading-relaxed font-medium">
            This feature is currently in <span className="font-bold text-orange-500">Beta Testing Phase</span>. 
            We're working hard to make it available for you soon!
          </p>
          <p className="text-[var(--text-muted)] text-center text-sm mt-3">
            Thank you for your patience 🙏
          </p>
        </div>

        {/* Close Button - Neumorphic */}
        <button
          onClick={onClose}
          className="w-full py-4 bg-[var(--bg)] text-[var(--text)] font-bold rounded-xl shadow-[8px_8px_16px_var(--shadow-dark),-8px_-8px_16px_var(--shadow-light)] hover:shadow-[10px_10px_20px_var(--shadow-dark),-10px_-10px_20px_var(--shadow-light)] active:shadow-[inset_6px_6px_12px_var(--shadow-dark),inset_-6px_-6px_12px_var(--shadow-light)] transition-all text-lg"
        >
          Got It! ✅
        </button>
      </div>
    </div>
  );
};

export default BetaPopup;
