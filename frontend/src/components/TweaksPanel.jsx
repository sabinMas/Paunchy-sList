import { useState } from 'react';
import '../styles/tweaks.css';

export function TweaksPanel({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && (
        <button
          className="tweaks-toggle"
          onClick={() => setOpen(true)}
          title="Customize design"
        >
          ⚙️
        </button>
      )}
      {open && (
        <div className="tweaks-panel">
          <div className="tweaks-header">
            <span className="tweaks-title">Tweaks</span>
            <button
              className="tweaks-close"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>
          <div className="tweaks-body">
            {children}
          </div>
        </div>
      )}
    </>
  );
}

export function TweakSection({ title, children }) {
  return (
    <div className="tweak-section">
      <div className="tweak-section-title">{title}</div>
      {children}
    </div>
  );
}

export function TweakColor({ label, value, options, onChange }) {
  return (
    <div className="tweak-row">
      <label className="tweak-label">{label}</label>
      <div className="tweak-color-options">
        {options.map((color) => (
          <button
            key={color}
            className={`tweak-color-swatch ${value === color ? 'active' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}

export function TweakRadio({ label, value, options, onChange }) {
  return (
    <div className="tweak-row">
      <label className="tweak-label">{label}</label>
      <div className="tweak-radio-group">
        {options.map((option) => (
          <label key={option.value} className="tweak-radio-option">
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
