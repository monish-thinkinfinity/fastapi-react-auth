export default function LeftPanel({ title, subtitle, image }) {
  return (
    <section className="auth-left">
      <img src={image} alt="" />

      <div className="gradient-overlay" />

      <div className="auth-left-content">
        <h2 className="left-headline">{title}</h2>

        <p className="left-subtext">{subtitle}</p>
      </div>
    </section>
  );
}
