export default function Divider({ text = 'OR' }) {
  return (
    <div className="divider">
      <div className="divider-line" />
      <span className="divider-text">{text}</span>
      <div className="divider-line" />
    </div>
  );
}
