# components-kits

A lightweight utility component library for modern React applications.
Designed to handle repetitive UI patterns declaratively.

## Installation

```bash
npm install components-kits
# or
pnpm add components-kits
```

### Peer Dependencies

- `react` ^18 || ^19
- `react-dom` ^18 || ^19

## Components

### List

A generic list component for declarative array rendering.

```tsx
import { List } from 'components-kits';

const fruits = ['Apple', 'Banana', 'Cherry'];

<List
  items={fruits}
  render={(item) => <span>{item}</span>}
/>;
```

#### Props

| Prop           | Type                                           | Required | Description                                    |
| -------------- | ---------------------------------------------- | -------- | ---------------------------------------------- |
| `items`        | `T[]`                                          | -        | Array data to render                           |
| `render`       | `(item: T, index: number) => ReactNode`        | Yes      | Render function for each item                  |
| `keyExtractor` | `(item: T, index: number) => string \| number` | -        | Function to extract a unique key for each item |
| `direction`    | `'row' \| 'column'`                            | -        | List direction (default: `'column'`)           |
| `liProps`      | `ComponentProps<'li'>`                         | -        | Props passed to each `<li>` element            |
| `className`    | `string`                                       | -        | Class name added to the `<ul>` element         |

All standard HTML attributes for `<ul>` are also supported.

#### Object Array Example

```tsx
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

<List
  items={users}
  render={(user) => <span>{user.name}</span>}
  keyExtractor={(user) => user.id}
  direction='row'
/>;
```

---

### VisibleGuard

A component for declarative conditional rendering.
Replaces ternary operators and `&&` patterns with a more expressive approach.

```tsx
import { VisibleGuard } from 'components-kits';

<VisibleGuard isVisible={isLoggedIn}>
  <Dashboard />
</VisibleGuard>;
```

#### Props

| Prop        | Type        | Required | Description                                                        |
| ----------- | ----------- | -------- | ------------------------------------------------------------------ |
| `isVisible` | `boolean`   | Yes      | Renders children when `true`                                       |
| `fallback`  | `ReactNode` | -        | Element to render when `isVisible` is `false` (default: `null`)    |
| `children`  | `ReactNode` | -        | Content to render when the condition is met                        |

#### Fallback Example

```tsx
<VisibleGuard
  isVisible={isLoaded}
  fallback={<Spinner />}
>
  <Content />
</VisibleGuard>
```

---

### SwitchCase

A component for declarative value-based conditional rendering.
Replaces ternary chaining and if/else blocks with a JSX-native `switch/case`.

```tsx
import { SwitchCase } from 'components-kits';

<SwitchCase
  value={status}
  cases={{
    loading: <Spinner />,
    error: <ErrorMessage />,
    success: <Content />,
  }}
  defaultCase={<Empty />}
/>
```

#### Props

| Prop          | Type                                    | Required | Description                                              |
| ------------- | --------------------------------------- | -------- | -------------------------------------------------------- |
| `value`       | `string \| number`                      | Yes      | Value to match against                                   |
| `cases`       | `Record<string \| number, ReactNode>`   | Yes      | Map of values to rendered content                        |
| `defaultCase` | `ReactNode`                             | -        | Element to render when no case matches (default: `null`) |

---

### Portal

A `createPortal` wrapper component. Renders children into a specified DOM node.

```tsx
import { Portal } from 'components-kits';

<Portal container="#modal-root">
  <Dialog />
</Portal>
```

#### Props

| Prop        | Type                 | Required | Description                                               |
| ----------- | -------------------- | -------- | --------------------------------------------------------- |
| `container` | `Element \| string`  | -        | DOM element or CSS selector (default: `document.body`)    |
| `children`  | `ReactNode`          | -        | Content to render through the portal                      |

- SSR-safe (renders only after mount)
- Renders nothing if the selector does not match any element

---

### InfiniteList

An IntersectionObserver-based infinite scroll list component.
Places a sentinel element at the bottom of the list and triggers a callback when it enters the viewport.

```tsx
import { InfiniteList } from 'components-kits';

<InfiniteList
  items={data}
  render={(item) => <Card {...item} />}
  keyExtractor={(item) => item.id}
  onIntersect={fetchNextPage}
  enabled={hasNextPage}
  observerOptions={{ rootMargin: '200px' }}
/>
```

#### Props

| Prop              | Type                                           | Required | Description                                          |
| ----------------- | ---------------------------------------------- | -------- | ---------------------------------------------------- |
| `items`           | `T[]`                                          | -        | Array data to render                                 |
| `render`          | `(item: T, index: number) => ReactNode`        | Yes      | Render function for each item                        |
| `keyExtractor`    | `(item: T, index: number) => string \| number` | -        | Function to extract a unique key for each item       |
| `liProps`         | `ComponentProps<'li'>`                         | -        | Props passed to each `<li>` element                  |
| `onIntersect`     | `() => void`                                   | Yes      | Callback fired when sentinel enters the viewport     |
| `enabled`         | `boolean`                                      | -        | Disables the observer when `false` (default: `true`) |
| `observerOptions` | `IntersectionObserverInit`                     | -        | `root`, `rootMargin`, `threshold` observer options   |

All standard HTML attributes for `<ul>` are also supported.

- The sentinel `<div>` is only rendered when `items` has at least one item and `enabled` is `true`
- Set `enabled={false}` once all data has been loaded to deactivate the observer

## License

MIT
