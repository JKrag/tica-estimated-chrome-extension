const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    // Default config for browser scripts
    files: ['*.js'],
    ignores: ['jest.config.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        ...globals.browser
      }
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }]
    }
  },
  {
    // content.js uses globals from breeds.js
    files: ['content.js'],
    languageOptions: {
      globals: {
        LONGHAIR_BREEDS: 'readonly',
        SHORTHAIR_BREEDS: 'readonly',
        isLonghair: 'readonly',
        isShorthair: 'readonly',
        BREED_NAMES: 'readonly',
        getBreedName: 'readonly'
      }
    }
  },
  {
    // breeds.js needs to export for Node.js testing
    files: ['breeds.js'],
    languageOptions: {
      globals: {
        module: 'readonly'
      }
    }
  },
  {
    // Test files and Node.js configs
    files: ['tests/**/*.js', 'jest.config.js', 'eslint.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest
      }
    }
  },
  {
    // Library files (CommonJS)
    files: ['lib/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node
      }
    }
  },
  {
    ignores: ['node_modules/', 'dist/', 'build/', 'store-assets/']
  }
];
