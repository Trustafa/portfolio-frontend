import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { LensDashboard } from './components/generated/LensDashboard.tsx';
import { SimpleLogin } from './components/generated/AuthScreen.tsx'; 

// Force light mode
document.documentElement.classList.remove('dark');

const forceLightMode = () => {
  document.documentElement.classList.toggle('dark', false);
};

// Broken image handler
const addBrokenImageHandler = () => {
  document.addEventListener(
    'error',
    function (e) {
      if (e.target instanceof HTMLImageElement) {
        const img = e.target;
        if (!img.dataset.fallbackApplied) {
          img.dataset.fallbackApplied = 'true';

          const fallbackSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E`;
          img.src = fallbackSvg;
          img.classList.add('broken-image-fallback');
          if (!img.alt || img.alt.trim() === '') {
            img.alt = 'Image not available';
          }
        }
      }
    },
    true
  );
};

// Run immediately
forceLightMode();
addBrokenImageHandler();
document.addEventListener('DOMContentLoaded', forceLightMode);

// Override system preference changes
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
mediaQuery.addEventListener('change', forceLightMode);

// Render the app with routing
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SimpleLogin />} />
        <Route path="/lensdashboard" element={<LensDashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
