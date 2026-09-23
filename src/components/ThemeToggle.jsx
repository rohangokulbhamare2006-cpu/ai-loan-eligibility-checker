import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { storageService } from '../services/storageService.js';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const settings = storageService.getSettings();
    const active = settings.theme || 'dark';
    setTheme(active);
    document.body.className = active === 'light' ? 'light-theme' : 'dark-theme';
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.body.className = next === 'light' ? 'light-theme' : 'dark-theme';
    storageService.saveSettings({ theme: next });
  };

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      style={{
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid var(--border-glass)',
        borderRadius: 'var(--radius-pill)',
        padding: '6px 12px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        fontSize: '0.8rem',
        fontWeight: 500,
        transition: 'all var(--transition-fast)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--secondary)';
        e.currentTarget.style.color = 'var(--text-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-glass)';
        e.currentTarget.style.color = 'var(--text-secondary)';
      }}
    >
      {theme === 'dark' ? (
        <>
          <Sun size={15} color="#F59E0B" />
          <span>Light</span>
        </>
      ) : (
        <>
          <Moon size={15} color="#38BDF8" />
          <span>Dark</span>
        </>
      )}
    </button>
  );
}
