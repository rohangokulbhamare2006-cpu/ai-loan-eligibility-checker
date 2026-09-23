import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  User,
  Bot,
  Trash2,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
  Percent,
  Compass
} from 'lucide-react';
import GlassCard from '../components/GlassCard.jsx';
import Button from '../components/Button.jsx';
import { storageService } from '../services/storageService.js';
import { geminiService } from '../gemini/geminiService.js';
import { formatINR } from '../utils/financialMath.js';

export default function AiAdvisor({ onToast }) {
  const userProfile = storageService.getUserProfile();
  const chatBottomRef = useRef(null);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'ai',
      text: `### Welcome to your BFSI Financial Advisor

Hello **${userProfile.name}**, I am your explainable AI Underwriting & Advisory Assistant.

I have synchronized with your current portfolio:
- **Monthly Income**: ₹${userProfile.monthlyIncome.toLocaleString('en-IN')}
- **Active Obligations**: ₹${(userProfile.monthlyExpenses + userProfile.existingEmi).toLocaleString('en-IN')}/mo
- **Liquid Reserves**: ₹${userProfile.savings.toLocaleString('en-IN')}
- **Credit Score**: **${userProfile.creditScore}**

Ask me anything about loan affordability, credit optimization, prepayment strategies, or risk management!`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    const userMsg = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const replyText = await geminiService.askAdvisor(query, messages, userProfile);
      const aiMsg = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = {
        id: 'ai_err_' + Date.now(),
        sender: 'ai',
        text: 'Apologies, I encountered a temporary network issue. Please re-verify your connection or settings.',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'init-reset',
        sender: 'ai',
        text: `### Conversation Reset\n\nHow can I help you analyze your borrowing plans today?`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    if (onToast) onToast('Chat history cleared.', 'info');
  };

  // Simple Markdown renderer for headings, bold, bullet points, numbers
  const renderFormattedText = (raw) => {
    const lines = raw.split('\n');
    return lines.map((line, idx) => {
      // H3
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '10px 0 6px' }}>
            {line.replace('### ', '')}
          </h4>
        );
      }
      // Bullet list
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const content = line.substring(2);
        return (
          <div key={idx} style={{ display: 'flex', gap: '8px', marginLeft: '6px', marginBottom: '4px' }}>
            <span style={{ color: 'var(--secondary)' }}>•</span>
            <span dangerouslySetInnerHTML={{ __html: parseBold(content) }} />
          </div>
        );
      }
      // Numbered list
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} style={{ marginLeft: '4px', marginBottom: '6px' }} dangerouslySetInnerHTML={{ __html: parseBold(line) }} />
        );
      }
      if (!line.trim()) {
        return <div key={idx} style={{ height: '8px' }} />;
      }
      return (
        <p key={idx} style={{ marginBottom: '4px', lineHeight: 1.55 }} dangerouslySetInnerHTML={{ __html: parseBold(line) }} />
      );
    });
  };

  const parseBold = (str) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text-primary); font-weight: 700;">$1</strong>')
      .replace(/`(.*?)`/g, '<code style="background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85em;">$1</code>');
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', height: 'calc(100vh - 140px)', minHeight: '620px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Bot size={16} />
            <span>Interactive BFSI Advisor</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '2px' }}>
            Gemini Financial Intelligence
          </h1>
        </div>

        <Button variant="ghost" size="sm" icon={Trash2} onClick={handleClearChat}>
          Clear Conversation
        </Button>
      </div>

      {/* Suggested Prompts Bar */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          'Can I afford ₹15 lakh?',
          'How can I improve my credit score?',
          'Should I reduce EMI first or invest?',
          'What happens if interest rates rise by 1.5%?'
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-pill)',
              padding: '6px 14px',
              fontSize: '0.8rem',
              color: 'var(--secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--secondary)';
              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-glass)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <GlassCard
        padding="var(--space-6)"
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-5)',
          border: '1px solid var(--border-glass)'
        }}
      >
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '12px',
                alignSelf: isAi ? 'flex-start' : 'flex-end',
                maxWidth: isAi ? '88%' : '78%'
              }}
            >
              {isAi && (
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
                  }}
                >
                  <Bot size={20} />
                </div>
              )}

              <div
                style={{
                  background: isAi ? 'rgba(255, 255, 255, 0.04)' : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  border: isAi ? '1px solid var(--border-glass)' : 'none',
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 18px',
                  color: 'var(--text-primary)',
                  boxShadow: isAi ? 'none' : '0 4px 16px rgba(37, 99, 235, 0.3)',
                  fontSize: '0.92rem'
                }}
              >
                {isAi ? renderFormattedText(msg.text) : msg.text}
                <div style={{ fontSize: '0.7rem', color: isAi ? 'var(--text-dim)' : 'rgba(255,255,255,0.7)', marginTop: '6px', textAlign: 'right' }}>
                  {msg.timestamp}
                </div>
              </div>

              {!isAi && (
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--secondary)',
                    flexShrink: 0
                  }}
                >
                  <User size={18} />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start', alignItems: 'center' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <Sparkles size={18} />
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-lg)',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Reasoning financial formulas</span>
              <span style={{ display: 'flex', gap: '4px', marginLeft: '4px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--secondary)', animation: 'pulseGlow 1s infinite' }} />
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--secondary)', animation: 'pulseGlow 1s 0.2s infinite' }} />
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--secondary)', animation: 'pulseGlow 1s 0.4s infinite' }} />
              </span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </GlassCard>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          background: 'var(--bg-card)',
          backdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--border-glass-bright)',
          borderRadius: 'var(--radius-pill)',
          padding: '6px 8px 6px 18px',
          boxShadow: 'var(--glass-shadow)'
        }}
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask loan affordability, FOIR calculation, tenure tradeoffs..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-body)'
          }}
          disabled={loading}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!inputMessage.trim() || loading}
          style={{ borderRadius: 'var(--radius-pill)', minWidth: '44px', width: '44px', height: '44px', padding: 0 }}
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}
