export default function PasswordStrength({ password }) {
  const len = password.length;

  const strength =
    len === 0 ? 0 : len < 6 ? 1 : len < 10 ? 2 : len < 14 ? 3 : 4;

  const labels = ['', 'Weak', 'Fair', 'Strong', 'Very Strong'];

  return (
    <div>
      <div className="strength-bars">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`strength-bar ${i <= strength ? 'active' : ''}`}
          />
        ))}
      </div>

      {strength > 0 && (
        <p className="strength-label">{labels[strength]} Password</p>
      )}
    </div>
  );
}
