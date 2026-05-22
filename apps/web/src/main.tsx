import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createInithiumStore } from '@inithium/store';
import { Checkbox, Input, Select, Switch } from '@inithium/ui';
import { ThemeColor } from '@inithium/types';
import './styles.css';

const store = createInithiumStore();
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const colors: ThemeColor[] = [
  'primary', 'secondary', 'accent', 'success', 'warning', 'danger',
  'surface', 'surface2', 'surface3', 'surface4'
];

const variants = ['outline', 'filled', 'standard'] as const;
const sizes = ['sm', 'md', 'lg'] as const;

const mockOptions = [
  { value: 'opt-1', label: 'Option Parameters Alpha' },
  { value: 'opt-2', label: 'Option Parameters Beta' },
  { value: 'opt-3', label: 'Option Parameters Gamma' },
];

const MatrixSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10 p-6 bg-slate-900/40 rounded-xl border border-slate-800 backdrop-blur-xs">
    <h2 className="text-xl font-bold text-slate-100 mb-6 tracking-wide border-b border-slate-800 pb-2">{title}</h2>
    <div className="flex flex-col gap-6">{children}</div>
  </div>
);

const Label = ({ text }: { text: string }) => (
  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">{text}</span>
);

const App = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
      <header className="mb-12">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tight">
          Component Battle Ground
        </h1>
        <p className="text-slate-400 mt-2 text-sm">Testing suite validation for the modern floating structural fields.</p>
      </header>

      <MatrixSection title="5. Toggle Controls Matrix (Colors × Selection States)">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg">
    
    {/* Checkbox Col */}
    <div className="flex flex-col gap-6">
      <span className="text-xs font-black text-slate-400 border-b border-slate-100 pb-1 uppercase tracking-wider block">Checkbox Variants</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {colors.map((color) => (
          <div key={`checkbox-${color}`} className="flex flex-col gap-2 p-2 rounded-sm hover:bg-slate-50">
            <Checkbox
              color={color} 
              size="md" 
              label={`Check active ${color}`} 
              defaultChecked 
            />
          </div>
        ))}
      </div>
    </div>

    {/* Switch Col */}
    <div className="flex flex-col gap-6">
      <span className="text-xs font-black text-slate-400 border-b border-slate-100 pb-1 uppercase tracking-wider block">Switch Variants</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {colors.map((color) => (
          <div key={`switch-${color}`} className="flex flex-col gap-2 p-2 rounded-sm hover:bg-slate-50">
            <Switch
              color={color} 
              size="md" 
              label={`Toggle active ${color}`} 
              defaultChecked 
            />
          </div>
        ))}
      </div>
    </div>

  </div>
</MatrixSection>
    </div>
  );
};

root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);