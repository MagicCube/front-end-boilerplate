import { createRoot } from 'react-dom/client';

import { App } from './app';

const rootElement = document.getElementById('mount-point');

if (!rootElement) {
  throw new Error('React mount point element #mount-point not found.');
}

const root = createRoot(rootElement);
root.render(<App />);
