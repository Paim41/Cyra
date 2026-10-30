"use client";
import { useId } from "react";
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  const id = useId();
  return (
    <div className="segmented" role="group" aria-label={label}>
      <span
        className="segment-indicator"
        style={{
          width: `calc((100% - 6px) / ${options.length})`,
          transform: `translateX(${options.indexOf(value) * 100}%)`,
        }}
      />
      {options.map((option) => (
        <button
          key={option}
          id={`${id}-${option}`}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
