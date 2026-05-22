export default function SocialButton({ icon, text, image = false }) {
  return (
    <button className="social-btn">
      {image ? (
        <img src={icon} alt={text} />
      ) : (
        <span className="mat-icon material-symbols-outlined">{icon}</span>
      )}

      <span>{text}</span>
    </button>
  );
}
