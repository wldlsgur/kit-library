# components-kits

모던 React 애플리케이션 개발을 위한 경량 유틸리티 컴포넌트 라이브러리입니다.
반복적인 UI 패턴을 선언적으로 처리할 수 있도록 설계되었습니다.

## 설치

```bash
npm install components-kits
# or
pnpm add components-kits
```

### Peer Dependencies

- `react` ^18 || ^19
- `react-dom` ^18 || ^19

## 컴포넌트

### List

배열 데이터를 선언적으로 렌더링하는 제네릭 리스트 컴포넌트입니다.

```tsx
import { List } from 'components-kits';

const fruits = ['사과', '바나나', '체리'];

<List
  items={fruits}
  render={(item) => <span>{item}</span>}
/>;
```

#### Props

| Prop           | 타입                                           | 필수 | 설명                               |
| -------------- | ---------------------------------------------- | ---- | ---------------------------------- |
| `items`        | `T[]`                                          | -    | 렌더링할 배열 데이터               |
| `render`       | `(item: T, index: number) => ReactNode`        | O    | 각 항목의 렌더링 함수              |
| `keyExtractor` | `(item: T, index: number) => string \| number` | -    | 각 항목의 고유 key를 반환하는 함수 |
| `direction`    | `'row' \| 'column'`                            | -    | 리스트 방향 (기본값: `'column'`)   |
| `liProps`      | `ComponentProps<'li'>`                         | -    | 각 `<li>` 요소에 전달할 props      |
| `className`    | `string`                                       | -    | `<ul>` 요소에 추가할 클래스명      |

`<ul>` 요소의 모든 표준 HTML 속성도 지원합니다.

#### 객체 배열 사용 예시

```tsx
const users = [
  { id: 1, name: '홍길동' },
  { id: 2, name: '김철수' },
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

조건부 렌더링을 선언적으로 처리하는 컴포넌트입니다.
삼항 연산자나 `&&` 패턴 대신 명확한 의도를 드러내는 방식으로 조건부 렌더링을 수행합니다.

```tsx
import { VisibleGuard } from 'components-kits';

<VisibleGuard isVisible={isLoggedIn}>
  <Dashboard />
</VisibleGuard>;
```

#### Props

| Prop        | 타입        | 필수 | 설명                                                           |
| ----------- | ----------- | ---- | -------------------------------------------------------------- |
| `isVisible` | `boolean`   | O    | `true`이면 children을 렌더링                                   |
| `fallback`  | `ReactNode` | -    | `isVisible`이 `false`일 때 대신 렌더링할 요소 (기본값: `null`) |
| `children`  | `ReactNode` | -    | 조건이 충족될 때 렌더링할 콘텐츠                               |

#### fallback 사용 예시

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

값 기반 분기 렌더링을 선언적으로 처리하는 컴포넌트입니다.
삼항 연산자 체이닝이나 if/else 나열 대신 `switch/case`를 JSX로 표현합니다.

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

| Prop          | 타입                                | 필수 | 설명                                               |
| ------------- | ----------------------------------- | ---- | -------------------------------------------------- |
| `value`       | `string \| number`                  | O    | 매칭할 값                                          |
| `cases`       | `Record<string \| number, ReactNode>` | O    | 값에 대응하는 렌더링 맵                            |
| `defaultCase` | `ReactNode`                         | -    | 일치하는 case가 없을 때 렌더링할 요소 (기본값: `null`) |

---

### Portal

`createPortal` 래퍼 컴포넌트입니다. children을 지정된 DOM 노드에 렌더링합니다.

```tsx
import { Portal } from 'components-kits';

<Portal container="#modal-root">
  <Dialog />
</Portal>
```

#### Props

| Prop        | 타입               | 필수 | 설명                                                        |
| ----------- | ------------------ | ---- | ----------------------------------------------------------- |
| `container` | `Element \| string` | -    | DOM 요소 또는 CSS 선택자 (기본값: `document.body`)          |
| `children`  | `ReactNode`        | -    | 포털로 렌더링할 콘텐츠                                     |

- SSR 환경에서 안전하게 동작합니다 (마운트 후 렌더링)
- 선택자가 매칭되지 않으면 아무것도 렌더링하지 않습니다

---

### InfiniteList

IntersectionObserver 기반 무한 스크롤 리스트 컴포넌트입니다.
리스트 하단에 감지용 요소를 배치하고, 뷰포트에 진입하면 콜백을 실행합니다.

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

| Prop              | 타입                                           | 필수 | 설명                                                  |
| ----------------- | ---------------------------------------------- | ---- | ----------------------------------------------------- |
| `items`           | `T[]`                                          | -    | 렌더링할 배열 데이터                                  |
| `render`          | `(item: T, index: number) => ReactNode`        | O    | 각 항목의 렌더링 함수                                 |
| `keyExtractor`    | `(item: T, index: number) => string \| number` | -    | 각 항목의 고유 key를 반환하는 함수                    |
| `liProps`         | `ComponentProps<'li'>`                         | -    | 각 `<li>` 요소에 전달할 props                         |
| `onIntersect`     | `() => void`                                   | O    | 감지 요소가 뷰포트에 진입했을 때 호출되는 콜백        |
| `enabled`         | `boolean`                                      | -    | `false`이면 observer 비활성화 (기본값: `true`)        |
| `observerOptions` | `IntersectionObserverInit`                     | -    | `root`, `rootMargin`, `threshold` 옵저버 옵션         |

`<ul>` 요소의 모든 표준 HTML 속성도 지원합니다.

- 감지용 `<div>`는 `items`가 1개 이상이고 `enabled`일 때만 렌더링됩니다
- 데이터를 모두 불러온 후 `enabled={false}`로 observer를 비활성화하세요

## 라이선스

MIT
