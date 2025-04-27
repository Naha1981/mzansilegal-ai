import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // Keep in case other components use Tailwind
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
        // Removed color definitions as they are now in globals.css
        // Removed borderRadius extensions
        // Removed keyframes and animations not part of the new static CSS
        // Removed backgroundSize
        // Removed typography styles (plugin handles this if added back)
  	}
  },
  plugins: [require("tailwindcss-animate")], // Removed typography plugin
} satisfies Config;
