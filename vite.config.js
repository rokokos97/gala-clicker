import { defineConfig } from 'vite'
import {viteStaticCopy} from 'vite-plugin-static-copy'

export default defineConfig({
    base:'https://lisovyi.eu/',
    plagins: [viteStaticCopy({
        targets: [
            { src: 'assets', dest: 'dist/assets' },
            { src: 'index.html', dest: 'dist' },
        ],
    })],
})