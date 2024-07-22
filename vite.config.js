import { defineConfig } from 'vite'
import viteStaticCopy from 'vite-plugin-static-copy'

export default defineConfig({
    base: '/gala-clicker/',
    plagins: [
        viteStaticCopy({
            target: [
                {src: 'assets/*',
                    dist:'assets'
                }
            ]
        })
    ]
})