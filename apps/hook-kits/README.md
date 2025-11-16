# 🪝 Hook Kits

Hook Kits is a lightweight, modern React hooks library that helps you build UI and manage logic faster and cleaner.  
Each hook solves a common problem in everyday React development — from toggles and hover detection to storage and resize tracking.

> 🚀 Build smarter UIs. Reuse smarter logic.

---

## 📦 Installation

Install Hook Kits with your preferred package manager:

```
npm install hook-kits
yarn add hook-kits
pnpm add hook-kits
```

## 📦 Usage

<details>
  <summary><strong>useWheel</strong></summary>

Detects the browser's `wheel` event and returns whether the user is currently scrolling with the mouse wheel.

```tsx
import { useWheel } from 'hook-kits';

export default function WheelControlExample() {
  const { isWheel, handleWheelTrue, handleWheelFalse } = useWheel();

  return (
    <div>
      <p>Wheel Detected: {isWheel ? 'YES' : 'NO'}</p>
      <button onClick={handleWheelTrue}>Set True</button>
      <button onClick={handleWheelFalse}>Set False</button>
    </div>
  );
}
```

</details>

<details>
  <summary><strong>useToggle</strong></summary>

Simple boolean toggle hook.  
Provides methods to flip, set, and control a boolean state easily.

```tsx
import { useToggle } from 'hook-kits';

export default function ToggleExample() {
  const {
    isToggle,
    handleToggle,
    handleSetTrue,
    handleSetFalse,
    handleSetBoolean,
  } = useToggle();

  return (
    <div>
      <p>Toggle State: {isToggle ? 'TRUE' : 'FALSE'}</p>

      <button onClick={handleToggle}>Toggle</button>
      <button onClick={handleSetTrue}>Set True</button>
      <button onClick={handleSetFalse}>Set False</button>
      <button onClick={() => handleSetBoolean(false)}>Set Boolean</button>
    </div>
  );
}
```

</details>

<details>
  <summary><strong>useSessionStorage</strong></summary>

A typed sessionStorage hook that reads, writes, and removes values with automatic JSON parsing.  
Works safely with SSR environments.

```tsx
import { useSessionStorage } from 'hook-kits';

export default function SessionStorageExample() {
  const { value, setItem, removeItem } = useSessionStorage('user', {
    name: 'Guest',
  });

  return (
    <div>
      <p>Name: {value.name}</p>

      <button onClick={() => setItem({ name: 'Alice' })}>
        Set Name to Alice
      </button>

      <button onClick={removeItem}>Reset</button>
    </div>
  );
}
```

</details>

<details>
  <summary><strong>useResize</strong></summary>

A hook that observes the size of a DOM element and returns its current `DOMRect`.  
Useful for responsive components, dynamic layouts, and size-based UI calculations.

```tsx
import { useResize } from 'hook-kits';

export default function ResizeExample() {
  const { ref, rect } = useResize<HTMLDivElement>();

  return (
    <div>
      <div
        ref={ref}
        style={{
          width: '50%',
          resize: 'both',
          overflow: 'auto',
          border: '1px solid #aaa',
          padding: '1rem',
        }}
      >
        Resize me!
      </div>

      <p>
        Width: {rect?.width ?? 0}px — Height: {rect?.height ?? 0}px
      </p>
    </div>
  );
}
```

</details>

<details>
  <summary><strong>useRafState</strong></summary>

A state hook that updates inside a `requestAnimationFrame` loop.  
Useful for high-frequency UI updates such as scroll, resize, or animation-driven state changes.

```tsx
import { useRafState } from 'hook-kits';

export default function RafStateExample() {
  const { state, setRafState } = useRafState(0);

  return (
    <div>
      <p>Value: {state}</p>

      <button onClick={() => setRafState(state + 1)}>Increment (RAF)</button>
    </div>
  );
}
```

</details>

<details>
  <summary><strong>usePrevious</strong></summary>

Returns the previous value of a state or prop.  
Useful for comparison, animations, and detecting value changes.

```tsx
import { usePrevious } from 'hook-kits';
import { useState } from 'react';

export default function PreviousExample() {
  const [count, setCount] = useState(0);
  const prev = usePrevious(count);

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prev ?? 'N/A'}</p>

      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}
```

