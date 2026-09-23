import React, { useState } from 'react';
import Modal from '../components/Modal.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { auth } from '../firebase/firebase.js';

export default function ForgotPasswordModal({ isOpen, onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sentMessage, setSentMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSentMessage('');
    setLoading(true);

    try {
      const res = await auth.sendPasswordResetEmail(email);
      setSentMessage(res.message);
      if (onSuccess) onSuccess(res.message);
    } catch (err) {
      setError(err.message || 'Failed to dispatch reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reset Secure Password">
      {sentMessage ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}>
          <div style={{ color: 'var(--success)', fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>
            ✓ Link Dispatched
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
            {sentMessage}
          </p>
          <Button fullWidth onClick={onClose} variant="secondary">
            Return to Login
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Enter your registered email address. We will transmit an encrypted credential recovery link.
          </p>

          <Input
            label="Corporate / Personal Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@fintech.io"
            required
            error={error}
          />

          <div style={{ display: 'flex', gap: '10px', marginTop: 'var(--space-2)' }}>
            <Button type="button" variant="ghost" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading} style={{ flex: 2 }}>
              Send Recovery Link
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
