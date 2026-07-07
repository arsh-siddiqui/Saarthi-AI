import React from "react";

export function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Swoosh (Blue) */}
      <path
        d="M20,50 A30,30 0 0,1 80,50"
        stroke="#0D6EFD"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Arrow Head (Blue) */}
      <path
        d="M20,50 L20,40 L30,50 Z"
        fill="#0D6EFD"
      />

      {/* Outer Swoosh (Green) */}
      <path
        d="M80,50 A30,30 0 0,1 20,50"
        stroke="#10B981"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Arrow Head (Green) */}
      <path
        d="M80,50 L80,60 L70,50 Z"
        fill="#10B981"
      />

      {/* Building icon */}
      <g fill="#111827">
        <rect x="42" y="30" width="16" height="4" rx="1" />
        <rect x="44" y="34" width="2" height="12" />
        <rect x="49" y="34" width="2" height="12" />
        <rect x="54" y="34" width="2" height="12" />
        <rect x="40" y="46" width="20" height="3" rx="0.5" />
      </g>

      {/* Winding Path / Road */}
      <path
        d="M50,49 C45,55 35,65 35,75 C35,80 40,85 50,85 C60,85 65,80 65,75 C65,65 55,55 50,49"
        fill="#111827"
      />
      
      {/* Road Markings */}
      <path
        d="M50,60 L48,68 M47,72 L45,80"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="2, 4"
      />
    </svg>
  );
}
