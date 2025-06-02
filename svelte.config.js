import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

const dev = process.env.NODE_ENV === 'development';
const repoName = 'final-project-chemicalprocesses';

export default {
  kit: {
    adapter: adapter(),
    paths: {
      base: dev ? '' : `/${repoName}`,
    }
  },
  preprocess: vitePreprocess()
};
