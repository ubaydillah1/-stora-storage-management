// Created By AI
"use client";

import React, { useEffect, useState } from "react";

const StorageCircle = ({
  used = 83,
  total = 128,
  unit = "GB",
  circleSize = 130,
  strokeWidth = 8,
  backgroundColor = "oklch(0.623 0.214 259.815)",
  strokeColor = "#ffffff",
  textColor = "#ffffff",
  animationDuration = 1000,
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const percentage = Math.round((used / total) * 100);

  useEffect(() => {
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedPercentage(percentage * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [percentage, animationDuration]);

  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (animatedPercentage / 100) * circumference;
  const center = circleSize / 2;

  return (
    <div className="rounded-[20px] p-6 shadow-lg" style={{ backgroundColor }}>
      <div className="flex items-center gap-6">
        <div
          className="relative"
          style={{ width: circleSize, height: circleSize }}
        >
          <svg
            width={circleSize}
            height={circleSize}
            className="transform -rotate-90"
          >
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 0.1s ease-out",
              }}
            />
          </svg>

          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
            style={{ color: textColor }}
          >
            <div className="text-2xl font-bold">
              {Math.round(animatedPercentage)}%
            </div>
            <div className="text-sm font-medium opacity-90">Space used</div>
          </div>
        </div>

        <div style={{ color: textColor }}>
          <div className="text-md md:text-lg font-semibold mb-1">
            Available Storage
          </div>
          <div className="text-sm opacity-90">
            {used}
            {unit} / {total}
            {unit}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageCircle;
