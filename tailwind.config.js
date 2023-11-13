/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    fontFamily:{
      sans:["Mulish"]
      },
    extend: {
      colors:{
        "black":"#25313C",
        "extra-light-grey":"#DAE3EA",
        "light-grey":"#6D7D8B",
        "purple":"#811870",
        "green":"#188170"
      },
     
      fontSize:{
        heading:["2.8125rem",{
          lineHeight:"150.6%"
        }],
        paragraph:["1.375rem",{
          lineHeight:"150.6%"
        }]
      }
    },
  },
  
  plugins: [],
}

