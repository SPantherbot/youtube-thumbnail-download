import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {

  return (
    <footer className="bg-[var(--bg)] py-16 mt-20 relative transition-colors duration-300">
      {/* Decorative Top Shadow */}
      <div className="absolute top-0 left-0 w-full h-px shadow-[0_1px_0_rgba(255,255,255,0.1),0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[0_1px_0_rgba(255,255,255,0.05),0_-1px_0_rgba(0,0,0,0.3)]"></div>

      <div className="container mx-auto px-4 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--bg)] shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)] mb-6">
             <Heart className="w-5 h-5 text-red-500 fill-current" />
        </div>
        
        <p className="text-[var(--text-muted)] text-sm mb-8 max-w-lg mx-auto leading-relaxed font-medium">
          ThumbGrabber AI is a free tool created for the community. <br/>
          Not affiliated with Google or YouTube.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {['Home', 'Privacy Policy', 'Terms of Service', 'Contact Us'].map((text, idx) => {
             const paths = ['/', '/privacy', '/terms', '/contact'];
             return (
                <Link 
                    key={text}
                    to={paths[idx]} 
                    className="px-6 py-3 rounded-xl bg-[var(--bg)] text-[var(--text-muted)] text-sm font-bold shadow-[5px_5px_10px_var(--shadow-dark),-5px_-5px_10px_var(--shadow-light)] hover:text-red-600 hover:translate-y-[-2px] active:translate-y-[0px] active:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light)] transition-all"
                >
                    {text}
                </Link>
             );
          })}
        </div>
        
        <p className="text-xs text-[var(--text-muted)] font-bold tracking-widest uppercase opacity-60">
            © {new Date().getFullYear()} ThumbGrabber AI
        </p>
      </div>
    </footer>
  );
};

export default Footer;