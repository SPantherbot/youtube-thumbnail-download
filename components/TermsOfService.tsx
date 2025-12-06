import React, { useEffect } from 'react';

const TermsOfService: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="bg-[var(--bg)] rounded-[2.5rem] p-8 md:p-12 shadow-[10px_10px_20px_var(--shadow-dark),-10px_-10px_20px_var(--shadow-light)]">
          <h1 className="text-4xl font-black text-[var(--text)] mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg prose-gray max-w-none text-[var(--text-muted)]">
            <p className="text-lg mb-6 leading-relaxed">
              By accessing this website, you are agreeing to be bound by these website Terms and Conditions of Use, all applicable laws and regulations, 
              and agree that you are responsible for compliance with any applicable local laws.
            </p>
            
            <h2 className="text-2xl font-bold text-[var(--text)] mt-10 mb-4">1. Use License</h2>
            <p>
               Permission is granted to temporarily download the materials (information or software) on ThumbGrabber AI's website for personal, non-commercial transitory viewing only. 
               This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 mb-4 mt-2 space-y-2">
                <li>Modify or copy the materials;</li>
                <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                <li>Attempt to decompile or reverse engineer any software contained on ThumbGrabber AI's website;</li>
                <li>Remove any copyright or other proprietary notations from the materials; or</li>
            </ul>

            <h2 className="text-2xl font-bold text-[var(--text)] mt-10 mb-4">2. Disclaimer</h2>
            <p>
              The materials on ThumbGrabber AI's website are provided "as is". ThumbGrabber AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.
            </p>

            <h2 className="text-2xl font-bold text-[var(--text)] mt-10 mb-4">3. Copyright & Fair Use</h2>
            <p>
                ThumbGrabber AI is a tool for accessing publicly available thumbnails. We do not claim ownership of any content downloaded via this tool. 
                All copyrights belong to their respective owners (the YouTube creators). Users are responsible for ensuring they have the right to use the downloaded images. 
            </p>

            <h2 className="text-2xl font-bold text-[var(--text)] mt-10 mb-4">4. Limitations</h2>
            <p>
              In no event shall ThumbGrabber AI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption,) arising out of the use or inability to use the materials on ThumbGrabber AI's Internet site.
            </p>
          </div>
      </div>
    </div>
  );
};

export default TermsOfService;