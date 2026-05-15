export default function FloatingInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
}) {
  return (
    <div className="input-wrapper">
      <input
        id={id}
        name={id}
        type={type}
        placeholder=" "
        value={value}
        onChange={onChange}
        autoComplete="off"
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
