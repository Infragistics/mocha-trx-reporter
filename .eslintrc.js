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
        "no-param-reassign": ["error", { props: false }],
        "no-underscore-dangle": "off",
        "no-use-before-define": ["error", { "functions": false, "classes": true }],
        "prefer-arrow-callback": "off",
        "mocha/prefer-arrow-callback": ["error"],
    }
};
