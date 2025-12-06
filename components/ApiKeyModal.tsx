import React, { useState, useEffect } from 'react';
import { Key, Save, X, ExternalLink, Trash2 } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, apiKey, setApiKey }) => {
  const [inputKey, setInputKey] = useState('');

  useEffect(() => {
    setInputKey(apiKey);
  }, [apiKey, isOpen]);

  const handleSave = () => {
    if (inputKey.trim()) {
      setApiKey(inputKey.trim());
      onClose();
    }
  };

  const handleClear = () => {
    setApiKey('');
    setInputKey('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[var(--bg)]/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-[var(--bg)] rounded-[2rem] shadow-[20px_20px_60px_var(--shadow-dark),-20px_-20px_60px_var(--shadow-light)] w-full max-w-md p-8 animate-fade-in border border-[var(--text)]/5">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-[var(--bg)] rounded-xl shadow-[5px_5px_10px_var(--shadow-dark),-5px_-5px_10px_var(--shadow-light)] text-blue-500">
                <Key className="w-6 h-6" />
             </div>
             <h2 className="text-xl font-black text-[var(--text)]">API Settings</h2>
          </div>
          <button 
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-[var(--bg)] shadow-[5px_5px_10px_var(--shadow-dark),-5px_-5px_10px_var(--shadow-light)] active:shadow-[inset_3px_3px_6px_var(--shadow-dark),inset_-3px_-3px_6px_var(--shadow-light)] flex items-center justify-center text-[var(--text-muted)] transition-all hover:text-red-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="text-sm text-[var(--text-muted)] font-medium leading-relaxed">
            ThumbGrabber AI uses your own Google Gemini API key. This ensures unlimited access, zero queues, and complete privacy.
          </div>

          <div>
             <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest ml-2 mb-2 block">Gemini API Key</label>
             <input 
                type="password" 
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Paste your AIza... key here"
                className="w-full px-5 py-4 rounded-xl bg-[var(--bg)] shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light)] focus:shadow-[inset_8px_8px_16px_var(--shadow-dark),inset_-8px_-8px_16px_var(--shadow-light)] outline-none text-[var(--text)] font-medium transition-all"
             />
          </div>

          <div className="flex flex-col gap-3">
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-blue-500 hover:text-blue-600 ml-2 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Get a free API Key from Google AI Studio
            </a>
          </div>

          <div className="flex gap-4 pt-4">
             {apiKey && (
                 <button 
                    onClick={handleClear}
                    className="px-4 py-3 bg-[var(--bg)] text-red-500 rounded-xl font-bold shadow-[5px_5px_10px_var(--shadow-dark),-5px_-5px_10px_var(--shadow-light)] hover:text-red-600 active:shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] transition-all"
                 >
                    <Trash2 className="w-5 h-5" />
                 </button>
             )}
             <button 
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[var(--bg)] text-green-600 rounded-xl font-bold shadow-[5px_5px_10px_var(--shadow-dark),-5px_-5px_10px_var(--shadow-light)] hover:text-green-700 active:shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] transition-all"
             >
                <Save className="w-5 h-5" />
                {apiKey ? 'Update Key' : 'Save Key'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;