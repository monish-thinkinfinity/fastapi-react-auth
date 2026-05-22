import { useState } from 'react';

import visible from '../../assets/view.png';
import hide from '../../assets/hide.png';

export default function FloatingInput(props) {
  const { id, label, type = 'text', value, onChange } = props;

  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';

  return (
    <div className="input-wrapper">
      <input
        id={id}
        name={id}
        type={isPassword ? (showPassword ? 'text' : 'password') : type}
        placeholder=" "
        value={value}
        onChange={onChange}
        autoComplete="off"
        className={isPassword ? 'password-input' : ''}
      />

      <label htmlFor={id}>{label}</label>

      {isPassword && (
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <img src={hide} alt="Hide" />
          ) : (
            <img src={visible} alt="Show" />
          )}
        </button>
      )}
    </div>
  );
}
