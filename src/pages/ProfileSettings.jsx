import React, { useState } from 'react';
import {
  User,
  Key,
  Database,
  Shield,
  FileSpreadsheet,
  Moon,
  Sun,
  Save,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  LogOut
} from 'lucide-react';
import GlassCard from '../components/GlassCard.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { storageService } from '../services/storageService.js';
import { googleSheetsService } from '../services/googleSheetsService.js';
import { auth } from '../firebase/firebase.js';

export default function ProfileSettings({ onLogout, onToast }) {
  const [profile, setProfile] = useState(storageService.getUserProfile());
  const [settings, setSettings] = useState(storageService.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleProfileChange = (field, val) => {
    setProfile(prev => ({ ...prev, [field]: val }));
  };

  const handleSettingsChange = (field, val) => {
    setSettings(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    storageService.saveUserProfile(profile);
    storageService.saveSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    if (onToast) onToast('Settings & Profile saved securely.', 'success');
  };

  const handleExportCSV = () => {
    const csv = googleSheetsService.exportToCSV();
    if (!csv) {
      if (onToast) onToast('No synced Google Sheets records found in buffer yet.', 'warning');
      return;
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GoogleSheets_Sync_Records_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onToast) onToast('Exported Google Sheets records as CSV.', 'success');
  };

  const handleResetDefaults = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            <Shield size={16} />
            <span>Account, Security & Integrations</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Settings & Configuration
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Manage client identity, Google Sheets cloud endpoints, Gemini API keys, and session parameters.
          </p>
        </div>

        <Button
          variant="danger"
          size="sm"
          icon={LogOut}
          onClick={onLogout}
        >
          Sign Out
        </Button>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Profile Card */}
        <GlassCard padding="var(--space-6)">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-5)', borderBottom: '1px solid var(--border-glass)', paddingBottom: 'var(--space-3)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'rgba(37, 99, 235, 0.15)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Client Identity & Default Portfolio</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
            <Input
              label="Full Legal Name"
              value={profile.name}
              onChange={(e) => handleProfileChange('name', e.target.value)}
              required
            />

            <Input
              label="Contact Email"
              type="email"
              value={profile.email}
              onChange={(e) => handleProfileChange('email', e.target.value)}
              required
            />

            <Input
              label="Occupation"
              value={profile.occupation}
              onChange={(e) => handleProfileChange('occupation', e.target.value)}
              required
            />

            <Input
              label="Base Credit Score"
              type="number"
              value={profile.creditScore}
              onChange={(e) => handleProfileChange('creditScore', Number(e.target.value))}
              min="300"
              max="900"
              required
              isMono
            />
          </div>
        </GlassCard>

        {/* Gemini API Key */}
        <GlassCard padding="var(--space-6)">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-glass)', paddingBottom: 'var(--space-3)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Key size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Google Gemini 2.0 / 1.5 Flash API Key</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Optional: Connects live Google Cloud AI models. If empty, the app utilizes built-in deterministic BFSI underwriting engine.</p>
            </div>
          </div>

          <Input
            label="Gemini API Key"
            type="password"
            value={settings.geminiApiKey}
            onChange={(e) => handleSettingsChange('geminiApiKey', e.target.value)}
            placeholder="AIzaSy..."
            helperText="Stored locally in your secure browser storage. Never sent to any third-party server."
          />
        </GlassCard>

        {/* Google Sheets Integration */}
        <GlassCard padding="var(--space-6)">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-glass)', paddingBottom: 'var(--space-3)', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'rgba(34, 197, 94, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Database size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Google Sheets Backend Integration</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Schema: User ID, Name, Email, Income, Expenses, EMI, Credit Score, Financial Score, Eligibility, Timestamp</p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={FileSpreadsheet}
              onClick={handleExportCSV}
            >
              Export Sync CSV
            </Button>
          </div>

          <Input
            label="Google Apps Script / Webhook URL"
            value={settings.googleSheetsWebhookUrl}
            onChange={(e) => handleSettingsChange('googleSheetsWebhookUrl', e.target.value)}
            placeholder="https://script.google.com/macros/s/.../exec"
            helperText="Every eligibility check is recorded with full 10-column schema. If left blank, records are preserved in local synchronization queue."
          />
        </GlassCard>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <Button
            type="button"
            variant="ghost"
            icon={RotateCcw}
            onClick={handleResetDefaults}
          >
            Reset All Portfolio Data
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={Save}
            style={{ minWidth: '220px' }}
          >
            {savedSuccess ? 'Changes Saved!' : 'Save Configuration'}
          </Button>
        </div>
      </form>
    </div>
  );
}
