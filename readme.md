# Tailwind-friendly token resolver for semantic tokens

Given a set of global tokens, this package provides a function that resolves "semantic token" to their values - see below example.

```javascript
// colors.js

import { Tokenizer } from '@hyraiq/tokenizer';

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

export const background = tokenizer.handle({
  'default': 'white',
  'secondary': 'grey-25',
  'hover': 'grey-50',
  'active': 'grey-100',
  'selected': 'grey-75',
  'brand': 'blue-600',
});

export { globalTokens };
```

This `tokenizer.handle()` method will resolve these references to `blue-600` etc within the global tokens, which can 
then be used in your main tailwind.config.js:

```javascript
// tailwind.config.js
import { globalTokens, background } from './colors';

export default {
  theme: {
    colors: globalTokens,
  },
  backgroundColor: theme => ({
    // Include the global tokens
    ...theme('theme.colors'),
    // And the semantic tokens just for background
    ...background,
  })
}
```

## Alpha

Suffix a reference with `/<percent>` to resolve it at partial opacity. The percentage is 0-100 and the result is an
8-digit hex:

```javascript
tokenizer.handle({
  'disabled': 'grey-900/40',          // -> '#1D212B66'
  'inverse-disabled': 'white/40',     // -> '#FFFFFF66'
});
```

Tailwind reads 8-digit hex natively, and its own opacity modifier still wins where both are present - `text-disabled/60`
renders `rgb(29 33 43 / 0.6)`. Note that a colour carrying its own alpha opts out of Tailwind's `--tw-text-opacity`
variable, so a `text-opacity-*` utility alongside it has no effect rather than compounding.

Alpha only applies to hex colours. `transparent/40` or `currentColor/40` throws, as does a percentage above 100.
