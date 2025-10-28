# Mobile version wrapper

This folder contains a mobile-styled CSS and a small React wrapper component that forces the mobile UI layout when applied.

Files:

- `mobile.css` - Scoped mobile rules that apply when an ancestor has the `.m` class. These rules are derived from the existing responsive rules in `src/index.css` and are intentionally scoped so you can force mobile layout even on desktop-sized viewports.
- `MobileWrapper.tsx` - A tiny React component that renders its children inside a `<div className="m">`, enabling the mobile stylesheet.

How to use

1. Import and wrap your app (or specific parts) when you want to preview/use the mobile UI on desktop:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../main';
import MobileWrapper from './mobile/MobileWrapper';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <MobileWrapper>
    <App />
  </MobileWrapper>
);
```

2. Alternatively, for quick testing, wrap the part of the DOM you want to force into mobile layout with a `<div className="m">` in your app.

Notes

- The wrapper does not change app logic — it only loads scoped CSS to emulate the mobile layout.
- If you want a separate mobile build or route, you can create a separate entry that mounts the app wrapped by `MobileWrapper` (example shown above).
