import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(), // if you’re using React
    tailwindcss(), // <-- this invokes Tailwind’s PostCSS pipeline for you
  ],
});
