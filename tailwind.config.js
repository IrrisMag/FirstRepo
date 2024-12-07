/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs", // Path to your EJS files
    /**"./public/**/*.{html,css}", // Adjust this to match your project structure*/
    /**"./src/**/*.js" // Include any other directories where Tailwind classes are used*/
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
};

