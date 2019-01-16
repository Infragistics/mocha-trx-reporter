module.exports = {
    "extends": "airbnb-base",
    "env": {
        "mocha": true,
    },
    "plugins": [
        "mocha",
    ],
    "rules": {
        "comma-dangle": ["error", {
            "arrays": "always-multiline",
            "objects": "always-multiline",
            "imports": "always-multiline",
            "exports": "always-multiline",
            "functions": "never"
        }],
        "indent": ["error", 4],
        "func-names": "off",
        "import/no-extraneous-dependencies": ["error", { "devDependencies": ["**/*.test.js", "sampleTest/*.js"] }],
        "linebreak-style": "off",
        "max-len": ["error", { "code": 140 }],
        "no-iterator": "off",
        'no-restricted-syntax': [
            'error',
            {
              selector: 'ForInStatement',
              message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
            },
            {
              selector: 'LabeledStatement',
              message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
            },
            {
              selector: 'WithStatement',
              message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
            },
      ],
        "no-param-reassign": ["error", { props: false }],
        "no-underscore-dangle": "off",
        "no-use-before-define": ["error", { "functions": false, "classes": true }],
        "prefer-arrow-callback": "off",
        "mocha/prefer-arrow-callback": ["error"],
    }
};
