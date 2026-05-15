import { useState } from 'react';

import FloatingInput from '../common/FloatingInput';
import PasswordStrength from '../common/PasswordStrength';
import SocialButton from '../common/SocialButton';
import Divider from '../common/Divider';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import LeftPanel from '../layout/LeftPanel';

import { BG_IMAGE, GOOGLE_ICON } from '../../data/constants';

export default function SignUp({ onSwitch }) {
  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [agreed, setAgreed] = useState(false);

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

              <button className="btn-primary">Create Account</button>
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