</details>

<details>
  <summary><strong>useObserver</strong></summary>

A hook built on top of the `IntersectionObserver` API.  
It detects when an element enters the viewport and optionally triggers a callback.

```tsx
import { useObserver } from 'hook-kits';

export default function ObserverExample() {
  const { ref, isIntersecting } = useObserver({
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
    onIntersect: () => {
      console.log('Element is visible!');
    },
  });

  return (
    <div style={{ height: '200vh', padding: '200px 0' }}>
      <div
        ref={ref}
        style={{
          height: '150px',
          background: isIntersecting ? '#4caf50' : '#ddd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isIntersecting ? 'Visible' : 'Scroll Down'}
      </div>
    </div>
  );
}
```

</details>

<details>
  <summary><strong>useMount</strong></summary>

Returns `true` after the component is mounted.  
Useful for delaying logic until the first client render.

```tsx
import { useMount } from 'hook-kits';

export default function MountExample() {
  const isMount = useMount();

  return (
    <div>
      <p>Mounted: {isMount ? 'YES' : 'NO'}</p>
    </div>
  );
}
```

</details>

<details>
  <summary><strong>useLocalStorage</strong></summary>

A typed localStorage hook that reads, writes, and removes values with automatic JSON parsing.  
Safely handles SSR environments.

```tsx
import { useLocalStorage } from 'hook-kits';

export default function LocalStorageExample() {
  const { value, setItem, removeItem } = useLocalStorage('theme', 'light');

  return (
    <div>
      <p>Theme: {value}</p>

      <button onClick={() => setItem('dark')}>Set Dark</button>
      <button onClick={() => setItem('light')}>Set Light</button>
      <button onClick={removeItem}>Reset</button>
    </div>
  );
}
```

</details>

<details>
  <summary><strong>useLazyImageLoad</strong></summary>

A lazy-loading hook for images using `IntersectionObserver`.  
It waits until the image enters the viewport, then triggers a load event and updates the `loaded` state.

```tsx
import { useLazyImageLoad } from 'hook-kits';

export default function LazyImageExample() {
  const { ref, loaded } = useLazyImageLoad({
    isLazy: true,
    root: null,
    threshold: 0.1,
    rootMargin: '0px',
  });

  return (
    <div>
      {!loaded && <p>Loading image...</p>}

      <img
        ref={ref}
        data-src='https://picsum.photos/500'
        src={loaded ? 'https://picsum.photos/500' : undefined}
        alt='Lazy Example'
        style={{
          width: 300,
          height: 200,
          background: '#eee',
          objectFit: 'cover',
        }}
      />
    </div>
  );
}
```

</details>

<details>
  <summary><strong>useIsClient</strong></summary>

Returns `true` only on the client-side after the component has mounted.  
Useful for avoiding SSR mismatches or running client-only logic.

```tsx
import { useIsClient } from 'hook-kits';

export default function IsClientExample() {
  const isClient = useIsClient();

  return (
    <div>
      <p>Client Render: {isClient ? 'YES' : 'NO'}</p>
    </div>
  );
}
```

</details>

<details>
  <summary><strong>useInput</strong></summary>

A flexible input handler hook for both single-value inputs and object-based form fields.  
Supports simple input changes, named-field updates, and value reset.

```tsx
import { useInput } from 'hook-kits';

export default function InputExample() {
  // Single value input
  const {
    value: text,
    handleInputChange,
    resetValue: resetText,
  } = useInput('');

  // Object value input (e.g., form fields)
  const {
    value: form,
    handleFieldChange,
    resetValue: resetForm,
  } = useInput({ email: '', username: '' });

  return (
    <div>
      <h3>Single Input</h3>
      <input
        value={text}
        onChange={handleInputChange}
      />
      <button onClick={resetText}>Reset</button>

      <h3>Form Fields</h3>
      <input
        name='email'
        value={form.email}
        onChange={handleFieldChange}
      />
      <input
        name='username'
        value={form.username}
        onChange={handleFieldChange}
      />
      <button onClick={resetForm}>Reset Form</button>
    </div>
  );
}
```

</details>

<details>
  <summary><strong>useHover</strong></summary>

A hook that detects whether an element is being hovered.  
Returns a `ref` to attach to the target element and a boolean `isHover`.

