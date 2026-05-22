import { useState } from 'react';

import FloatingInput from '../common/FloatingInput';
import PasswordStrength from '../common/PasswordStrength';
import SocialButton from '../common/SocialButton';
import Divider from '../common/Divider';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import LeftPanel from '../layout/LeftPanel';

import { signUp } from '../../services/api';

import { BG_IMAGE, GOOGLE_ICON } from '../../data/constants';

export default function SignUp({ onSwitch }) {
  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [agreed, setAgreed] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const onSuccess = () => {
    alert('Account Created Successfully');
  };

  const handleSubmit = async () => {
    if (!agreed) return setError('Please agree to the terms to continue');

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return setError(
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
      );
    }

    setLoading(true);
    setError('');

    try {
      await signUp(name, email, password);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="saas-root">
      <Header />

      <main className="auth-main">
        <LeftPanel
          image={BG_IMAGE}
          title="Secure Infrastructure for the Next Generation"
          subtitle="Scale your developer operations with enterprise-grade security."
        />

        <section className="auth-right">
          <div className="glass-card">
            <div className="progress-bar" />

            <div className="card-header">
              <h2 className="card-title">Create Account</h2>

              <p className="card-subtitle">Get started in minutes.</p>
            </div>

            <div className="social-grid">
              <SocialButton icon={GOOGLE_ICON} text="Google" image />

              <SocialButton icon="terminal" text="GitHub" />
            </div>

            <Divider text="OR SIGN UP WITH EMAIL" />

            <div className="auth-form">
              <FloatingInput
                id="name"
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <FloatingInput
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div>
                <FloatingInput
                  id="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <PasswordStrength password={password} />
              </div>

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

              <label className="terms-label">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />

                <span>
                  I agree to the <a href="#">Terms of Service</a> and{' '}
                  <a href="#">Privacy Policy</a>
                </span>
              </label>

              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>

            <p className="card-footer-text">
              Already have an account?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();

                  onSwitch('signin');
                }}
              >
                Sign In
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
