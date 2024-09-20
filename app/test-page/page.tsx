'use client';

import React from 'react';
import { create } from './actions';

export default function TestPage() {
  return (
    <div>
      <h1>Test Page</h1>
      <button
        className="button"
        onClick={() => {
          create();
        }}
      >
        Test Button
      </button>
    </div>
  );
}
