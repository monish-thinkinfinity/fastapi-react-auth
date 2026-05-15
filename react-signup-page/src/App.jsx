import { useState } from 'react';

import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';

import './styles/global.css';
import './styles/auth.css';

export default function App() {
  const [page, setPage] = useState('signin');

  return (
    <>
      {page === 'signin' ? (
        <SignIn onSwitch={setPage} />
      ) : (
        <SignUp onSwitch={setPage} />
      )}
    </>
  );
}
