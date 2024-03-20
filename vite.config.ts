import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    base: '/aphorisms/',
    resolve: { alias: { '@': path.resolve(__dirname, './src') } },
    server: {
        proxy: {
            '/api': {
                target: 'https://focusinfo.ru/aphorisms/api',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, ''),
            },
        },
    },
});
