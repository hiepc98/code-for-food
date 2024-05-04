// module.exports = {
//   extends: ["next", "turbo", "prettier", "plugin:react/recommended", "standard"],
//   plugins: [
//     "react",
//     "@typescript-eslint"
//   ],
//   rules: {
//     "@next/next/no-html-link-for-pages": "off",
//     "react/jsx-key": "off",
//     "react/prop-types": 0,
//     "no-unused-vars": "off",
//     "@typescript-eslint/no-unused-vars": "error",
//     "react/react-in-jsx-scope": "off"
//   },
// };

module.exports = {
  extends: ["next", "turbo", "prettier"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
  },
};