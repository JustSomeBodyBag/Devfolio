import React, { useState, useEffect } from "react";

interface ColorPickerProps {
  color: string; // #RRGGBB
  onChange: (color: string) => void;
}

function hexToRgb(hex: string) {
  hex = hex.replace(/^#/, "");
  const bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

const clamp = (value: number) => Math.min(255, Math.max(0, value));

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [r, setR] = useState(0);
  const [g, setG] = useState(0);
  const [b, setB] = useState(0);

  useEffect(() => {
    const { r, g, b } = hexToRgb(color);
    setR(r);
    setG(g);
    setB(b);
  }, [color]);

  const updateColor = (r: number, g: number, b: number) => {
    onChange(rgbToHex(r, g, b));
  };

  // Генерация градиентов для слайдеров
  const rGradient = `linear-gradient(to right, rgb(0,${g},${b}), rgb(255,${g},${b}))`;
  const gGradient = `linear-gradient(to right, rgb(${r},0,${b}), rgb(${r},255,${b}))`;
  const bGradient = `linear-gradient(to right, rgb(${r},${g},0), rgb(${r},${g},255))`;

  const handleChange = (
    channel: "r" | "g" | "b",
    value: number
  ) => {
    value = clamp(value);
    if (channel === "r") {
      setR(value);
      updateColor(value, g, b);
    }
    if (channel === "g") {
      setG(value);
      updateColor(r, value, b);
    }
    if (channel === "b") {
      setB(value);
      updateColor(r, g, value);
    }
  };

  return (
    <div className="space-y-4">
      {["r", "g", "b"].map((channel) => {
        const val = channel === "r" ? r : channel === "g" ? g : b;
        const gradient =
          channel === "r" ? rGradient : channel === "g" ? gGradient : bGradient;
        const label = channel.toUpperCase();

        return (
          <div key={channel} className="flex items-center space-x-3">
            <label
              htmlFor={`${channel}-range`}
              className="w-6 font-semibold text-gray-700 dark:text-gray-300"
            >
              {label}
            </label>
            <input
              type="range"
              id={`${channel}-range`}
              min={0}
              max={255}
              value={val}
              onChange={(e) => handleChange(channel as any, Number(e.target.value))}
              style={{ background: gradient }}
              className="flex-grow h-5 rounded-md appearance-none cursor-pointer"
            />
            <input
              type="number"
              min={0}
              max={255}
              value={val}
              onChange={(e) => handleChange(channel as any, Number(e.target.value))}
              className="w-14 p-1 text-center rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        );
      })}

      <div
        aria-label="Цвет предпросмотра"
        className="w-full h-16 rounded-md border border-gray-300 dark:border-gray-600"
        style={{ backgroundColor: rgbToHex(r, g, b) }}
      />
    </div>
  );
};

export default ColorPicker;
