# babel-plugin-dev-strip

A Babel plugin that strips code blocks marked with a `@dev-only` comment directive from production builds.

## Installation

```bash
npm install babel-plugin-dev-strip --save-dev
```

## Usage

Add the plugin to your Babel configuration:

```json
{
  "plugins": ["babel-plugin-dev-strip"]
}
```

Then mark any code you want to remove in production with `// @dev-only`:

```js
// @dev-only
console.log('debug info:', data);

// @dev-only
if (window.__DEBUG__) {
  renderDebugOverlay();
  trackRenderCount(Component);
}

doSomething(); // this stays
```

After transformation:

```js
doSomething();
```

## Supported Patterns

### Statements (if, expressions, variable declarations, function declarations)

```js
// @dev-only
const debugInfo = computeDebugInfo();

// @dev-only
function debugHelper() {
  return 'debug';
}
```

### Class methods and properties

```js
class App {
  // @dev-only
  debugMode = true;

  // @dev-only
  debugMethod() {
    console.log('debug');
  }
}
```

### Object properties and methods

```js
const config = {
  // @dev-only
  debug: true,
  production: true,
};
```

### Block comments

```js
/* @dev-only */
console.log('this also works');
```

## Options

### `directive`

Type: `string`
Default: `'@dev-only'`

Customize the comment directive to match.

```json
{
  "plugins": [["babel-plugin-dev-strip", { "directive": "@test-only" }]]
}
```

```js
// @test-only
setupMocks();
```

## License

MIT
