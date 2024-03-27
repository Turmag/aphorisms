import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }: { mode: string }) => {
    return {
        plugins: [vue()],
        base: '/aphorisms/',
        resolve: { alias: { '@': path.resolve(__dirname, './src') } },
        server: {
            proxy: {
                '/api': {
                    target: 'https://focusinfo.ru/aphorisms/api',
                    changeOrigin: true,
                    rewrite: (path: string) => path.replace(/^\/api/, ''),
                },
            },
        },
        css: { modules: { generateScopedName: mode === 'development' ? '' : '[hash:base64:8]' } },
    };
});
