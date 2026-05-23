const Star = ({ filled, half, size, onClick, onHover }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    onClick={onClick}
    onMouseEnter={onHover}
    style={{ cursor: onClick ? "pointer" : "default", flexShrink: 0 }}
  >
    <defs>
      <linearGradient id={`half-${size}`}>
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#E8E2D9" />
      </linearGradient>
    </defs>
    <polygon
      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      fill={filled ? "#F59E0B" : half ? `url(#half-${size})` : "#E8E2D9"}
      stroke="#F59E0B"
      strokeWidth="1"
      strokeLinejoin="round"
    />
  </svg>
);

const StarRating = ({
  value = 0,
  onChange,
  size = 20,
  showCount = false,
  count = 0,
}) => {
  const [hovered, setHovered] = useState(null);
  const display = hovered ?? value;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <div
        style={{ display: "flex", gap: 2 }}
        onMouseLeave={() => onChange && setHovered(null)}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={size}
            filled={n <= Math.floor(display)}
            half={
              !onChange &&
              n === Math.ceil(display) &&
              display % 1 >= 0.25 &&
              display % 1 < 0.75
            }
            onClick={
              onChange
                ? () => {
                    onChange(n);
                    setHovered(null);
                  }
                : undefined
            }
            onHover={onChange ? () => setHovered(n) : undefined}
          />
        ))}
      </div>
      {showCount && (
        <span style={{ fontSize: 13, color: "var(--ink-soft)", marginLeft: 4 }}>
          {value > 0 ? value.toFixed(1) : ""}
          {count > 0
            ? ` (${count} review${count !== 1 ? "s" : ""})`
            : " No reviews yet"}
        </span>
      )}
    </div>
  );
};

import { useState } from "react";
export default StarRating;
