import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(({ mode }: { mode: string }) => ({
    base: '/aphorisms/',
    css: { modules: { generateScopedName: mode === 'development' ? '' : '[hash:base64:8]' } },
    plugins: [vue()],
    resolve: { alias: { '@': path.resolve(__dirname, './src') } },
    server: {
        proxy: {
            '/api': {
                changeOrigin: true,
                rewrite: (path: string) => path.replace(/^\/api/, ''),
                target: 'https://focusinfo.ru/aphorisms/api',
            },
        },
    },
}));
