import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	},
	build: {
		outDir: 'dist',
		rollupOptions: {
			input:  {main: path.resolve(__dirname, './src/main.tsx')},
			output: { dir: path.resolve(__dirname, './dist') }
		}
	}
});
