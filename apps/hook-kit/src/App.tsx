import { useState } from 'react';

import TestComponent from './test-component';

const App = () => {
  const [state, setState] = useState(false);

  return (
    <div>
      <button
        type='button'
        onClick={() => setState((prev) => !prev)}
      >
        open
      </button>
      {state && <TestComponent />}
    </div>
  );
};

export default App;
