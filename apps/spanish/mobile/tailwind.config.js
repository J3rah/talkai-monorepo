module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: { 
    extend: { 
      colors: { 
        brand: { DEFAULT: "#111827", primary: "#0EA5E9" } 
      } 
    } 
  },
  plugins: [],
}


