import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import React from 'react';

// Unmount React trees between tests to avoid cross-test DOM leakage.
afterEach(() => cleanup());

// next/image renders a plain <img> under jsdom; strip Next-only props that React
// would warn about (priority, fill, etc.) so component assertions stay clean.
vi.mock('next/image', () => ({
  default: ({
    priority: _priority,
    fill: _fill,
    ...props
  }: Record<string, unknown>) => React.createElement('img', props),
}));
