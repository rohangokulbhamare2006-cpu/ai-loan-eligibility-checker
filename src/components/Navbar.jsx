import React from 'react';
import { Shield, Bell, User, Sparkles, LogOut, CheckCircle } from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';

export default function Navbar({
  currentRoute,
  onNavigate,
  user,
  onLogout,
  onOpenSettings
}) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(8, 17, 31, 0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-glass)',
        padding: '0 var(--space-6)',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {/* Brand & Logo */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
        onClick={() => onNavigate('landing')}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)',
            color: '#ffffff'
          }}
        >
          <Shield size={22} strokeWidth={2.4} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              CRED<span style={{ color: 'var(--secondary)' }}>LEND</span>.AI
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: 'rgba(56, 189, 248, 0.15)',
                color: 'var(--secondary)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-pill)',
                letterSpacing: '0.04em'
              }}
            >
              PRO
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginTop: '-2px' }}>
            BFSI Decision Intelligence
          </span>
        </div>
      </div>

      {/* Center Nav Links (Visible on desktop) */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '4px',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--border-glass)'
        }}
        className="desktop-nav"
      >
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'eligibility', label: 'Loan Eligibility' },
          { id: 'emi', label: 'Smart EMI' },
          { id: 'health', label: 'Health Score' },
          { id: 'advisor', label: 'AI Advisor' },
          { id: 'reports', label: 'Reports' }
        ].map(item => {
          const isActive = currentRoute === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                background: isActive ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                padding: '6px 14px',
                fontSize: '0.84rem',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                boxShadow: isActive ? '0 2px 10px rgba(37, 99, 235, 0.35)' : 'none'
              }}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ThemeToggle />

        {/* Live Notification Icon */}
        <div
          style={{
            position: 'relative',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
          title="Banking updates: RBI repo rate unchanged at 6.50%"
        >
          <Bell size={17} />
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: 'var(--secondary)',
              boxShadow: '0 0 6px var(--secondary)'
            }}
          />
        </div>

        {/* User Profile Menu */}
        {user ? (
          <div
            onClick={onOpenSettings}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-pill)',
              padding: '4px 12px 4px 4px',
              cursor: 'pointer',
              transition: 'border-color var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-glass)'}
            title="Account & API Settings"
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0284C7 0%, #2563EB 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}
            >
              {user.displayName?.[0] || 'A'}
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {user.displayName?.split(' ')[0] || 'User'}
            </span>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('login')}
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              padding: '7px 18px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
