import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuration minimale de Vite pour un projet React
// Le plugin @vitejs/plugin-react active le support du JSX et du Fast Refresh
// (mise à jour instantanée du navigateur sans rechargement lors du développement)
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    browser: 'C:\\Program Files\\Mozilla Firefox\\firefox.exe'
  }
})