import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Toast from './components/Toast.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LoanEligibility from './pages/LoanEligibility.jsx';
import EmiCalculator from './pages/EmiCalculator.jsx';
import FinancialHealth from './pages/FinancialHealth.jsx';
import AiAdvisor from './pages/AiAdvisor.jsx';
import Reports from './pages/Reports.jsx';
import ProfileSettings from './pages/ProfileSettings.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import { auth } from './firebase/firebase.js';

export default function App() {
  const [currentUser, setCurrentUser] = useState(auth.getCurrentUser());
  const [currentRoute, setCurrentRoute] = useState('landing');
  const [toast, setToast] = useState({ message: '', type: 'info' });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleNavigate = (route) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await auth.logout();
    setCurrentUser(null);
    setCurrentRoute('landing');
    showToast('Signed out successfully.', 'info');
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentRoute('dashboard');
    showToast(`Welcome back, ${user.displayName || 'User'}!`, 'success');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Ambient background mesh glow */}
      <div
        style={{
          position: 'fixed',
          top: '-150px',
          left: '20%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '-150px',
          right: '15%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Top Navigation */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        user={currentUser}
        onLogout={handleLogout}
        onOpenSettings={() => handleNavigate('settings')}
      />

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          padding: currentRoute === 'landing' ? '0' : 'var(--space-8) var(--space-6)',
          maxWidth: currentRoute === 'landing' ? '100%' : '1360px',
          margin: '0 auto',
          width: '100%',
          position: 'relative',
          zIndex: 1
        }}
      >
        {currentRoute === 'landing' && (
          <LandingPage
            onGetStarted={() => handleNavigate('eligibility')}
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === 'dashboard' && (
          <Dashboard
            onNavigate={handleNavigate}
            onToast={showToast}
          />
        )}

        {currentRoute === 'eligibility' && (
          <LoanEligibility
            onNavigate={handleNavigate}
            onToast={showToast}
          />
        )}

        {currentRoute === 'emi' && (
          <EmiCalculator
            onToast={showToast}
          />
        )}

        {currentRoute === 'health' && (
          <FinancialHealth
            onNavigate={handleNavigate}
            onToast={showToast}
          />
        )}

        {currentRoute === 'advisor' && (
          <AiAdvisor
            onToast={showToast}
          />
        )}

        {currentRoute === 'reports' && (
          <Reports
            onNavigate={handleNavigate}
            onToast={showToast}
          />
        )}

        {currentRoute === 'settings' && (
          <ProfileSettings
            onLogout={handleLogout}
            onToast={showToast}
          />
        )}

        {currentRoute === 'login' && (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onNavigateToRegister={() => setCurrentRoute('register')}
          />
        )}

        {currentRoute === 'register' && (
          <Register
            onRegisterSuccess={handleLoginSuccess}
            onNavigateToLogin={() => setCurrentRoute('login')}
          />
        )}
      </main>

      {/* Global Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />
    </div>
  );
}
