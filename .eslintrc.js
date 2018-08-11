module.exports = {
  extends: ["airbnb-base", "prettier"],
  plugins: ["jest"],
  env: {
    "jest/globals": true
  },
  rules: {
    "no-console": 0,
    "no-await-in-loop": 0,
    "no-restricted-syntax": 0
  }
};
