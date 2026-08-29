import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Zap,
  Minimize2,
  HelpCircle,
  BookOpen,
  Award,
  Briefcase
} from 'lucide-react';

export default function ChatbotWidget() {
  const { lang, t, allCourses, certificatesList, applicationsList, isOnline, setActiveView } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome-1',
      sender: 'bot',
      text:
        lang === 'mr'
          ? 'नमस्कार! मी तुमचा ग्रामशिक्षा AI सहाय्यक आहे. कोर्सेस, प्रमाणपत्रे किंवा नोकरीच्या संधींविषयी काहीही विचारा!'
          : lang === 'hi'
          ? 'नमस्ते! मैं आपका ग्रामशिक्षा AI सहायक हूँ। कोर्स, प्रमाणपत्र या रोजगार के अवसरों के बारे में कुछ भी पूछें!'
          : 'Hello! I am your GaonShiksha AI assistant. Ask me anything about courses, certificates, or local job opportunities!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Quick suggestion prompts
  const quickPrompts = [
    {
      id: 'cert',
      icon: Award,
      text:
        lang === 'mr'
          ? 'प्रमाणपत्र कसे मिळवायचे?'
          : lang === 'hi'
          ? 'प्रमाणपत्र कैसे प्राप्त करें?'
          : 'How to get a certificate?'
    },
    {
      id: 'course',
      icon: BookOpen,
      text:
        lang === 'mr'
          ? 'कोणते कोर्सेस उपलब्ध आहेत?'
          : lang === 'hi'
          ? 'कौन से कोर्स उपलब्ध हैं?'
          : 'What courses are available?'
    },
    {
      id: 'jobs',
      icon: Briefcase,
      text:
        lang === 'mr'
          ? 'कोपरगाव मधील नोकरीच्या संधी'
          : lang === 'hi'
          ? 'कोपरगाव में रोजगार के अवसर'
          : 'Kopargaon job opportunities'
    },
    {
      id: 'offline',
      icon: Zap,
      text:
        lang === 'mr'
          ? 'इंटरनेट शिवाय कसे शिकायचे?'
          : lang === 'hi'
          ? 'बिना इंटरनेट के कैसे सीखें?'
          : 'How offline learning works'
    }
  ];

  // Smart Offline Knowledge Matcher
  const generateBotReply = (userQuery) => {
    const q = userQuery.toLowerCase();

    // 1. Certificate Queries
    if (q.includes('certificate') || q.includes('प्रमाणपत्र') || q.includes('पडताळणी') || q.includes('degree')) {
      const certCount = certificatesList.length;
      if (lang === 'mr') {
        return `तुम्ही कोर्स पूर्ण करून सर्व क्विझ उत्तीर्ण झाल्यावर तुम्हाला अधिकृत मान्यताप्राप्त प्रमाणपत्र मिळते! सध्या तुमच्याकडे ${certCount} प्रमाणपत्रे आहेत. "माझी प्रमाणपत्रे" टॅब मध्ये जाऊन ते डाउनलोड करा.`;
      } else if (lang === 'hi') {
        return `कोर्स पूरा करके क्विज़ पास करने पर आपको मान्यता प्राप्त डिजिटल प्रमाणपत्र मिलता है! वर्तमान में आपके पास ${certCount} प्रमाणपत्र हैं। "मेरे प्रमाणपत्र" सेक्शन से डाउनलोड करें।`;
      }
      return `After completing a course and passing the quiz, you earn an official accredited certificate! You currently have ${certCount} certificate(s). Visit the "My Certificates" tab to view and download PDF certificates.`;
    }

    // 2. Course Queries
    if (q.includes('course') || q.includes('कोर्स') || q.includes('अभ्यासक्रम') || q.includes('electrician') || q.includes('sewing') || q.includes('computer')) {
      const titles = allCourses.map(c => typeof c.title === 'object' ? (c.title[lang] || c.title.en) : c.title).slice(0, 3).join(', ');
      if (lang === 'mr') {
        return `ग्रामशिक्षा मंचावर प्रॅक्टिकल व्यावसायिक कोर्सेस उपलब्ध आहेत: ${titles || 'डिजिटल साक्षरता, संगणक, शिलाई व इलेक्ट्रीशियन'}. हे सर्व कोर्सेस १००% ऑफलाइन चालतात!`;
      } else if (lang === 'hi') {
        return `ग्रामशिक्षा मंच पर उपलब्ध व्यावहारिक कोर्स: ${titles || 'डिजिटल साक्षरता, कंप्यूटर, सिलाई एवं इलेक्ट्रीशियन'}. ये सभी कोर्स 100% ऑफलाइन काम करते हैं!`;
      }
      return `Popular courses on GaonShiksha include: ${titles || 'Digital Literacy, Computer Skills, Modern Tailoring, and Electrical Installation'}. All courses work 100% offline!`;
    }

    // 3. Job / Opportunity Queries
    if (q.includes('job') || q.includes('नोकरी') || q.includes('रोजगार') || q.includes('opportunity') || q.includes('kopargaon') || q.includes('कोपरगाव') || q.includes('apprentice')) {
      const appCount = applicationsList.length;
      if (lang === 'mr') {
        return `कोपरगाव व अहमदनगर परिसरातील स्थानिक कंपन्या व केंद्रांमध्ये अप्रेंटिस व नोकरीच्या संधी उपलब्ध आहेत. तुम्ही ${appCount} अर्जांसाठी रस दर्शवला आहे. "स्थानिक संधी" टॅब पहा!`;
      } else if (lang === 'hi') {
        return `कोपरगाव एवं आसपास के क्षेत्रों में अप्रेंटिसशिप और रोजगार के अवसर उपलब्ध हैं। आपने ${appCount} पदों के लिए आवेदन किया है। "स्थानीय अवसर" टैब देखें!`;
      }
      return `Career opportunities & apprenticeships are available in Kopargaon and nearby hubs. You have applied to ${appCount} job opening(s). Visit the "Local Opportunities" tab to apply!`;
    }

    // 4. Offline Mode Queries
    if (q.includes('offline') || q.includes('इंटरनेट') || q.includes('network') || q.includes('wifi') || q.includes('ऑफलाइन')) {
      if (lang === 'mr') {
        return `ग्रामशिक्षा १००% ऑफलाइन-फर्स्ट आहे! Dexie IndexedDB तंत्रज्ञानामुळे तुमचे धडे, क्विझ आणि प्रगती इंटरनेट नसतानाही सुरक्षित राहते. इंटरनेट सुरू झाल्यावर ते आपोआप सर्व्हरशी सिंक होते.`;
      } else if (lang === 'hi') {
        return `ग्रामशिक्षा 100% ऑफलाइन-फर्स्ट है! Dexie IndexedDB तकनीक के कारण आपके पाठ, क्विज़ और प्रगति बिना इंटरनेट के भी सुरक्षित रहती है। इंटरनेट कनेक्ट होने पर यह अपने आप सिंक हो जाता है।`;
      }
      return `GaonShiksha is 100% Offline-First! Built with Dexie IndexedDB, your progress, quizzes, and certificates remain fully cached even with zero mobile signal. Changes automatically sync when connected.`;
    }

    // Default Fallback
    if (lang === 'mr') {
      return `मी तुमच्या प्रश्नाचा अभ्यास करत आहे. तुम्ही मंचावरील कोर्सेस शिकू शकता, क्विझ देऊन प्रमाणपत्रे मिळवू शकता आणि स्थानिक नोकरीसाठी अर्ज करू शकता. तुम्हाला कशाबद्दल अधिक माहिती हवी आहे?`;
    } else if (lang === 'hi') {
      return `मैं आपके प्रश्न को समझ रहा हूँ। आप मंच पर कोर्स सीख सकते हैं, क्विज़ देकर प्रमाणपत्र प्राप्त कर सकते हैं और नौकरी के लिए आवेदन कर सकते हैं। आपको किस बारे में अधिक जानकारी चाहिए?`;
    }
    return `I can help you navigate courses, earn skill certificates, apply for Kopargaon job openings, or explain offline learning. What specific topic would you like to explore?`;
  };

  const handleSend = (textToSend = input) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isTyping) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate streaming typewriter AI response
    setTimeout(() => {
      const fullReply = generateBotReply(trimmed);
      const botMessageId = `bot-${Date.now()}`;
      
      const botMessage = {
        id: botMessageId,
        sender: 'bot',
        text: fullReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 p-3.5 sm:p-4 rounded-full bg-[#002EAF] text-white shadow-2xl hover:scale-105 transition-all flex items-center space-x-2 border-2 border-[#FFEB01] group animate-bounce cursor-pointer"
          title="Open AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-[#FFEB01]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FFEB01] border border-white animate-ping" />
          </div>
          <span className="hidden md:inline font-black text-xs text-white pr-1">
            {lang === 'mr' ? 'AI मित्र' : lang === 'hi' ? 'AI सहायक' : 'AI Assistant'}
          </span>
        </button>
      )}

      {/* Floating Side Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-16 right-3 sm:bottom-6 sm:right-6 z-50 w-[92vw] sm:w-96 h-[500px] sm:h-[540px] bg-white rounded-3xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden animate-fadeIn">
          
          {/* Header (#0077FF with Yellow Badges) */}
          <div className="bg-[#0077FF] text-white p-4 flex items-center justify-between border-b border-blue-400">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white font-black shadow-md border border-white/30">
                <Bot className="w-5 h-5 text-[#FFEB01]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm text-white">
                    {lang === 'mr' ? 'ग्रामशिक्षा AI सहाय्यक' : lang === 'hi' ? 'ग्रामशिक्षा AI सहायक' : 'GaonShiksha AI Assistant'}
                  </h3>
                  <span className="text-[10px] font-black bg-[#FFEB01] text-[#0077FF] px-2 py-0.5 rounded-full">
                    Offline AI
                  </span>
                </div>
                <p className="text-[10px] text-blue-200 flex items-center space-x-1 mt-0.5">
                  <Zap className="w-3 h-3 text-gold-400" />
                  <span>{isOnline ? 'Online Synced' : '100% Offline Mode'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc]">
            
            {/* Quick Prompts Banner */}
            {messages.length <= 2 && (
              <div className="space-y-2 mb-4">
                <p className="text-[11px] font-bold text-slate-600 flex items-center space-x-1">
                  <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
                  <span>{lang === 'mr' ? 'त्वरित प्रश्न विचारा:' : lang === 'hi' ? 'त्वरित प्रश्न पूछें:' : 'Quick Questions:'}</span>
                </p>
                <div className="flex flex-col space-y-1.5">
                  {quickPrompts.map(qp => {
                    const IconComp = qp.icon;
                    return (
                      <button
                        key={qp.id}
                        onClick={() => handleSend(qp.text)}
                        className="text-left text-xs bg-white hover:bg-blue-50 text-slate-800 font-bold p-2.5 rounded-xl border border-slate-200 hover:border-brand-400 transition-all flex items-center space-x-2 shadow-xs group cursor-pointer"
                      >
                        <IconComp className="w-4 h-4 text-brand-600 group-hover:scale-110 transition-transform" />
                        <span>{qp.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-orange-100 text-brand-700 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium space-y-1 shadow-xs ${
                      isUser
                        ? 'bg-brand-600 text-white rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <span className={`text-[9px] block text-right ${isUser ? 'text-orange-200' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-orange-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-center space-x-1.5 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-spin" />
                  <span>{lang === 'mr' ? 'AI टाइप करत आहे...' : lang === 'hi' ? 'AI टाइप कर रहा है...' : 'AI is typing...'}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={
                lang === 'mr'
                  ? 'इथे प्रश्न टाका...'
                  : lang === 'hi'
                  ? 'यहाँ प्रश्न पूछें...'
                  : 'Ask AI assistant...'
              }
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
