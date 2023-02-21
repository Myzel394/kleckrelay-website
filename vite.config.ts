import * as path from "path"
import {defineConfig} from "vite"
import htmlPlugin from "vite-plugin-html-config"
import viteSvgr from "vite-plugin-svgr"

import {viteCommonjs} from "@originjs/vite-plugin-commonjs"
import react from "@vitejs/plugin-react"

const isProduction = process.env.NODE_ENV === "production"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		viteCommonjs(),
		react(),
		viteSvgr(),
		htmlPlugin({
			metas: [
				isProduction && {
					"http-equiv": "Content-Security-Policy",
					content: "upgrade-insecure-requests",
				},
			].filter(Boolean),
		}),
	],
	resolve: {
		alias: {
			"~": path.resolve(__dirname, "src"),
		},
	},
	build: {
		commonjsOptions: {
			defaultIsModuleExports(id) {
				try {
					const module = require(id)
					if (module?.default) {
						return false
					}
					return "auto"
				} catch (error) {
					return "auto"
				}
			},
			transformMixedEsModules: true,
		},
		minify: false,
	},
	esbuild: {
		minifySyntax: false,
	},
})
