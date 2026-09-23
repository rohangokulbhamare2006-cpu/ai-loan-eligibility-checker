import React, { useState } from 'react';
import { Shield, Lock, Mail, User, ArrowRight } from 'lucide-react';
import GlassCard from '../components/GlassCard.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { auth } from '../firebase/firebase.js';

export default function Register({ onRegisterSuccess, onNavigateToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await auth.register(name, email, password);
      if (onRegisterSuccess) onRegisterSuccess(user);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
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
            Open Financial Account
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Instant access to AI underwriting audits and scoring
          </p>
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
            label="Full Legal Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Aryaman Sharma"
            prefix={<User size={16} />}
            required
          />

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
            label="Create Secure Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            prefix={<Lock size={16} />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            loading={loading}
            iconRight={ArrowRight}
            style={{ marginTop: 'var(--space-2)' }}
          >
            Create Account
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <span
            onClick={onNavigateToLogin}
            style={{ color: 'var(--secondary)', fontWeight: 600, cursor: 'pointer' }}
          >
            Sign In
          </span>
        </div>
      </GlassCard>
    </div>
  );
}
