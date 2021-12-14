# Visor

Visor is a component catalog generator for alumina.
It is a simpler alternative to storybook.

## Usage

```
npm install alumina-visor
```

```
visor serve
```

## Configuration

### .vissorrc.json
```json
{
  "sourceFolder": "src/components"
}
```

The root directory for the components is specified by `sourceFolder`.

All `.visor.tsx` files under this directory are enumerated.

The component path shown in the UI is relative to this directory.

If the config file is not exist, all `.visor.tsx` files under current directory are enumerated.


## Visor file example

### Counter.visor.tsx
```tsx
import { jsx } from 'alumina';
import { Counter } from '~/components/atoms/Counter';

export default {
  default: () => <Counter />,
  twoStep: () => <Counter step={2} />,
  fixed: <Counter />,
};
```

Render examples for a component are described in .visor.tsx file.

It must have a default export object.

The key of the object describes rendering variation name, and the value is render example.
The value can be a function component or a static vdom element.

## Repository structure

```
.
├── packages
│   ├── alumina-visor  //package published to npm
│   └── example-app    //example app for development
└── readme.md
```

Monorepo structure is adopted for development easiness.