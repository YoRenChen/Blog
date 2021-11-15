# ESlint, prettier, Vscode-Setting.json配置
（配置时间为2020年，使用前请留意最新版。配置会因为插件版本而改变某些使用方法，使用时注意）

- [Prettier](https://github.com/YoRenChen/Blog/issues/2/#Prettier)
- [ESLint - Js 版本](https://github.com/YoRenChen/Blog/issues/2/#ESLint-Js版本)
- [ESLint - Ts 版本](https://github.com/YoRenChen/Blog/issues/2/#ESLint-Ts版本)
- [Vscode Setting.json](https://github.com/YoRenChen/Blog/issues/2/#Setting.json)

## Prettier
_当前使用有关插件版本参考_
``"prettier": "^2.2.0" ``
```
# .prettierrc
{
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "trailingComma": "none"
}

```

## ESLint-Js版本
_当前使用有关插件版本参考_
``"eslint": "^5.16.0"``
``"babel-eslint": "^10.0.1"``
``"eslint-plugin-html": "^5.0.0"``
``"eslint-plugin-vue": "^5.2.3"``
``"@vue/cli-plugin-eslint": "^4.0.4"``
``"@vue/eslint-config-standard": "^4.0.0"``
```
# .eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/strongly-recommended', '@vue/standard'],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'generator-star-spacing': 'off',
    'no-mixed-operators': 0,
    'vue/max-attributes-per-line': [
      2,
      {
        singleline: 5,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    'vue/attribute-hyphenation': 0,
    'vue/html-self-closing': 0,
    'vue/component-name-in-template-casing': 0,
    'vue/html-closing-bracket-spacing': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/no-unused-components': 0,
    'vue/multiline-html-element-content-newline': 0,
    'vue/no-use-v-if-with-v-for': 0,
    'vue/html-closing-bracket-newline': 0,
    'vue/no-parsing-error': 0,
    'space-before-function-paren': 0,
    'no-tabs': 0,
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ],
    semi: [
      2,
      'never',
      {
        beforeStatementContinuationChars: 'never'
      }
    ],
    'no-delete-var': 2,
    'prefer-const': [
      2,
      {
        ignoreReadBeforeAssign: false
      }
    ],
    'template-curly-spacing': 'off',
    indent: 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaFeatures: {
      legacyDecorators: true
    }
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true
      }
    }
  ]
}

```
## ESLint-Ts版本
_当前使用有关插件版本参考_
``"eslint": "^6.7.2"``
``"babel-eslint": "^10.0.1"``
``"eslint-plugin-html": "^5.0.0"``
``"eslint-plugin-import": "^2.20.2"``
``"eslint-plugin-node": "^11.1.0"``
``"eslint-plugin-promise": "^4.2.1"``
``"eslint-plugin-standard": "^4.0.0"``
``"eslint-plugin-vue": "^6.2.2"``
``"@vue/eslint-config-standard": "^5.1.2"``
``"@vue/eslint-config-typescript": "^5.0.2"``
``"@vue/cli-plugin-typescript": "^4.5.13"``
``"@typescript-eslint/eslint-plugin": "^2.33.0"``
``"@typescript-eslint/parser": "^2.33.0"``
``"typescript": "~3.9.3"``
```
module.exports = {
  extends: [
+  '@vue/typescript/recommended'
  ],
  rules: {
+   '@typescript-eslint/no-unused-vars': 'off',
+   '@typescript-eslint/no-var-requires': 'off',
+   '@typescript-eslint/no-inferrable-types': 'off',
+   '@typescript-eslint/no-explicit-any': 'off',
+   '@typescript-eslint/camelcase': 0,
  },
  parserOptions: {
+   parser: '@typescript-eslint/parser'
  },
  plugins: [
+   '@typescript-eslint'
  ],
```

## Setting.json
Vscode Extensions: 
``Prettier - Code formatter``
``vetur``
``eslint``
```
{
  "editor.formatOnSave": false,
  "workbench.editorAssociations": [
    {
      "viewType": "default",
      "filenamePattern": "*.vue"
    }
  ],
  "javascript.suggest.completeJSDocs": true,
  "typescript.suggest.completeJSDocs": true,
  "editor.minimap.enabled": true,
  "editor.renderControlCharacters": false,
  "editor.renderWhitespace": "all",
  "breadcrumbs.enabled": true,
  "window.zoomLevel": -1,
  "workbench.editor.showTabs": true,
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "vscode.typescript-language-features"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.run": "onSave",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "vetur.validation.template": false,
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.fontLigatures": null
}
```
在代码自动保存时注意 `editor.formatOnSave,` => `editor.codeActionsOnSave` (>1.41.0)
