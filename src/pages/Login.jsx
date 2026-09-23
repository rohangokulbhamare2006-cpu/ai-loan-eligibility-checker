import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import ForgotPasswordModal from './ForgotPasswordModal.jsx';
import { auth } from '../firebase/firebase.js';

export default function Login({ onLoginSuccess, onNavigateToRegister }) {
  const [email, setEmail] = useState('aryaman.sharma@fintech.io');
  const [password, setPassword] = useState('Fintech2026!');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await auth.login(email, password, rememberMe);
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setEmail('aryaman.sharma@fintech.io');
    setPassword('Fintech2026!');
    setError('');
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-6)'
      }}
    >
      <GlassCard
        glow
        padding="var(--space-8)"
        style={{
          width: '100%',
          maxWidth: '460px',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.7)'
        }}
      >
        {/* Brand Icon */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              marginBottom: 'var(--space-3)',
              boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)'
            }}
          >
            <Shield size={24} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Sign in to access your financial decision workspace
          </p>
        </div>

        {/* Demo Quick Button */}
        <div
          onClick={handleQuickDemo}
          style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px dashed rgba(56, 189, 248, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            marginBottom: 'var(--space-5)',
            transition: 'background var(--transition-fast)'
          }}
          title="Click to fill Aryaman Sharma demo profile"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="var(--secondary)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--secondary)', fontWeight: 600 }}>
              Use Aryaman Sharma Demo Profile
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto-fill</span>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--danger-bg)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--danger)',
              fontSize: '0.85rem',
              marginBottom: 'var(--space-4)'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="aryaman@fintech.io"
            prefix={<Mail size={16} />}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            prefix={<Lock size={16} />}
            required
          />

          {/* Options Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--primary-light)', cursor: 'pointer' }}
              />
              Remember this session
            </label>

            <span
              onClick={() => setShowForgot(true)}
              style={{ color: 'var(--secondary)', cursor: 'pointer', fontWeight: 500 }}
            >
              Forgot password?
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            loading={loading}
            iconRight={ArrowRight}
            style={{ marginTop: 'var(--space-2)' }}
          >
            Sign In Securely
          </Button>
        </form>

        {/* Footer toggle */}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <span
            onClick={onNavigateToRegister}
            style={{ color: 'var(--secondary)', fontWeight: 600, cursor: 'pointer' }}
          >
            Create an Account
          </span>
        </div>
      </GlassCard>

      <ForgotPasswordModal
        isOpen={showForgot}
        onClose={() => setShowForgot(false)}
      />
    </div>
  );
}