```tsx
import { useHover } from 'hook-kits';

export default function HoverExample() {
  const { ref, isHover } = useHover<HTMLDivElement>();

  return (
    <div>
      <div
        ref={ref}
        style={{
          width: 200,
          height: 100,
          background: isHover ? '#4caf50' : '#ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: '0.2s ease',
        }}
      >
        {isHover ? 'Hovering!' : 'Hover me'}
      </div>
    </div>
  );
}
```

</details>

<details>
  <summary><strong>useEventSource</strong></summary>

A hook for handling Server-Sent Events (SSE).  
It manages connection lifecycle, listens for streamed chunks, handles errors, and allows manual cancellation.

```tsx
import { useEventSource } from 'hook-kits';

export default function EventSourceExample() {
  const { state, isError, cancelEventSource, eventSource } = useEventSource({
    url: '/api/stream',
    event: 'message',
    initialState: [],
    onOpen: () => console.log('SSE Connected'),
    onResponse: (chunk) => console.log('Chunk:', chunk),
    onError: (err) => console.error('Error:', err),
    onCancel: () => console.log('SSE Cancelled'),
  });

  return (
    <div>
      <button onClick={cancelEventSource}>Cancel Stream</button>

      <p>SSE Error: {isError ? 'YES' : 'NO'}</p>

      <ul>
        {state.map((item, i) => (
          <li key={i}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
}
```

</details>

<details>
  <summary><strong>useEventCallback</strong></summary>

A stable callback hook that always references the latest function without causing re-renders.  
Useful when passing callbacks into `useEffect`, observers, or event listeners without adding them to dependency arrays.

```tsx
import { useEventCallback } from 'hook-kits';
import { useEffect, useState } from 'react';

export default function EventCallbackExample() {
  const [count, setCount] = useState(0);

  // Always up-to-date, but stable reference
  const handleLog = useEventCallback(() => {
    console.log('Current count:', count);
  });

  useEffect(() => {
    const id = setInterval(() => {
      // This callback will always log the latest count,
      // without adding `count` to the dependency array.
      handleLog();
    }, 1000);

    return () => clearInterval(id);
  }, [handleLog]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}
```

</details>

<details>
  <summary><strong>useCount</strong></summary>

A counter hook with optional limits and change callbacks.  
Supports increment, decrement, direct updates, and prevents invalid values.

```tsx
import { useCount } from 'hook-kits';

export default function CountExample() {
  const { count, increase, decrease, handleChangeCount } = useCount({
    initialState: 1,
    limit: 5,
    onChange: (v) => console.log('Changed:', v),
  });

  return (
    <div>
      <p>Count: {count}</p>

      <button onClick={decrease}>-</button>
      <button onClick={increase}>+</button>

      <button onClick={() => handleChangeCount(3)}>Set to 3</button>
      <button onClick={() => handleChangeCount(10)}>Set to 10 (blocked)</button>
    </div>
  );
}
```

</details>

<details>
  <summary><strong>useCopyClipBoard</strong></summary>

A hook for copying text to the clipboard using the modern Clipboard API.  
Returns the last copied text and a `copy` function.

```tsx
import { useCopyClipBoard } from 'hook-kits';

export default function CopyExample() {
  const { copiedText, copy } = useCopyClipBoard();

  return (
    <div>
      <button onClick={() => copy('Hello World!')}>Copy Text</button>

      <p>Copied: {copiedText ?? 'Nothing yet'}</p>
    </div>
  );
}
```

</details>

<details>
  <summary><strong>useClickAway</strong></summary>

A hook that triggers a callback when a user clicks outside the referenced element.  
Useful for modals, dropdowns, tooltips, and any UI that should close on outside click.

```tsx
export default function ClickAwayExample() {
  const [open, setOpen] = useState(false);
  const ref = useClickAway<HTMLDivElement>(() => setOpen(false));

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Box</button>

      {open && (
        <div
          ref={(el) => {
            if (el) ref.current = el;
          }}
          style={{
            width: 200,
            height: 120,
            background: '#4caf50',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
          }}
        >
          Click outside to close
        </div>
      )}
    </div>
  );
}
```

</details>

## 📄 License

MIT License © 2025 @dhgg321
