import React from 'react';
import './escaladeLoader.module.css';

export default function EscaladeLoader() {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
        fill="none"
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0000ff" stopOpacity={1} />
          <stop offset="100%" stopColor="#6859cc" stopOpacity={1} />
        </linearGradient>
      </defs>

      <g>
        <path d="M 50,100 A 1,1 0 0 1 50,0" />
      </g>
      <g>
        <path d="M 50,75 A 1,1 0 0 0 50,-25" />
      </g>
    </svg>
  );
}
