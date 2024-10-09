module.exports = {
  extends: [
    'next/core-web-vitals',
    'prettier',
    'plugin:eslint-plugin-next-on-pages/recommended',
    'plugin:@typescript-eslint/recommended'
  ], // Use Next.js and Prettier defaults
  plugins: ['tailwindcss', 'eslint-plugin-next-on-pages', '@typescript-eslint'], // Enable Tailwind CSS linting
  parser: '@typescript-eslint/parser',
  rules: {
    // Turn off or adjust rules as needed
    // '@typescript-eslint/no-explicit-any': 'off',
    // 'react/no-unescaped-entities': 'off',
    // 'no-console': 'off',
    // 'tailwindcss/no-custom-classname': 'off',
    // 'react/jsx-props-no-spreading': 'off'
  }
};
