import * as path from "path"
import {defineConfig} from "vite"
import {viteCommonjs} from "@originjs/vite-plugin-commonjs"

import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [viteCommonjs(), react()],
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
})
