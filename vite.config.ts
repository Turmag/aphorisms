import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    base: '/aphorisms/',
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
