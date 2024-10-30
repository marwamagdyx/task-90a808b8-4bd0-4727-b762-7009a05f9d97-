import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { partytownVite } from '@builder.io/partytown/utils';
import { join } from 'path';

export default defineConfig({
  plugins: [
    sveltekit(),
    partytownVite({
      dest: join(process.cwd(), 'static', '~partytown')
    })
  ],
  server: {
    host: '0.0.0.0',  // This allows external connections
    port: 5173        // Default Vite port
  }
});