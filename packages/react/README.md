# dial-react

React components for **dial**. The tokens are bundled inside, so this is the only package a
project needs.

```sh
npm install dial-react   # React 18+
```

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
