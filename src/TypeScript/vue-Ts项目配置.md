# vue-Ts项目配置
本文配置基于 vue3.0 - ts - babel

## 项目配置
### 安装预项
```
yarn add vue-tsc @typescript-eslint/eslint-plugin @typescript-eslint/parser typescript -D
```

## 文件配置
```
# .eslintrc
extends: [
  'plugin:@typescript-eslint/recommended'
],
parserOptions: {
  parser: '@typescript-eslint/parser'
},
rules: {
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/no-non-null-assertion': 'off'
}
```
```
# tsConfig.ts
{
  "compilerOptions": {
    "target": "esnext",
    "useDefineForClassFields": true,
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "lib": ["esnext", "dom"],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "exclude": [""],
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```
