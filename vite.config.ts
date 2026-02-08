import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // For GitHub Pages: if repo name is "valentine's-magical-gift", base would be "/valentine's-magical-gift/"
    // Set GITHUB_REPOSITORY_NAME env var or leave empty for root domain
    // In local dev, base is '/' (empty), in GitHub Pages build it will be set via env var
    const base = process.env.GITHUB_REPOSITORY_NAME 
      ? `/${process.env.GITHUB_REPOSITORY_NAME}/` 
      : '/';
    
    return {
      base,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
