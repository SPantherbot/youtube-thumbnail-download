import React, { useState, useEffect } from 'react';
import InputSection from './InputSection';
import ThumbnailGrid from './ThumbnailGrid';
import { extractVideoId, getVideoDetails } from '../services/youtube';
import { Thumbnail, ProcessState } from '../types';
import { Image, AlertCircle, ShieldCheck, Zap, Crop } from 'lucide-react';

interface HomeProps {
    apiKey?: string;
    openKeyModal?: () => void;
    notify?: (msg: string) => void;
}

const Home: React.FC<HomeProps> = ({ apiKey, openKeyModal, notify }) => {
  const [status, setStatus] = useState<ProcessState>(ProcessState.IDLE);
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSearch = (url: string) => {
    setStatus(ProcessState.LOADING);
    setErrorMsg('');
    setThumbnails([]);

    const videoId = extractVideoId(url);

    if (!videoId) {
      setStatus(ProcessState.ERROR);
      setErrorMsg('Invalid YouTube URL. Please check the link and try again.');
      return;
    }

    setTimeout(() => {
      const details = getVideoDetails(videoId);
      setThumbnails(details.thumbnails);
      setStatus(ProcessState.SUCCESS);
    }, 800);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="pt-8 md:pt-16 pb-12 md:pb-24 px-4">
        <div className="container mx-auto">
          <InputSection onSearch={handleSearch} isLoading={status === ProcessState.LOADING} />
          
          {status === ProcessState.ERROR && (
            <div className="max-w-md mx-auto mt-8 p-6 bg-[var(--bg)] rounded-2xl shadow-[inset_6px_6px_12px_var(--shadow-dark),inset_-6px_-6px_12px_var(--shadow-light)] text-red-600 flex items-center gap-4 animate-fade-in border border-red-500/10">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <p className="font-bold">{errorMsg}</p>
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      {status === ProcessState.SUCCESS && (
        <section className="container mx-auto px-0 md:px-4 pb-24 -mt-6 md:-mt-10 relative z-20">
          <ThumbnailGrid 
            thumbnails={thumbnails} 
            apiKey={apiKey || ''} 
            openKeyModal={openKeyModal}
            notify={notify}
          />
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="py-24 bg-[var(--bg)] transition-colors duration-300">
          <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-20">
                  <h2 className="text-3xl font-black text-[var(--text)] mb-4 tracking-tight">How to Download YouTube Video Thumbnail - Easy Steps</h2>
                  <div className="h-1.5 w-20 bg-[var(--text-muted)]/20 rounded-full mx-auto shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)]"></div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                      { icon: Image, color: 'text-red-500', title: 'YT1D Alternative Tool', desc: 'Online YouTube downloader for thumbnails in HD, 4K & Max Resolution. Download YT Shorts & extract frames instantly.' },
                      { icon: Zap, color: 'text-blue-500', title: 'Frame Grabber & Extractor', desc: 'Extract frame from video with our advanced frame grabber tool. YouTube thumbnail template & PSD free download.' },
                      { icon: Crop, color: 'text-purple-500', title: 'Profile Pic & Banner Sizes', desc: 'Get YouTube profile picture size (800x800) & banner size (2560x1440). YouTube Shorts icon resources included.' },
                      { icon: ShieldCheck, color: 'text-green-500', title: 'Free Online Downloader', desc: 'YouTube downloader free download online. No watermarks, no limits, no registration required. Free forever.' },
                  ].map((feature, idx) => (
                      <div key={idx} className="p-8 rounded-[2rem] bg-[var(--bg)] shadow-[10px_10px_20px_var(--shadow-dark),-10px_-10px_20px_var(--shadow-light)] hover:translate-y-[-4px] transition-transform duration-300">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light)] ${feature.color}`}>
                              <feature.icon className="w-8 h-8" />
                          </div>
                          <h3 className="text-xl font-bold mb-3 text-[var(--text)]">{feature.title}</h3>
                          <p className="text-[var(--text-muted)] leading-relaxed font-medium text-sm">
                              {feature.desc}
                          </p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-[var(--bg)] transition-colors duration-300">
          <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl font-black text-[var(--text)] mb-4 tracking-tight">Frequently Asked Questions</h2>
                  <div className="h-1.5 w-20 bg-[var(--text-muted)]/20 rounded-full mx-auto shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)]"></div>
              </div>

              <div className="max-w-4xl mx-auto space-y-6">
                  {[
                      { q: 'What is YT1D and how is ThumbGrabber different?', a: 'YT1D is a YouTube downloader tool. ThumbGrabber AI focuses specifically on downloading thumbnails in HD, 4K & Max Resolution with AI enhancement features like frame grabber, text removal, and smart cropping.' },
                      { q: 'How to download YouTube video thumbnail in HD quality?', a: 'Simply paste the YouTube video URL into our search bar. We automatically extract thumbnails in all available resolutions including HD (1280x720), Full HD (1920x1080), and 4K Max Resolution (maxresdefault).' },
                      { q: 'Can I download YouTube Shorts thumbnail and icon?', a: 'Yes! Our online YouTube downloader supports both regular videos and YouTube Shorts. Download YT Shorts thumbnails in all resolutions, and we also provide YouTube Shorts icon resources.' },
                      { q: 'What is the YouTube profile picture size and banner size?', a: 'YouTube profile picture size is 800x800 pixels (displays at 98x98). YouTube banner size is 2560x1440 pixels. Use our frame grabber to extract and crop images to these exact dimensions.' },
                      { q: 'Is this a free online YouTube downloader?', a: 'Yes, ThumbGrabber is a 100% free YouTube thumbnail downloader. No registration, no watermarks, unlimited downloads. It\'s a YouTube downloader free download online tool forever.' },
                      { q: 'Can I extract frames from videos like a frame grabber?', a: 'Absolutely! Our tool works as a frame grabber and frame extractor. You can extract high-quality frames from any YouTube video or Short in multiple resolutions and aspect ratios.' }
                  ].map((faq, idx) => (
                      <div key={idx} className="bg-[var(--bg)] p-6 md:p-8 rounded-[2rem] shadow-[10px_10px_20px_var(--shadow-dark),-10px_-10px_20px_var(--shadow-light)]">
                          <h3 className="text-lg md:text-xl font-bold text-[var(--text)] mb-3">{faq.q}</h3>
                          <p className="text-[var(--text-muted)] font-medium leading-relaxed">{faq.a}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-[var(--bg)] transition-colors duration-300">
          <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-20">
                  <h2 className="text-3xl font-black text-[var(--text)] mb-4 tracking-tight">How It Works</h2>
                  <div className="h-1.5 w-20 bg-[var(--text-muted)]/20 rounded-full mx-auto shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)]"></div>
              </div>

              <div className="max-w-4xl mx-auto">
                  <div className="relative">
                      {/* Connecting Line */}
                      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-[var(--text-muted)]/20 -ml-0.5 shadow-[inset_1px_1px_2px_var(--shadow-dark)] rounded-full hidden md:block"></div>
                      
                      {[
                        { step: '01', title: 'Paste Link', desc: 'Copy the YouTube video or Short link and paste it into the search bar.' },
                        { step: '02', title: 'Select Options', desc: 'Choose your desired aspect ratio (16:9, Square, etc.) and resolution.' },
                        { step: '03', title: 'AI Enhance', desc: 'Click "AI Clean" to remove text or "AI Upscale" to improve quality.' },
                        { step: '04', title: 'Download', desc: 'Save the perfect thumbnail to your device instantly.' }
                      ].map((item, index) => (
                          <div key={index} className={`flex flex-col md:flex-row items-center mb-12 md:mb-16 relative ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[var(--bg)] border-4 border-[var(--bg)] shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)] items-center justify-center font-black text-[var(--text-muted)] z-10">
                                  {item.step}
                              </div>
                              <div className="md:w-1/2 px-8 text-center md:text-left">
                                  <div className={`bg-[var(--bg)] p-8 rounded-[2rem] shadow-[10px_10px_20px_var(--shadow-dark),-10px_-10px_20px_var(--shadow-light)] ${index % 2 !== 0 ? 'md:text-right' : ''}`}>
                                      <h3 className="text-xl font-bold text-[var(--text)] mb-2">{item.title}</h3>
                                      <p className="text-[var(--text-muted)] font-medium">{item.desc}</p>
                                  </div>
                              </div>
                              <div className="md:w-1/2"></div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>
    </>
  );
};

export default Home;