const config = {
  plugins: {
    "postcss-preset-env": {
      stage: 1,
      features: {
        // Adjust features if needed.
      },
    },
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};

export default config;
