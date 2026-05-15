import { useState } from 'react';

import FloatingInput from '../common/FloatingInput';
import SocialButton from '../common/SocialButton';
import Divider from '../common/Divider';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import LeftPanel from '../layout/LeftPanel';

import { BG_IMAGE, GOOGLE_ICON } from '../../data/constants';

export default function SignIn({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
              <h2 className="card-title">Welcome Back</h2>

              <p className="card-subtitle">Access your dashboard</p>
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

              <button className="btn-primary">Sign In</button>
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
