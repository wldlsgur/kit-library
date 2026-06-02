# Hook Kits

A lightweight collection of useful custom hooks for modern React development. Built for React 18+ and Next.js App Router.

## Installation

```bash
npm install hook-kits
# or
yarn add hook-kits
# or
pnpm add hook-kits
```

## Hooks

### State

| Hook                          | Description                            |
| ----------------------------- | -------------------------------------- |
| [`useToggle`](#usetoggle)     | Toggle boolean state                   |
| [`useCount`](#usecount)       | Counter with min/max limits            |
| [`useInput`](#useinput)       | Input / form state management          |
| [`usePrevious`](#useprevious) | Track previous render value            |
| [`useRafState`](#userafstate) | State update via requestAnimationFrame |

### DOM & Interaction

| Hook                                      | Description                                  |
| ----------------------------------------- | -------------------------------------------- |
| [`useClickAway`](#useclickaway)           | Detect clicks outside an element             |
| [`useHover`](#usehover)                   | Detect hover state                           |
| [`useHotKeys`](#usehotkeys)               | Detect keyboard shortcuts                    |
| [`useLockBodyScroll`](#uselockbodyscroll) | Lock body scroll                             |
| [`useWheel`](#usewheel)                   | Detect mouse wheel events                    |
| [`useResize`](#useresize)                 | Observe element resize (ResizeObserver)      |
| [`useObserver`](#useobserver)             | Detect viewport entry (IntersectionObserver) |
| [`useLazyImageLoad`](#uselazyimageload)   | Lazy load images                             |
| [`useScrollToTop`](#usescrolltotop)       | Scroll to top on dependency change           |

### Browser & Storage

| Hook                                      | Description                          |
| ----------------------------------------- | ------------------------------------ |
| [`useLocalStorage`](#uselocalstorage)     | Read/write localStorage (SSR-safe)   |
| [`useSessionStorage`](#usesessionstorage) | Read/write sessionStorage (SSR-safe) |
| [`useCopyClipBoard`](#usecopyclipboard)   | Copy text to clipboard               |
| [`useIsClient`](#useisclient)             | Check if running on client side      |
| [`useMount`](#usemount)                   | Check if component is mounted        |

### Utility

| Hook                                    | Description                                         |
| --------------------------------------- | --------------------------------------------------- |
| [`useEventCallback`](#useeventcallback) | Stable callback reference (prevents stale closures) |

---

## API

### useToggle

Manages boolean state.

```ts
const { isToggle, handleToggle, handleSetTrue, handleSetFalse, handleSetBoolean } = useToggle(initialState?: boolean);
```

| Return             | Type                       | Description    |
| ------------------ | -------------------------- | -------------- |
| `isToggle`         | `boolean`                  | Current state  |
| `handleToggle`     | `() => void`               | Toggle state   |
| `handleSetTrue`    | `() => void`               | Set to `true`  |
| `handleSetFalse`   | `() => void`               | Set to `false` |
| `handleSetBoolean` | `(state: boolean) => void` | Set directly   |

```tsx
import { useToggle } from 'hook-kits';

function ToggleExample() {
  const { isToggle, handleToggle } = useToggle(false);

  return <button onClick={handleToggle}>{isToggle ? 'ON' : 'OFF'}</button>;
}
```

---

### useCount

Counter with a minimum of 1 and an optional maximum.

```ts
const { count, increase, decrease, handleChangeCount } = useCount({
  initialState?: number,   // default: 1
  limit?: number,          // max value
  onChange?: (value: number) => void,
});
```

| Return              | Type                  | Description   |
| ------------------- | --------------------- | ------------- |
| `count`             | `number`              | Current count |
| `increase`          | `() => void`          | +1            |
| `decrease`          | `() => void`          | -1 (min 1)    |
| `handleChangeCount` | `(n: number) => void` | Set directly  |

```tsx
import { useCount } from 'hook-kits';

function CountExample() {
  const { count, increase, decrease } = useCount({
    initialState: 1,
    limit: 10,
  });

  return (
    <div>
      <button onClick={decrease}>-</button>
      <span>{count}</span>
      <button onClick={increase}>+</button>
    </div>
  );
}
```

---

### useInput

Manages single value or object-based form input.

```ts
const { value, handleInputChange, handleFieldChange, resetValue } = useInput(initialValue: T);
```

| Return              | Type                       | Description                             |
| ------------------- | -------------------------- | --------------------------------------- |
| `value`             | `T`                        | Current value                           |
| `handleInputChange` | `(e: ChangeEvent) => void` | Update single value                     |
| `handleFieldChange` | `(e: ChangeEvent) => void` | Update object field by `name` attribute |
| `resetValue`        | `() => void`               | Reset to initial value                  |

```tsx
import { useInput } from 'hook-kits';

function FormExample() {
  const { value, handleFieldChange, resetValue } = useInput({
    email: '',
    name: '',
  });

  return (
    <form>
      <input
        name='email'
        value={value.email}
        onChange={handleFieldChange}
      />
      <input
        name='name'
        value={value.name}
        onChange={handleFieldChange}
      />
      <button
        type='button'
        onClick={resetValue}
      >
        Reset
      </button>
    </form>
  );
}
```

---

### usePrevious

Returns the value from the previous render.

```ts
const previousValue: T | undefined = usePrevious(value: T);
```

```tsx
import { usePrevious } from 'hook-kits';
import { useState } from 'react';

function PreviousExample() {
  const [count, setCount] = useState(0);
  const prev = usePrevious(count);

  return (
    <div>
      <p>
        Current: {count} / Previous: {prev ?? 'N/A'}
      </p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  );
}
```

---

### useRafState

Updates state within `requestAnimationFrame`. Ideal for high-frequency updates like scroll or resize.

```ts
const { state, setRafState } = useRafState(defaultValue: T);
```

| Return        | Type                 | Description            |
| ------------- | -------------------- | ---------------------- |
| `state`       | `T`                  | Current state          |
| `setRafState` | `(value: T) => void` | RAF-based state update |

```tsx
import { useRafState } from 'hook-kits';

function RafExample() {
  const { state, setRafState } = useRafState(0);

  return <button onClick={() => setRafState(state + 1)}>Count: {state}</button>;
}
```

---

### useClickAway

Detects clicks outside an element (mousedown, touchstart) and fires a callback. Useful for modals, dropdowns, and tooltips.

```ts
const ref = useClickAway<T extends HTMLElement>(onClick: (e?: MouseEvent | TouchEvent) => void);
```

```tsx
import { useClickAway } from 'hook-kits';
import { useState } from 'react';

function DropdownExample() {
  const [open, setOpen] = useState(false);
  const ref = useClickAway<HTMLDivElement>(() => setOpen(false));

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open</button>
      {open && (
        <div
          ref={(el) => {
            if (el) ref.current = el;
          }}
        >
          Click outside to close
        </div>
      )}
    </div>
  );
}
```

---

### useHover

Detects hover state of an element.

```ts
const { ref, isHover } = useHover<T extends HTMLElement>();
```

| Return    | Type           | Description                          |
| --------- | -------------- | ------------------------------------ |
| `ref`     | `React.Ref<T>` | Ref to attach to the target element  |
| `isHover` | `boolean`      | Whether the element is being hovered |

```tsx
import { useHover } from 'hook-kits';

function HoverExample() {
  const { ref, isHover } = useHover<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{ background: isHover ? '#4caf50' : '#ccc' }}
    >
      {isHover ? 'Hovering!' : 'Hover me'}
    </div>
  );
}
```

---

### useHotKeys

Detects keyboard shortcut combinations and fires a callback. Supports modifier keys (`Ctrl`, `Shift`, `Alt`, `Meta`) combined with a normal key, or each used alone.

```ts
useHotKeys({
  keys: ['Ctrl', 'S'],
  callback: () => { ... },
});
```

| Param      | Type                                                            | Description                        |
| ---------- | --------------------------------------------------------------- | ---------------------------------- |
| `keys`     | `ModifierKey[] \| [NormalKey] \| [...ModifierKey[], NormalKey]` | Key combination (case-insensitive) |
| `callback` | `() => void`                                                    | Callback to invoke when matched    |

- **Modifier + normal key** &mdash; `['Ctrl', 'S']`, `['Ctrl', 'Shift', 'K']`
- **Normal key only** &mdash; `['Escape']`, `['Enter']`
- **Modifier only** &mdash; `['Ctrl']`, `['Ctrl', 'Shift']`
- Calls `preventDefault()` automatically when matched
- Exact match only &mdash; extra modifiers will not trigger the callback

```tsx
import { useHotKeys } from 'hook-kits';

function SaveShortcut() {
  useHotKeys({
    keys: ['Ctrl', 'S'],
    callback: () => console.log('Saved!'),
  });

  return <p>Press Ctrl+S to save</p>;
}

function CloseModal() {
  useHotKeys({
    keys: ['Escape'],
    callback: () => console.log('Closed!'),
  });

  return <p>Press Escape to close</p>;
}
```

---

### useLockBodyScroll

Locks body scroll by setting `overflow: hidden`. Useful for modals and drawers. Restores the original overflow value on unmount or when `locked` becomes `false`.

```ts
useLockBodyScroll(locked?: boolean); // default: true
```

| Param    | Type      | Description                             |
| -------- | --------- | --------------------------------------- |
| `locked` | `boolean` | Whether to lock scroll (default `true`) |

```tsx
import { useLockBodyScroll } from 'hook-kits';
import { useState } from 'react';

function ModalExample() {
  const [open, setOpen] = useState(false);

  useLockBodyScroll(open);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      {open && (
        <div>
          <p>Modal Content</p>
          <button onClick={() => setOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
```

---

### useScrollToTop

Scrolls to the top of the page whenever the given dependency changes. Router-agnostic &mdash; works with Next.js, React Router, or any value.

```ts
useScrollToTop(dependency: unknown);
```

| Param | Type | Description |
| --- | --- | --- |
| `dependency` | `unknown` | Scroll resets when this value changes |

```tsx
// Next.js App Router
import { usePathname } from 'next/navigation';
import { useScrollToTop } from 'hook-kits';

function ScrollReset() {
  const pathname = usePathname();
  useScrollToTop(pathname);

  return null;
}
```

```tsx
// React Router
import { useLocation } from 'react-router-dom';
import { useScrollToTop } from 'hook-kits';

function ScrollReset() {
  const { pathname } = useLocation();
  useScrollToTop(pathname);

  return null;
}
```

---

### useWheel

Detects browser `wheel` events.

```ts
const { isWheel, handleWheelTrue, handleWheelFalse } = useWheel();
```

| Return             | Type         | Description                |
| ------------------ | ------------ | -------------------------- |
| `isWheel`          | `boolean`    | Whether wheel is scrolling |
| `handleWheelTrue`  | `() => void` | Manually set to `true`     |
| `handleWheelFalse` | `() => void` | Manually set to `false`    |

```tsx
import { useWheel } from 'hook-kits';

function WheelExample() {
  const { isWheel } = useWheel();

  return <p>Wheel: {isWheel ? 'YES' : 'NO'}</p>;
}
```

---

### useResize

Observes element size changes using `ResizeObserver`.

```ts
const { ref, rect } = useResize<T extends HTMLElement>();
```

| Return | Type                      | Description                         |
| ------ | ------------------------- | ----------------------------------- |
| `ref`  | `React.Ref<T>`            | Ref to attach to the target element |
| `rect` | `DOMRectReadOnly \| null` | Current size and position           |

```tsx
import { useResize } from 'hook-kits';

function ResizeExample() {
  const { ref, rect } = useResize<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{ width: '50%', resize: 'both', overflow: 'auto' }}
    >
      {rect?.width.toFixed(0)} x {rect?.height.toFixed(0)}
    </div>
  );
}
```

---

### useObserver

Detects when an element enters the viewport using `IntersectionObserver`.

```ts
const { ref, isIntersecting } = useObserver<T extends HTMLElement>({
  root?: Element | null,
  rootMargin?: string,
  threshold?: number | number[],
  onIntersect: () => void,
});
```

| Return           | Type           | Description                            |
| ---------------- | -------------- | -------------------------------------- |
| `ref`            | `React.Ref<T>` | Ref to attach to the observed element  |
| `isIntersecting` | `boolean`      | Whether the element is in the viewport |

```tsx
import { useObserver } from 'hook-kits';

function ObserverExample() {
  const { ref, isIntersecting } = useObserver({
    threshold: 0.5,
    onIntersect: () => console.log('Visible!'),
  });

  return (
    <div
      ref={ref}
      style={{ background: isIntersecting ? '#4caf50' : '#ddd' }}
    >
      {isIntersecting ? 'Visible' : 'Scroll to see'}
    </div>
  );
}
```

---

### useLazyImageLoad

Lazy loads images when they enter the viewport using `IntersectionObserver`.

```ts
const { ref, loaded } = useLazyImageLoad({
  isLazy?: boolean,
  root?: Element | null,
  threshold?: number | number[],
  rootMargin?: string,
});
```

| Return   | Type                          | Description                        |
| -------- | ----------------------------- | ---------------------------------- |
| `ref`    | `React.Ref<HTMLImageElement>` | Ref to attach to the image element |
| `loaded` | `boolean`                     | Whether the image has loaded       |

```tsx
import { useLazyImageLoad } from 'hook-kits';

function LazyImageExample() {
  const { ref, loaded } = useLazyImageLoad({ isLazy: true, threshold: 0.1 });

  return (
    <img
      ref={ref}
      data-src='https://picsum.photos/500'
      src={loaded ? 'https://picsum.photos/500' : undefined}
      alt='Lazy loaded'
    />
  );
}
```

---

### useLocalStorage

Type-safe read/write for `localStorage`. SSR-safe.

```ts
const { value, setItem, removeItem } = useLocalStorage<T>(key: string, defaultValue: T);
```

| Return       | Type                    | Description                     |
| ------------ | ----------------------- | ------------------------------- |
| `value`      | `T`                     | Current stored value            |
| `setItem`    | `(newValue: T) => void` | Store a value                   |
| `removeItem` | `() => void`            | Remove value (restores default) |

```tsx
import { useLocalStorage } from 'hook-kits';

function ThemeExample() {
  const { value, setItem } = useLocalStorage('theme', 'light');

  return (
    <button onClick={() => setItem(value === 'light' ? 'dark' : 'light')}>
      Theme: {value}
    </button>
  );
}
```

---

### useSessionStorage

Type-safe read/write for `sessionStorage`. SSR-safe.

```ts
const { value, setItem, removeItem } = useSessionStorage<T>(key: string, defaultValue: T);
```

| Return       | Type                    | Description                     |
| ------------ | ----------------------- | ------------------------------- |
| `value`      | `T`                     | Current stored value            |
| `setItem`    | `(newValue: T) => void` | Store a value                   |
| `removeItem` | `() => void`            | Remove value (restores default) |

```tsx
import { useSessionStorage } from 'hook-kits';

function SessionExample() {
  const { value, setItem, removeItem } = useSessionStorage('user', {
    name: 'Guest',
  });

  return (
    <div>
      <p>{value.name}</p>
      <button onClick={() => setItem({ name: 'Alice' })}>Set Alice</button>
      <button onClick={removeItem}>Reset</button>
    </div>
  );
}
```

---

### useCopyClipBoard

Copies text to the clipboard using the Clipboard API.

```ts
const { copiedText, copy } = useCopyClipBoard();
```

| Return       | Type                              | Description       |
| ------------ | --------------------------------- | ----------------- |
| `copiedText` | `string \| null`                  | Last copied text  |
| `copy`       | `(text: string) => Promise<void>` | Copy to clipboard |

```tsx
import { useCopyClipBoard } from 'hook-kits';

function CopyExample() {
  const { copiedText, copy } = useCopyClipBoard();

  return (
    <div>
      <button onClick={() => copy('Hello!')}>Copy</button>
      <p>Copied: {copiedText ?? '-'}</p>
    </div>
  );
}
```

---

### useIsClient

Returns `true` only on the client side. Prevents hydration mismatch in SSR environments.

```ts
const isClient: boolean = useIsClient();
```

```tsx
import { useIsClient } from 'hook-kits';

function ClientOnly() {
  const isClient = useIsClient();

  if (!isClient) return null;
  return <p>Client only content</p>;
}
```

---

### useMount

Returns `true` after the component has mounted.

```ts
const isMounted: boolean = useMount();
```

```tsx
import { useMount } from 'hook-kits';

function MountExample() {
  const isMounted = useMount();

  return <p>Mounted: {isMounted ? 'YES' : 'NO'}</p>;
}
```

---

### useEventCallback

Returns a stable callback reference that always points to the latest function. Prevents stale closures in `useEffect` and event listeners without adding the callback to dependency arrays.

```ts
const stableCallback = useEventCallback(callback?: T);
```

```tsx
import { useEventCallback } from 'hook-kits';
import { useEffect, useState } from 'react';

function EventCallbackExample() {
  const [count, setCount] = useState(0);

  const log = useEventCallback(() => {
    console.log('count:', count); // always references latest count
  });

  useEffect(() => {
    const id = setInterval(log, 1000);
    return () => clearInterval(id);
  }, [log]);

  return <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>;
}
```

---

## License

MIT
