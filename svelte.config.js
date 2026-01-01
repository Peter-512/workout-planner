import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	compilerOptions: {
		experimental: {
			async: true
		}
	},
	kit: {
		alias: { '@/*': './path/to/lib/*' },
		experimental: { remoteFunctions: true },
		// Using adapter-vercel with edge runtime
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			runtime: 'edge'
		})
	},
	vitePlugin: {
		inspector: {
			toggleKeyCombo: 'control-alt-shift-meta-s'
		}
	}
};

export default config;
