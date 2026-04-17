/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      colors: {
        stetho: {
          /* Softer off-white for extreme eye comfort. Avoids harsh #FFFFFF */
          bg: '#fcfcfc',
          sidebar: '#f5f5f7',
          border: '#e5e5e7',
          borderHover: '#d1d1d6',
          text: '#333336', /* Softer off-black instead of pure #000000 */
          textMuted: '#8e8e93',
          hover: '#ebebeb',
          criticalLight: '#fff3f3',
          criticalBorder: '#ffe5e5',
          
          /* Softer, warm dark mode. Avoids harsh #000000 */
          darkBg: '#1c1c1e',
          darkSidebar: '#151516',
          darkBorder: '#38383a',
          darkBorderHover: '#525255',
          darkText: '#e5e5ea', /* Softer off-white instead of pure #FFFFFF */
          darkTextMuted: '#8e8e93',
          darkHover: '#262628',
          darkCriticalLight: '#3a1717',
          darkCriticalBorder: '#5e2121',
        },
        status: {
          normal: '#34c759',
          critical: '#ff3b30',
          warning: '#ffcc00',
          
          darkNormal: '#30d158',
          darkCritical: '#ff453a',
          darkWarning: '#ffd60a'
        }
      }
    },
  },
  plugins: [],
}
