import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// IMPORTANT: set `base` to your repo name for GitHub Pages.
// If this repo is named "otherly", base is "/otherly/".
// If you deploy to a custom domain or a user/org page (username.github.io),
// set base to '/' instead.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/otherly/',
});
