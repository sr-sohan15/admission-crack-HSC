import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: "/admission-crack-HSC/", // গিটহ্যাব রিপোজিটরির নামের সাথে হুবহু মিল থাকতে হবে
})