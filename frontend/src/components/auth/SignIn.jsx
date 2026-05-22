import { useState } from 'react';

import FloatingInput from '../common/FloatingInput';
import SocialButton from '../common/SocialButton';
import Divider from '../common/Divider';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import LeftPanel from '../layout/LeftPanel';

import { signIn } from '../../services/api';

import { BG_IMAGE, GOOGLE_ICON } from '../../data/constants';

export default function SignIn({ onSwitch }) {
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const [forgotMode, setForgotMode] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/v1/auth/reset-password',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
         },

          body: JSON.stringify({
            email,
            new_password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Reset failed');
      }

      alert('Password reset successful');

      setForgotMode(false);

      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    };

  const onSuccess = () => {
    alert('Login Successful');
  };

  return (
    <div className="saas-root">
      <Header />

      <main className="auth-main">
        <LeftPanel
          image={BG_IMAGE}
          title="Precision in every packet."
          subtitle="Experience the next generation of secure cloud infrastructure."
        />

        <section className="auth-right">
          <div className="glass-card">
            <div className="card-header">
              <h2 className="card-title">
                {forgotMode ? 'Reset Password' : 'Welcome Back'}
              </h2>

              <p className="card-subtitle">
                {forgotMode
                  ? 'Enter your email and new password: '
                  : 'Access your dashboard'}
              </p>
            </div>

            <div className="auth-form">
              <FloatingInput
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <FloatingInput
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* ERROR MESSAGE */}
              {error && (
                <p
                  style={{
                    color: '#ff6b6b',
                    fontSize: '14px',
                  }}
                >
                  {error}
                </p>
              )}

              {forgotMode ? (
                <a href="#" className="forgot-link">
                  Remember your password?
                </a>
              ) : (
                <a
                  href="#"
                  className="forgot-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setForgotMode(!forgotMode);
                  }}
                >
                  Forgot password?
                </a>
              )}

              <button
                className="btn-primary"
                onClick={forgotMode ? handleResetPassword : handleSubmit}
                disabled={loading}
              >
                {loading
                  ? forgotMode
                    ? 'Resetting...'
                    : 'Signing In...'
                  : forgotMode
                    ? 'Reset Password'
                    : 'Sign In'}
              </button>
            </div>

            <Divider text="OR CONTINUE WITH" />

            <div className="social-grid">
              <SocialButton icon={GOOGLE_ICON} text="Google" image />

              <SocialButton icon="terminal" text="GitHub" />
            </div>

            <p className="card-footer-text">
              New User?
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();

                  onSwitch('signup');
                }}
              >
                Create Account
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
