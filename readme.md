# Tailwind-friendly token resolver for semantic tokens

Given a set of global tokens"

```javascript
// colors.js

const { tokenizer } = require('@hyraiq/tokenizer');

const globalTokens = {
  white: '#FFFFFF',
  grey: {
    25: '#F9F9FB',
    50: '#F0F1F5',
    75: '#E4E6EC',
    100: '#D9DBE3',
    200: '#C2C6D1',
    300: '#A0A7B6',
    400: '#838A9A',
    500: '#676E7E',
    600: '#515767',
    700: '#3F4655',
    800: '#2D3340',
    900: '#1D212B',
  },
  blue: {
    50: '#EBF3FE',
    75: '#D7E8FE',
    100: '#C2DEFF',
    200: '#99CAFF',
    300: '#6DA9FD',
    400: '#3D87FF',
    500: '#1F5EFF',
    600: '#002FFF',
    700: '#122EC4',
    800: '#142494',
    900: '#0E1662',
  },
};

const tokenizer = Tokenizer.with(globalTokens);

module.exports = {
  globalTokens,
  background: tokenizer.resolve({
    'default': 'white',
    'secondary': 'grey-25',
    'hover': 'grey-50',
    'active': 'grey-100',
    'selected': 'grey-75',
    'brand': 'blue-600',
  })
}
```

This `tokenizer.resolve()` method will resolve these references to `blue-600` etc within the global tokens, which can 
then be used in your main tailwind.config.js:

```javascript
// tailwind.config.js
const {colors} = require('./colors');

module.exports = {
  theme: {
    colors: colors.globalTokens,
  },
  backgroundColor: theme => ({
    // Include the global tokens
    ...theme('theme.colors'),
    // And the semantic tokens just for background
    ...colors.background,
  })
}

```
