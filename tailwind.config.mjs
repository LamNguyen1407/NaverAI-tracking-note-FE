/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Thêm "./src/**/..." nếu bạn code trong thư mục src
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"), // 👈 THÊM PLUGIN VÀO ĐÂY
  ],
};

export default config;
