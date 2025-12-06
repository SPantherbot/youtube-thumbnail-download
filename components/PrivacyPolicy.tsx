import React, { useEffect } from 'react';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="bg-[var(--bg)] rounded-[2.5rem] p-8 md:p-12 shadow-[10px_10px_20px_var(--shadow-dark),-10px_-10px_20px_var(--shadow-light)]">
          <h1 className="text-4xl font-black text-[var(--text)] mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg prose-gray max-w-none text-[var(--text-muted)]">
            <p className="text-sm font-bold opacity-60 mb-8 uppercase tracking-widest">Last updated: dec 5, 2025</p>
            
            <h2 className="text-2xl font-bold text-[var(--text)] mt-10 mb-4">1. Information We Collect</h2>
            <p>
              ThumbGrabber AI is a client-side tool. We do not store any images, video URLs, or personal data on our servers. 
              All image processing, including downloading and cropping, happens directly in your browser.
            </p>

            <h2 className="text-2xl font-bold text-[var(--text)] mt-10 mb-4">2. AI Processing</h2>
            <p>
              When you use our "AI Magic Remove" feature, the thumbnail image is temporarily sent to Google's Gemini API for processing. 
              The image is not stored by us. Google's data usage is governed by their own privacy policies.
            </p>

            <h2 className="text-2xl font-bold text-[var(--text)] mt-10 mb-4">3. Log Files</h2>
            <p>
              Like many other Web sites, ThumbGrabber AI makes use of log files. The information inside the log files includes internet protocol (IP) addresses, 
              browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and number of clicks to analyze trends.
            </p>

            <h2 className="text-2xl font-bold text-[var(--text)] mt-10 mb-4">4. Cookies and Web Beacons</h2>
            <p>
              ThumbGrabber AI uses cookies to store information about visitors' preferences, to record user-specific information on which pages the site visitor accesses or visits.
            </p>
            <h3 className="text-xl font-bold text-[var(--text)] mt-6 mb-2">DoubleClick DART Cookie</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Google, as a third party vendor, uses cookies to serve ads on ThumbGrabber AI.</li>
                <li>Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy.</li>
            </ul>
          </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
