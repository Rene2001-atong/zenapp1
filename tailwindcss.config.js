// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
// /** @type {import('tailwindcss').Config} */
// export default  {
//   content: ['./src/**/*.{html,js}'],
//   theme: {
//     colors: {
//       'blue': '#1fb6ff',
//       'purple': '#7e5bef',
//       'pink': '#ff49db',
//       'orange': '#ff7849',
//       'green': '#13ce66',
//       'yellow': '#ffc82c',
//       'gray-dark': '#273444',
//       'gray': '#8492a6',
//       'gray-light': '#d3dce6',
//     },
//     fontFamily: {
//       sans: ['Graphik', 'sans-serif'],
//       serif: ['Merriweather', 'serif'],
//     },
//     extend: {
//       spacing: {
//         '8xl': '96rem',
//         '9xl': '128rem',
//       },
//       borderRadius: {
//         '4xl': '2rem',
//       }
//     }
//   },
// }

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // C'est la ligne la plus importante
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}