import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createInithiumStore } from '@inithium/store';
import 'animate.css';
import './styles.css';

const store = createInithiumStore();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <div className="flex flex-col p-4">
          Battle Ground
        </div>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);