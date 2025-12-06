import React, { useState, useEffect } from 'react';
import { Search, X, Youtube, CheckCircle2, AlertCircle } from 'lucide-react';
import { extractVideoId } from '../services/youtube';

interface InputSectionProps {
  onSearch: (url: string) => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onSearch, isLoading }) => {
  const [inputUrl, setInputUrl] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!inputUrl) {
      setIsValid(false);
      return;
    }
    const videoId = extractVideoId(inputUrl);
    setIsValid(!!videoId);
  }, [inputUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim() && isValid) {
      onSearch(inputUrl);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleClear = () => {
    setInputUrl('');
    setIsValid(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-10 relative z-10 px-0 md:px-4">
      <div className="text-center mb-8 md:mb-12 animate-fade-in">
        <div className="inline-flex items-center justify-center px-4 md:px-6 py-2 bg-[var(--bg)] text-red-600 rounded-full mb-6 shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)] transition-transform hover:-translate-y-0.5 duration-300">
             <Youtube className="w-4 h-4 md:w-5 md:h-5 mr-2" />
             <span className="text-xs md:text-sm font-bold tracking-wide text-[var(--text-muted)]">Supports Videos & Shorts</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-[var(--text)] mb-6 tracking-tight leading-tight">
          Download Thumbnail of YouTube Video <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Free HD, 4K & AI Enhanced</span>
        </h1>
        <p className="text-base md:text-lg text-[var(--text-muted)] font-medium max-w-2xl mx-auto">
          Learn how to download YouTube video thumbnail instantly. YouTube Short thumbnail download, free templates & PSD files included.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={`relative group ${shake ? 'animate-shake' : ''}`}>
        <div className="relative flex items-center">
          <div className={`absolute left-4 md:left-6 pointer-events-none transition-colors duration-300 ${isValid ? 'text-green-500' : 'text-[var(--text-muted)]'}`}>
              {isValid ? <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> : <Search className="w-5 h-5 md:w-6 md:h-6" />}
          </div>
          
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Paste YouTube link here..."
            className={`w-full h-16 md:h-20 pl-12 md:pl-16 pr-32 md:pr-40 rounded-2xl bg-[var(--bg)] text-[var(--text)] text-base md:text-lg font-medium placeholder:text-[var(--text-muted)]/50 outline-none transition-all duration-300 shadow-[inset_6px_6px_12px_var(--shadow-dark),inset_-6px_-6px_12px_var(--shadow-light)] focus:shadow-[inset_8px_8px_16px_var(--shadow-dark),inset_-8px_-8px_16px_var(--shadow-light)] ${!isValid && inputUrl ? 'text-red-500' : ''}`}
            disabled={isLoading}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
          
          {inputUrl && (
             <button
              type="button"
              onClick={handleClear}
              className="absolute right-32 md:right-36 p-3 text-[var(--text-muted)] hover:text-red-500 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Clear input"
             >
               <X className="w-4 h-4 md:w-5 md:h-5" />
             </button>
          )}
          
          <div className="absolute right-2 md:right-3 h-12 md:h-14 top-2 md:top-3">
            <button
                type="submit"
                disabled={isLoading || !inputUrl}
                className={`h-full px-5 md:px-8 bg-[var(--bg)] font-bold text-sm md:text-lg rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-[5px_5px_10px_var(--shadow-dark),-5px_-5px_10px_var(--shadow-light)] hover:shadow-[7px_7px_14px_var(--shadow-dark),-7px_-7px_14px_var(--shadow-light)] active:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light)] ${
                    isValid ? 'text-green-600 hover:text-green-700' : 'text-[var(--text-muted)] hover:text-red-600'
                }`}
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-3 border-current border-t-transparent rounded-full animate-spin"/>
                    </span>
                ) : 'Get'}
            </button>
          </div>
        </div>
        {inputUrl && !isValid && (
            <div className="absolute top-full left-0 mt-2 px-4 flex items-center gap-2 text-red-500 text-sm font-medium animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                <span>Please enter a valid YouTube URL</span>
            </div>
        )}
      </form>
      <style>{`
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        .animate-shake {
            animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default InputSection;