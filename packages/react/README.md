# dial-react

React components for **dial**. The tokens are bundled inside, so this is the only package a
project needs.

dial-react is not on npm yet. Install it from the tarball (React 18+ needed):

```sh
npm install /path/to/dial/release/dial-react-0.0.0.tgz
```

The tarball comes from `pnpm run release:pack` in the dial repo.

```tsx
import 'dial-react/all.css';   // tokens and component styles in one file, once at the root
import { Container, Grid, GridItem, Stack } from 'dial-react';
```

| Entry | What it is |
|---|---|
| `dial-react` | The components (ESM and CJS, typed) |
| `dial-react/all.css` | Tokens, then component styles |
| `dial-react/styles.css` | Component styles only, for projects that load the tokens themselves |
| `dial-react/tokens.css`, `/tokens`, `/tokens.json` | The bundled tokens |

Every component, its props, keyboard behaviour and contrast evidence is in the docs book.
The tokens alone, for a project without React, are the separate package `dial-tokens`.
