import url from 'node:url';
import globals from 'globals';
import tseslint from 'typescript-eslint';
// import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
// import path from 'path';
// import {fileURLToPath} from 'url';
import {FlatCompat} from '@eslint/eslintrc';
import eslint from '@eslint/js';
// import { fixupPluginRules } from "@eslint/compat";
import eslintPluginPlugin from 'eslint-plugin-eslint-plugin';
import importPlugin from 'eslint-plugin-import';
// import nodePlugin from 'eslint-plugin-n';
import eslintConfigPrettier from 'eslint-config-prettier';
import jestPlugin from 'eslint-plugin-jest';
// import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const compat = new FlatCompat({baseDirectory: __dirname});

export default tseslint.config(
  {
    plugins: {
      ['@typescript-eslint']: tseslint.plugin,
      ['eslint-plugin']: eslintPluginPlugin,
      ['import']: importPlugin,
      ['jest']: jestPlugin,
      // ['jsx-a11y']: jsxA11yPlugin,
      ['react-hooks']: reactHooksPlugin,
      ['react']: reactPlugin,
    },
  },
  {
    ignores: [
      '**/jest.config.js',
      '**/node_modules/**',
      'packages/client/config/**/*.js',
    ],
  },
  eslint.configs.recommended,
  eslintConfigPrettier,
  // ...nodePlugin.configs['flat/recommended-script'],
  // ...tseslint.configs.strictTypeChecked,
  // ...tseslint.configs.stylisticTypeChecked,
  ...tseslint.configs.recommendedTypeChecked,
  // ...fixupPluginRules(reactPlugin),
  {
    languageOptions: {
      globals: {
        // ...globals.browser,
        // ...globals.commonjs,
        ...globals.es2021,
        ...globals.node,
      },
      // ecmaVersion: 'latest',
      // sourceType: 'module',
      // parser: tseslint.parser,
      parserOptions: {
        allowAutomaticSingleRunInference: true,
        cacheLifetime: {
          glob: 'Infinity',
        },
        project: [
          'tsconfig.json',
          'packages/*/tsconfig.json',
        ],
        tsconfigRootDir: __dirname,
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    rules: {
      '@typescript-eslint/no-confusing-void-expression': 'off',
      // '@typescript-eslint/prefer-string-starts-ends-with': 'off',

      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': true,
          'ts-nocheck': true,
          'ts-check': false,
          minimumDescriptionLength: 5,
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {prefer: 'type-imports', disallowTypeAnnotations: true},
      ],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {allowIIFEs: true},
      ],
      // '@typescript-eslint/no-explicit-any': 'off',
      // '@typescript-eslint/no-unsafe-argument': 'off',
      // '@typescript-eslint/no-unsafe-member-access': 'off',
      // '@typescript-eslint/no-unsafe-assignment': 'off',
      // '@typescript-eslint/no-unsafe-call': 'off',
      // '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',
      // '@typescript-eslint/no-unsafe-return': 'off',
      // '@typescript-eslint/consistent-type-definitions': 'off',
      'no-constant-condition': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unnecessary-condition': [
        'error',
        {allowConstantLoopConditions: true},
      ],
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/prefer-literal-enum-member': [
        'error',
        {
          allowBitwiseExpressions: true,
        },
      ],
      '@typescript-eslint/prefer-string-starts-ends-with': [
        'error',
        {
          allowSingleElementEquality: 'always',
        },
      ],
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowNumber: true,
          allowBoolean: true,
          allowAny: true,
          allowNullish: true,
          allowRegExp: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          caughtErrors: 'all',
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/prefer-nullish-coalescing': [
        'error',
        {
          ignoreConditionalTests: true,
          ignorePrimitives: true,
        },
      ],

      curly: ['error', 'all'],
      eqeqeq: ['error', 'always', {null: 'never',},],
      'logical-assignment-operators': 'error',
      'no-else-return': 'error',
      'no-mixed-operators': 'error',
      'no-console': 'off',
      'no-process-exit': 'error',
      'no-fallthrough': ['error', {commentPattern: '.*intentional fallthrough.*'},],
      'one-var': ['error', 'never'],

      //
      // eslint-plugin-import
      'import/no-extraneous-dependencies': 'off',
      // enforces consistent type specifier style for named imports
      'import/consistent-type-specifier-style': 'error',
      // disallow non-import statements appearing before import statements
      'import/first': 'error',
      // Require a newline after the last import/require in a group
      'import/newline-after-import': 'off',
      // Forbid import of modules using absolute paths
      'import/no-absolute-path': 'error',
      // disallow AMD require/define
      'import/no-amd': 'off',
      // forbid default exports - we want to standardize on named exports so that imported names are consistent
      'import/no-default-export': 'error',
      // disallow imports from duplicate paths
      'import/no-duplicates': 'error',
      // Forbid the use of extraneous packages
      // 'import/no-extraneous-dependencies': [
      //   'error',
      //   {
      //     devDependencies: true,
      //     peerDependencies: true,
      //     optionalDependencies: false,
      //   },
      // ],
      // Forbid mutable exports
      'import/no-mutable-exports': 'off',
      // Prevent importing the default as if it were named
      'import/no-named-default': 'error',
      // Prohibit named exports
      'import/no-named-export': 'off', // we want everything to be a named export
      // Forbid a module from importing itself
      'import/no-self-import': 'error',
      // Require modules with a single export to use a default export
      'import/prefer-default-export': 'off', // we want everything to be named
    },
  },
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
    rules: {
      '@typescript-eslint/internal/no-poorly-typed-ts-props': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  {
    files: ['eslint.config.{js,cjs,mjs}'],
    rules: {
      // requirement
      'import/no-default-export': 'off',
    },
  },
  {
    files: ['packages/client/**/*.{ts,tsx,mts,cts,js,jsx,mjs}'],
    // plugins: {
    //   reactPlugin,
    // },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      // globals: {
      //   ...globals.browser,
      // },
    },
    extends: [
      // ...compat.config(jsxA11yPlugin.configs.recommended),
      ...compat.config(reactPlugin.configs.recommended),
      ...compat.config(reactHooksPlugin.configs.recommended),
    ],
    rules: {
      // '@typescript-eslint/internal/prefer-ast-types-enum': 'off',
      "react/no-unknown-property": ["error", {
        ignore: ["css", "args", "attach", "intensity", "position", "object", "transparent", "rotation", "metalness", "roughness"]
      }],
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'import/no-default-export': 'off',
      'react/jsx-no-target-blank': 'off',
      'react/no-unescaped-entities': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // ...compat.config('eslint-plugin-promise'),
  // ...compat.extends("eslint-config-love"),
);
