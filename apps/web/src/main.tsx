import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createInithiumStore, selectActiveUser } from '@inithium/store';
import { bootstrapRegistry, TransitionRouter } from '@inithium/router';
import 'animate.css';
import './styles.css';
import Navbar from '../../../packages/ui/src/lib/composites/navbar/navbar';
import { Box } from '@inithium/ui';

bootstrapRegistry(
  import.meta.glob('../../../packages/pages/src/lib/**/*.tsx', { eager: false }) as any,
);

const store = createInithiumStore();

store.subscribe(() => {
  const activeUser = selectActiveUser(store.getState());
  console.log(activeUser);
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Box color='surface-contrast'>
          <Navbar />
          <TransitionRouter />
        </Box>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);