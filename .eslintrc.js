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
    "no-mixed-operators": ["error", {"allowSamePrecedence": true}],
    "no-confusing-arrow": ["error", {"allowParens": true}],
    "no-underscore-dangle": "off",
    "no-floating-decimal": 0,
    "no-param-reassign": 1,
    "arrow-body-style": [1, "as-needed", { "requireReturnForObjectLiteral": true }],
    "spaced-comment": ["error", "always", { "exceptions": ["-", "+"] }],
    "quote-props": 1,
    "no-continue": "off",
    "import/export": 2,
    "import/extensions": 1,
    "class-methods-use-this": ["error", { "exceptMethods": ["render"] }],
  }
};