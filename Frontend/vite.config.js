import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //get rid of the cores error
  server:{
    port:7777,
  proxy: {
    "/api": {
      target: "http://localhost:5002",
      changeOrigin: true,
      secure: false,
      // rewrite: (path) => path.replace(/^\/api/, '')
    },
  },
},
})
