module.exports = {
  root: true,
  env: {
    node: true,
  },
  lintOnSave: false,
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
// 添加组件命名忽略规则
  "vue/multi-word-component-names": ["error",{
    "ignores": ["index"]//需要忽略的组件名
  }]


};

