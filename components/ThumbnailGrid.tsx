import React, { useState, useRef, useEffect } from 'react';
import { Download, Wand2, X, Check, Loader2, Eraser, Undo2, Sparkles, Eye, Key } from 'lucide-react';
import { Thumbnail } from '../types';
import { downloadImage, cropImage } from '../services/youtube';
import { cleanThumbnail, cleanCustomArea, upscaleThumbnail } from '../services/gemini';
import BetaPopup from './BetaPopup';

interface ThumbnailGridProps {
  thumbnails: Thumbnail[];
  apiKey: string;
  openKeyModal?: () => void;
  notify?: (msg: string) => void;
}

type AspectRatio = {
    label: string;
    value: number;
    desc: string;
};

const RATIOS: AspectRatio[] = [
    { label: '16:9', value: 16/9, desc: 'Original' },
    { label: '4:3', value: 4/3, desc: 'Classic' },
    { label: '1:1', value: 1, desc: 'Square' },
    { label: '9:16', value: 9/16, desc: 'Story' },
];

const ThumbnailGrid: React.FC<ThumbnailGridProps> = ({ thumbnails, apiKey, openKeyModal, notify }) => {
  const [processingUrl, setProcessingUrl] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'clean' | 'upscale' | null>(null); 
  const [cleanedImage, setCleanedImage] = useState<string | null>(null);
  const [originalForComparison, setOriginalForComparison] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRatio, setSelectedRatio] = useState<number>(16/9);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [missingKeyError, setMissingKeyError] = useState(false);
  
  // Beta Popup State
  const [showBetaPopup, setShowBetaPopup] = useState(false);
  const [betaFeatureName, setBetaFeatureName] = useState('');
  
  // Eraser / Canvas State
  const [isEraserMode, setIsEraserMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null); // Ref for custom cursor

  const handleDownload = async (url: string, quality: string) => {
    if (selectedRatio === 16/9) {
        downloadImage(url, `thumbnail_${quality}.jpg`);
    } else {
        setDownloading(url);
        try {
            const blobUrl = await cropImage(url, selectedRatio);
            downloadImage(blobUrl, `thumbnail_${quality}_cropped.jpg`);
        } catch (e) {
            console.error("Crop failed, downloading original", e);
            downloadImage(url, `thumbnail_${quality}.jpg`);
        } finally {
            setDownloading(null);
        }
    }
  };

  const handleAIAction = async (thumbnail: Thumbnail, type: 'clean' | 'upscale') => {
    // Show Beta Popup instead of executing
    setBetaFeatureName(type === 'clean' ? '✨ AI Clean' : '🚀 AI Upscale');
    setShowBetaPopup(true);
  };

  const closeModal = () => {
    if (!processingUrl) {
        setModalOpen(false);
        setCleanedImage(null);
        setOriginalForComparison(null);
        setError(null);
        setIsEraserMode(false);
        setActionType(null);
        setMissingKeyError(false);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    const currentSrc = img.src;
    
    // Fallback logic for when maxresdefault doesn't exist
    if (currentSrc.includes('maxresdefault.jpg')) {
        img.src = currentSrc.replace('maxresdefault.jpg', 'sddefault.jpg');
    } else if (currentSrc.includes('sddefault.jpg')) {
        img.src = currentSrc.replace('sddefault.jpg', 'hqdefault.jpg');
    } else {
        // If all fail, we could show a placeholder, but hqdefault usually exists
        img.style.opacity = '0.5';
    }
  };

  // --- Eraser Logic ---

  const initCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !cleanedImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = cleanedImage;
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
    };
  };

  useEffect(() => {
    if (isEraserMode && cleanedImage) {
        setTimeout(initCanvas, 100);
    }
  }, [isEraserMode, cleanedImage]);

  const updateCursorPosition = (e: React.MouseEvent | React.TouchEvent) => {
    if (!cursorRef.current || !canvasRef.current) return;

    let clientX, clientY;
    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Use transform for performant updates
    cursorRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    cursorRef.current.style.opacity = '1';
  };

  const hideCursor = () => {
    if (cursorRef.current) {
        cursorRef.current.style.opacity = '0';
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    if(ctx) ctx.beginPath(); 
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    // Update cursor visual regardless of drawing state
    updateCursorPosition(e);

    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineWidth = 40; 
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#FF0000';
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const applyEraser = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const imageWithMask = canvas.toDataURL('image/png');
      
      setProcessingUrl('processing_eraser');
      try {
          const newImage = await cleanCustomArea(imageWithMask, apiKey);
          setCleanedImage(newImage);
          setIsEraserMode(false);
      } catch (err: any) {
          setError("Failed to process the erased area. Please try again.");
      } finally {
          setProcessingUrl(null);
      }
  };

  return (
    <>
      <div className="flex flex-col items-center mb-10 animate-fade-in px-4">
        <label className="text-[10px] md:text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">Select Aspect Ratio</label>
        <div className="flex flex-wrap justify-center p-2 bg-[var(--bg)] rounded-2xl shadow-[inset_6px_6px_12px_var(--shadow-dark),inset_-6px_-6px_12px_var(--shadow-light)]">
            {RATIOS.map((ratio) => (
                <button
                    key={ratio.label}
                    onClick={() => setSelectedRatio(ratio.value)}
                    className={`relative px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                        selectedRatio === ratio.value 
                        ? 'text-red-500 shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)]' 
                        : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                    }`}
                >
                     {ratio.label}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-6xl mx-auto px-4">
        {thumbnails.map((thumb) => (
          <div key={thumb.quality} className="group bg-[var(--bg)] rounded-[2rem] shadow-[10px_10px_20px_var(--shadow-dark),-10px_-10px_20px_var(--shadow-light)] p-4 transition-transform hover:-translate-y-1 duration-300 flex flex-col h-full">
            {/* Image Preview Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] bg-[var(--bg)] p-2 mb-4">
               <div 
                 className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700"
                 style={{ 
                    clipPath: selectedRatio === 16/9 ? 'none' : 'inset(0)' 
                 }}
               >
                 <img
                    src={thumb.url}
                    alt={`YouTube Thumbnail - ${thumb.label} Quality`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={handleImageError}
                    style={{
                        objectFit: selectedRatio === 16/9 ? 'cover' : 'contain',
                    }}
                />
               </div>
              
              <div className="absolute top-4 left-4 bg-[var(--bg)]/90 backdrop-blur text-[var(--text)] text-[10px] font-bold px-3 py-1.5 rounded-full shadow-[3px_3px_6px_rgba(0,0,0,0.1)]">
                {thumb.width} × {thumb.height}
              </div>
            </div>

            <div className="px-2 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-lg text-[var(--text)]">{thumb.label}</h3>
                    <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">JPG • {thumb.quality}</p>
                </div>
                {thumb.quality === 'maxres' && (
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">HD</span>
                        <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.6)]"></div>
                     </div>
                )}
              </div>
              
              {/* Buttons Grid */}
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <button
                  onClick={() => handleDownload(thumb.url, thumb.quality)}
                  disabled={!!downloading}
                  className="col-span-2 flex items-center justify-center gap-2 px-4 py-3.5 bg-[var(--bg)] text-[var(--text)] rounded-xl font-bold text-sm shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)] hover:shadow-[8px_8px_16px_var(--shadow-dark),-8px_-8px_16px_var(--shadow-light)] active:shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] transition-all disabled:opacity-60"
                >
                  {downloading === thumb.url ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Download Image
                </button>
                <button
                  onClick={() => handleAIAction(thumb, 'clean')}
                  className="relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 py-3 bg-[var(--bg)] text-blue-600 rounded-xl font-bold text-xs sm:text-sm shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)] hover:shadow-[8px_8px_16px_var(--shadow-dark),-8px_-8px_16px_var(--shadow-light)] active:shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] transition-all"
                >
                  <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[9px] font-bold rounded-full shadow-lg">BETA</span>
                  <Wand2 className="w-4 h-4" />
                  AI Clean
                </button>
                <button
                  onClick={() => handleAIAction(thumb, 'upscale')}
                  className="relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 py-3 bg-[var(--bg)] text-purple-600 rounded-xl font-bold text-xs sm:text-sm shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)] hover:shadow-[8px_8px_16px_var(--shadow-dark),-8px_-8px_16px_var(--shadow-light)] active:shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] transition-all"
                >
                  <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[9px] font-bold rounded-full shadow-lg">BETA</span>
                  <Sparkles className="w-4 h-4" />
                  AI Upscale
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 pt-12 md:pt-24">
            <div className="absolute inset-0 bg-[var(--bg)]/80 backdrop-blur-md transition-opacity" onClick={closeModal}></div>
            <div className="relative bg-[var(--bg)] rounded-2xl md:rounded-[2rem] shadow-[20px_20px_40px_var(--shadow-dark),-20px_-20px_40px_var(--shadow-light)] w-full max-w-4xl overflow-hidden flex flex-col max-h-[85vh] animate-fade-in border border-[var(--text)]/5">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between p-5 md:p-6 border-b border-[var(--text-muted)]/10 shrink-0 bg-[var(--bg)] z-10">
                    <div className="min-w-0 mr-4">
                        <h3 className="text-lg md:text-xl font-black text-[var(--text)] flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
                             {missingKeyError ? (
                                <><Key className="w-5 h-5 md:w-6 md:h-6 text-red-500 shrink-0" /> API Key Required</>
                             ) : actionType === 'upscale' ? (
                                <><Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-500 shrink-0" /> AI Upscale</>
                             ) : isEraserMode ? (
                                <><Eraser className="w-5 h-5 md:w-6 md:h-6 text-pink-500 shrink-0" /> Magic Eraser</>
                             ) : (
                                <><Wand2 className="w-5 h-5 md:w-6 md:h-6 text-blue-500 shrink-0" /> AI Clean</>
                             )}
                        </h3>
                    </div>
                    {!processingUrl && (
                        <button onClick={closeModal} aria-label="Close" className="shrink-0 min-w-[44px] min-h-[44px] w-11 h-11 md:w-12 md:h-12 rounded-full bg-[var(--bg)] shadow-[5px_5px_10px_var(--shadow-dark),-5px_-5px_10px_var(--shadow-light)] active:shadow-[inset_3px_3px_6px_var(--shadow-dark),inset_-3px_-3px_6px_var(--shadow-light)] flex items-center justify-center text-[var(--text-muted)] transition-all hover:text-red-500">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Modal Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col items-center justify-center min-h-0 w-full relative">
                    
                    {/* LOADING STATE */}
                    {processingUrl && !error && !missingKeyError && (
                        <div className="text-center my-auto py-8">
                            <div className="inline-flex justify-center items-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-[var(--bg)] shadow-[inset_8px_8px_16px_var(--shadow-dark),inset_-8px_-8px_16px_var(--shadow-light)] mb-6 md:mb-8">
                                {processingUrl === 'processing_eraser' ? (
                                    <Eraser className="w-8 h-8 md:w-10 md:h-10 text-pink-500 animate-pulse" />
                                ) : actionType === 'upscale' ? (
                                    <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-purple-500 animate-pulse" />
                                ) : (
                                    <Wand2 className="w-8 h-8 md:w-10 md:h-10 text-blue-500 animate-pulse" />
                                )}
                            </div>
                            <h4 className="text-lg md:text-xl font-bold text-[var(--text)] mb-2">
                                {processingUrl === 'processing_eraser' ? 'Removing Selected Area...' : 
                                 actionType === 'upscale' ? 'Enhancing Clarity & Sharpness...' : 
                                 'Removing Text & Clutter...'}
                            </h4>
                            <p className="text-[var(--text-muted)] text-sm max-w-xs mx-auto leading-relaxed">
                                {processingUrl === 'processing_eraser' ? 'Reconstructing background texture seamlessly.' :
                                 actionType === 'upscale' ? 'Removing noise, blur, and improving details.' :
                                 'Reconstructing background behind subtitles and logos.'}
                            </p>
                        </div>
                    )}

                    {/* ERROR STATE */}
                    {error && !missingKeyError && (
                        <div className="text-center w-full max-w-md my-auto py-8">
                             <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-[var(--bg)] shadow-[inset_6px_6px_12px_var(--shadow-dark),inset_-6px_-6px_12px_var(--shadow-light)] mb-6 text-red-500">
                                <X className="w-8 h-8" />
                            </div>
                            <h4 className="text-lg font-bold text-[var(--text)] mb-2">Something went wrong</h4>
                            <p className="text-[var(--text-muted)] mb-8 px-4">{error}</p>
                            <button 
                                onClick={() => setModalOpen(false)}
                                className="px-8 py-3 bg-[var(--bg)] text-[var(--text)] rounded-xl font-bold shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)] hover:shadow-[8px_8px_16px_var(--shadow-dark),-8px_-8px_16px_var(--shadow-light)] active:shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] transition-all"
                            >
                                Close
                            </button>
                        </div>
                    )}

                    {/* SUCCESS / INTERACTIVE STATE */}
                    {cleanedImage && !processingUrl && !missingKeyError && (
                        <div className="w-full flex flex-col items-center justify-center animate-fade-in flex-1 min-h-0">
                             
                             {/* Image Container */}
                             <div 
                                ref={containerRef}
                                className={`relative w-full max-w-3xl rounded-xl overflow-hidden p-2 bg-[var(--bg)] shadow-[inset_6px_6px_12px_var(--shadow-dark),inset_-6px_-6px_12px_var(--shadow-light)] shrink-0 group select-none ${isEraserMode ? 'cursor-none' : ''}`}
                                onMouseLeave={hideCursor}
                             >
                                {isEraserMode ? (
                                    <>
                                        <canvas
                                            ref={canvasRef}
                                            className="block rounded-lg touch-none w-full h-auto relative z-10"
                                            onMouseDown={startDrawing}
                                            onMouseMove={draw}
                                            onMouseUp={stopDrawing}
                                            onTouchStart={startDrawing}
                                            onTouchMove={draw}
                                            onTouchEnd={stopDrawing}
                                        />
                                        {/* Custom Brush Cursor */}
                                        <div 
                                            ref={cursorRef}
                                            className="absolute w-10 h-10 rounded-full border-2 border-white bg-red-500/50 pointer-events-none z-20 opacity-0 transition-opacity duration-150 will-change-transform shadow-md"
                                            style={{ left: 0, top: 0 }}
                                        />
                                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur px-4 py-2 rounded-full text-xs font-bold text-white shadow-lg pointer-events-none z-30">
                                            Draw red mask to erase
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <img 
                                            src={isComparing && originalForComparison ? originalForComparison : cleanedImage} 
                                            alt={`AI ${actionType === 'clean' ? 'Cleaned' : 'Upscaled'} YouTube Thumbnail`}
                                            className="w-full h-auto max-h-[50vh] md:max-h-[60vh] rounded-lg object-contain mx-auto" 
                                        />
                                        
                                        {/* Compare Badge */}
                                        {originalForComparison && (
                                            <div className="absolute top-4 right-4 pointer-events-none z-10">
                                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm transition-colors duration-200 ${
                                                    isComparing 
                                                    ? 'bg-red-500 text-white' 
                                                    : 'bg-[var(--bg)]/90 text-blue-600 backdrop-blur'
                                                }`}>
                                                    {isComparing ? 'ORIGINAL' : 'AI ENHANCED'}
                                                </span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls - Fixed at Bottom */}
                {cleanedImage && !processingUrl && !missingKeyError && (
                    <div className="p-4 md:p-6 border-t border-[var(--text-muted)]/10 bg-[var(--bg)] shrink-0 w-full z-10">
                         <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl mx-auto justify-center">
                            {isEraserMode ? (
                                <>
                                    <button onClick={applyEraser} className="flex-1 px-6 py-3.5 bg-[var(--bg)] text-green-600 rounded-xl font-bold shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)] hover:text-green-700 active:shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] transition-all flex items-center justify-center gap-2">
                                        <Check className="w-5 h-5" /> Apply
                                    </button>
                                    <button onClick={() => setIsEraserMode(false)} className="flex-1 px-6 py-3.5 bg-[var(--bg)] text-[var(--text-muted)] rounded-xl font-bold shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)] hover:text-[var(--text)] active:shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] transition-all flex items-center justify-center gap-2">
                                        <Undo2 className="w-5 h-5" /> Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* Hold to Compare Button */}
                                    <button
                                        onMouseDown={() => setIsComparing(true)}
                                        onMouseUp={() => setIsComparing(false)}
                                        onMouseLeave={() => setIsComparing(false)}
                                        onTouchStart={() => setIsComparing(true)}
                                        onTouchEnd={() => setIsComparing(false)}
                                        className="flex-1 px-4 py-3.5 bg-[var(--bg)] text-[var(--text)] rounded-xl font-bold shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)] active:shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 select-none"
                                        title="Press and hold to see original"
                                    >
                                        <Eye className="w-5 h-5" />
                                        <span className="hidden sm:inline">Hold to Compare</span>
                                        <span className="sm:hidden">Compare</span>
                                    </button>

                                    <button
                                        onClick={() => setIsEraserMode(true)}
                                        className="flex-1 px-4 py-3.5 bg-[var(--bg)] text-pink-600 rounded-xl font-bold shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)] hover:text-pink-700 active:shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] transition-all flex items-center justify-center gap-2"
                                    >
                                        <Eraser className="w-5 h-5" />
                                        <span className="hidden sm:inline">Magic Eraser</span>
                                        <span className="sm:hidden">Erase</span>
                                    </button>
                                    
                                    <button
                                        onClick={() => downloadImage(cleanedImage, `thumbnail_${actionType}.png`)}
                                        className="flex-1 px-4 py-3.5 bg-[var(--bg)] text-blue-600 rounded-xl font-bold shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)] hover:text-blue-700 active:shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] transition-all flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-5 h-5" />
                                        <span className="hidden sm:inline">Download</span>
                                        <span className="sm:hidden">Save</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* Beta Popup */}
      <BetaPopup 
        isOpen={showBetaPopup}
        onClose={() => setShowBetaPopup(false)}
        featureName={betaFeatureName}
      />
    </>
  );
};

export default ThumbnailGrid;