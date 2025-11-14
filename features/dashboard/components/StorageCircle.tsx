"use client";

import { useEffect, useState } from "react";

type Props = {
  totalUsed?: number;
  maxStorage?: number;
  isPending?: boolean;
};

const formatGB = (bytes: number = 0) => {
  return (bytes / 1024 / 1024 / 1024).toFixed(2);
};

const StorageCircle = ({ totalUsed = 0, maxStorage = 1, isPending }: Props) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  const percentage = Math.min((totalUsed / maxStorage) * 100, 100);

  // Animasi hanya jika tidak loading
  useEffect(() => {
    if (isPending) return;

    const startTime = Date.now();
    const duration = 900;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedPercentage(percentage * eased);

      if (progress < 1) requestAnimationFrame(animate);
    };

    animate();
  }, [percentage, isPending]);

  const size = 130;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Kalau loading → jangan gerakkan stroke, tetap default
  const offset = isPending
    ? circumference
    : circumference - (animatedPercentage / 100) * circumference;

  return (
    <div className="rounded-[20px] p-6 shadow-lg bg-blue-600">
      <div className="flex items-center gap-6">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={strokeWidth}
            />

            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#ffffff"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="text-2xl font-bold">
              {isPending ? "..." : Math.round(animatedPercentage) + "%"}
            </div>
            <div className="text-sm opacity-80">Used</div>
          </div>
        </div>

        <div className="text-white">
          <div className="text-lg font-semibold mb-1">Storage</div>

          <div className="text-sm opacity-90">
            {isPending
              ? "Loading..."
              : `${formatGB(totalUsed)} GB / ${formatGB(maxStorage)} GB`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageCircle;
