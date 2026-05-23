import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createInithiumStore } from '@inithium/store';
import { bootstrapRegistry, TransitionRouter } from '@inithium/router';
import 'animate.css';
import './styles.css';

bootstrapRegistry(
  import.meta.glob('../../../packages/pages/src/lib/**/*.tsx', { eager: false }) as any,
);

const store = createInithiumStore();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <TransitionRouter />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);