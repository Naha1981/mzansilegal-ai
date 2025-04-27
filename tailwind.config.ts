import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
        // Custom keyframes for animations
        keyframes: {
           "fade-in": {
             from: { opacity: '0', transform: 'translateY(10px)' },
             to: { opacity: '1', transform: 'translateY(0)' },
           },
           shimmer: {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(100%)' },
            },
            pulse: { // Re-add pulse for the disclaimer button
              '50%': { opacity: '.7' },
            },
            'accordion-down': { // Keep accordion animations if used elsewhere
               from: { height: "0" },
               to: { height: "var(--radix-accordion-content-height)" },
             },
             'accordion-up': {
               from: { height: "var(--radix-accordion-content-height)" },
               to: { height: "0" },
             },
         },
         // Custom animations
         animation: {
           "fade-in": 'fade-in 0.6s ease-out forwards',
           shimmer: 'shimmer 1.5s infinite linear',
           pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', // Re-add pulse
           "accordion-down": "accordion-down 0.2s ease-out", // Keep accordion
           "accordion-up": "accordion-up 0.2s ease-out",     // Keep accordion
         },
         // Define HSL colors based on globals.css for Tailwind utilities (optional but good practice)
         colors: {
             border: 'hsl(var(--border))',
             input: 'hsl(var(--input))',
             ring: 'hsl(var(--ring))',
             background: 'hsl(var(--background))',
             foreground: 'hsl(var(--foreground))',
             primary: {
               DEFAULT: 'hsl(var(--primary))',
               foreground: 'hsl(var(--primary-foreground))',
             },
             secondary: {
               DEFAULT: 'hsl(var(--secondary))',
               foreground: 'hsl(var(--secondary-foreground))',
             },
             destructive: {
               DEFAULT: 'hsl(var(--destructive))',
               foreground: 'hsl(var(--destructive-foreground))',
             },
             muted: {
               DEFAULT: 'hsl(var(--muted))',
               foreground: 'hsl(var(--muted-foreground))',
             },
             accent: {
               DEFAULT: 'hsl(var(--accent))',
               foreground: 'hsl(var(--accent-foreground))',
             },
             popover: {
               DEFAULT: 'hsl(var(--popover))',
               foreground: 'hsl(var(--popover-foreground))',
             },
             card: {
               DEFAULT: 'hsl(var(--card))',
               foreground: 'hsl(var(--card-foreground))',
             },
           },
           borderRadius: {
               lg: "var(--radius)", // Use variable for consistency
               md: "calc(var(--radius) - 4px)",
               sm: "calc(var(--radius) - 8px)",
               xl: "calc(var(--radius) + 4px)", // Add xl if needed elsewhere
              '2xl': "calc(var(--radius) + 12px)", // Add 2xl if needed elsewhere
              '3xl': "calc(var(--radius) + 16px)", // Add 3xl if needed elsewhere
              '28px': '28px', // Specific radius for card
           },
          boxShadow: { // Add custom shadows if needed
             'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
             '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
             // Add glow effect shadow
             'glow-primary': '0 0 15px 5px hsla(var(--primary) / 0.3)',
             'glow-destructive': '0 0 15px 5px hsla(var(--destructive) / 0.4)',
           },
           dropShadow: { // Add custom drop shadows
                'lg': '0 10px 8px rgba(0, 0, 0, 0.04)',
                'xl': '0 20px 13px rgba(0, 0, 0, 0.03)',
                '2xl': '0 25px 25px rgba(0, 0, 0, 0.15)',
                'primary': '0 2px 4px hsla(var(--primary) / 0.4)',
            },
            backdropBlur: { // Add blur for glassmorphism
              'sm': '4px',
              'md': '8px',
              'lg': '12px',
            },
  	}
  },
   plugins: [
     require("tailwindcss-animate"),
     require("@tailwindcss/typography"), // Add typography plugin
   ],
} satisfies Config;
