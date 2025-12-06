import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import Contact from './components/Contact';
import ApiKeyModal from './components/ApiKeyModal';
import Notification from './components/Notification';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load API Key and Theme from local storage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('user_gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }

    // Theme initialization logic
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
    } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        setIsDarkMode(false);
        // Meta theme color update
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#e7e9eb');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        setIsDarkMode(true);
         // Meta theme color update
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#2d323b');
    }
  };

  const handleSetApiKey = (key: string) => {
    setApiKey(key);
    if (key) {
        localStorage.setItem('user_gemini_api_key', key);
        showNotification("API Key saved successfully! 🚀");
    } else {
        localStorage.removeItem('user_gemini_api_key');
        showNotification("API Key removed.");
    }
  };

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans selection:bg-red-100 selection:text-red-900 transition-colors duration-300">
        <Header 
          openKeyModal={() => setIsKeyModalOpen(true)} 
          hasKey={!!apiKey}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
        
        <main className="min-h-[calc(100vh-300px)] animate-fade-in">
          <Routes>
            <Route path="/" element={
              <Home 
                apiKey={apiKey} 
                openKeyModal={() => setIsKeyModalOpen(true)} 
                notify={showNotification}
              />
            } />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        
        <Footer />

        <ApiKeyModal 
          isOpen={isKeyModalOpen} 
          onClose={() => setIsKeyModalOpen(false)} 
          apiKey={apiKey} 
          setApiKey={handleSetApiKey} 
        />

        <Notification 
          message={notificationMsg} 
          onClose={() => setNotificationMsg(null)} 
        />
      </div>
    </Router>
  );
};

export default App;