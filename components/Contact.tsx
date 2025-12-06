import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl animate-fade-in">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--bg)] rounded-full mb-6 shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)] text-red-500">
             <Mail className="w-7 h-7" />
        </div>
        <h1 className="text-4xl font-black text-[var(--text)] mb-4">Contact Us - ThumbGrabber AI Support</h1>
        <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto font-medium">
            Have questions? We'd love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="md:col-span-1 space-y-8">
              <div className="p-6 rounded-3xl bg-[var(--bg)] shadow-[inset_6px_6px_12px_var(--shadow-dark),inset_-6px_-6px_12px_var(--shadow-light)]">
                  <h3 className="text-lg font-bold text-[var(--text)] mb-2">Email Us</h3>
                  <a href="mailto:kleinmoretti@tuta.io" className="text-[var(--text-muted)] hover:text-red-600 transition-colors flex items-center gap-2 text-sm font-medium">
                      <Mail className="w-4 h-4" />
                      kleinmoretti@tuta.io
                  </a>
              </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2 bg-[var(--bg)] rounded-[2rem] shadow-[10px_10px_20px_var(--shadow-dark),-10px_-10px_20px_var(--shadow-light)] p-8 md:p-10 border border-[var(--text)]/5">
            {submitted ? (
                <div className="text-center py-12">
                    <div className="w-20 h-20 bg-[var(--bg)] text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[inset_6px_6px_12px_var(--shadow-dark),inset_-6px_-6px_12px_var(--shadow-light)]">
                        <Send className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--text)] mb-2">Message Sent!</h3>
                    <p className="text-[var(--text-muted)] font-medium">We'll get back to you shortly.</p>
                    <button onClick={() => setSubmitted(false)} className="mt-8 px-6 py-3 bg-[var(--bg)] text-red-500 font-bold rounded-xl shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)] active:shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] transition-all">
                        Send another
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label htmlFor="name" className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest ml-2">Name</label>
                            <input
                                type="text"
                                id="name"
                                required
                                className="w-full px-5 py-4 rounded-xl bg-[var(--bg)] shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light)] focus:shadow-[inset_8px_8px_16px_var(--shadow-dark),inset_-8px_-8px_16px_var(--shadow-light)] outline-none text-[var(--text)] font-medium transition-all"
                                placeholder="Your name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div className="space-y-3">
                            <label htmlFor="email" className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest ml-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                required
                                className="w-full px-5 py-4 rounded-xl bg-[var(--bg)] shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light)] focus:shadow-[inset_8px_8px_16px_var(--shadow-dark),inset_-8px_-8px_16px_var(--shadow-light)] outline-none text-[var(--text)] font-medium transition-all"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label htmlFor="message" className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest ml-2">Message</label>
                        <textarea
                            id="message"
                            required
                            rows={5}
                            className="w-full px-5 py-4 rounded-xl bg-[var(--bg)] shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light)] focus:shadow-[inset_8px_8px_16px_var(--shadow-dark),inset_-8px_-8px_16px_var(--shadow-light)] outline-none text-[var(--text)] font-medium transition-all resize-none"
                            placeholder="How can we help you?"
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 bg-[var(--bg)] text-[var(--text)] font-black tracking-wide rounded-xl shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)] hover:shadow-[8px_8px_16px_var(--shadow-dark),-8px_-8px_16px_var(--shadow-light)] active:shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] hover:text-red-600 transition-all flex items-center justify-center gap-2"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Send Message
                    </button>
                </form>
            )}
          </div>
      </div>
    </div>
  );
};

export default Contact;