/** @type {import(***REMOVED***tailwindcss***REMOVED***).Config} */
export default {
  content: [
    ***REMOVED***./index.html***REMOVED***,
    ***REMOVED***./src/**/*.{js,jsx,ts,tsx}***REMOVED***,
    ***REMOVED***./node_modules/@axdspub/**/*.{js,jsx,ts,tsx}***REMOVED***
  ],
  theme: {
    extend: {
      animation: {
        ***REMOVED***fade-in***REMOVED***: ***REMOVED***fade-in 0.2s ease-in***REMOVED***,
        ***REMOVED***slide-in***REMOVED***: ***REMOVED***slide-in 0.2s ease-in***REMOVED***,
      },
      keyframes: {
        ***REMOVED***fade-in***REMOVED***: {
          ***REMOVED***0%***REMOVED***: { opacity: 0 },
          ***REMOVED***100%***REMOVED***: { opacity: 1 },
        },
        ***REMOVED***slide-in***REMOVED***: {
          ***REMOVED***0%***REMOVED***: { transform: ***REMOVED***translateX(-100%)***REMOVED*** },
          ***REMOVED***100%***REMOVED***: { transform: ***REMOVED***translateX(0)***REMOVED*** },
        },
      },
    }
  },
  plugins: []
}
