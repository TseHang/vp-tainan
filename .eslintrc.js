module.exports = {
  "extends": "airbnb",
  "installedESLint": true,
  "ecmaFeatures": {
    "experimentalObjectRestSpread": true,
    "modules": true
  },
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
    "jquery": true
  },
  "plugins": [
    "import"
  ],
  "rules": {
    "semi": [1, "never"],
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "arrow-body-style": [1, "as-needed", { "requireReturnForObjectLiteral": true }],
    "spaced-comment": ["error", "always", { "exceptions": ["-", "+"] }],
    "no-underscore-dangle": "off",
    "no-floating-decimal": 0,
    "quote-props": 1,
    "no-continue": "off",
    "import/export": 2,
    "import/extensions": 1,
    "class-methods-use-this": ["error", { "exceptMethods": ["render"] }],
  }
};