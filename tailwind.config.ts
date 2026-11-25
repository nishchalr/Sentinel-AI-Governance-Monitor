import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { colors: { matte: "#060709", surface: "#0d1117", border: "#30363d", critical: "#d90429", tactical: "#fca311", cyber: "#00ff41", cyan: "#00c3ff" } } },
  plugins: []
} satisfies Config;
