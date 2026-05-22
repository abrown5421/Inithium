import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createInithiumStore } from '@inithium/store';
import { Input, Select } from '@inithium/ui';
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

      <MatrixSection title="1. Style Matrix (Variants × Colors)">
        {variants.map((variant) => (
          <div key={variant} className="p-4 bg-slate-900/20 rounded-lg mb-6">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-6">Variant: {variant}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 p-6 bg-white rounded-lg border border-slate-200">
              
              {/* Inputs Col */}
              <div className="flex flex-col gap-6">
                <span className="text-xs font-black text-slate-400 border-b border-slate-100 pb-1 uppercase tracking-wider block">Input System</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {colors.map((color) => (
                    <div key={`input-${color}`} className="min-h-[4.5rem]">
                      <Label text={`input-${color}`} />
                      <Input variant={variant} color={color} label={`Focus tracing ${color}`} fullWidth />
                    </div>
                  ))}
                </div>
              </div>

              {/* Selects Col */}
              <div className="flex flex-col gap-6">
                <span className="text-xs font-black text-slate-400 border-b border-slate-100 pb-1 uppercase tracking-wider block">Select System</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {colors.map((color) => (
                    <div key={`select-${color}`} className="min-h-[4.5rem]">
                      <Label text={`select-${color}`} />
                      <Select variant={variant} color={color} label={`Select target ${color}`} options={mockOptions} fullWidth />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        ))}
      </MatrixSection>

      <MatrixSection title="2. Size Scale Optimization">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 rounded-lg">
          <div className="flex flex-col gap-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Input Heights</span>
            {sizes.map((size) => (
              <div key={`input-size-${size}`} className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-mono text-slate-500 uppercase">{size}</span>
                <div className="col-span-3">
                  <Input size={size} variant="outline" color="primary" label={`Scale container (${size})`} fullWidth />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Heights</span>
            {sizes.map((size) => (
              <div key={`select-size-${size}`} className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-mono text-slate-500 uppercase">{size}</span>
                <div className="col-span-3">
                  <Select size={size} variant="outline" color="primary" label={`Scale container (${size})`} options={mockOptions} fullWidth />
                </div>
              </div>
            ))}
          </div>
        </div>
      </MatrixSection>

      <MatrixSection title="3. Icon Layout Shifts & Default State Persistence">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg">
          <div>
            <Label text="Select with Vector Attachment Shift" />
            <Select leadingIcon="map-pin" variant="outline" color="accent" label="Region deployment destination" options={mockOptions} fullWidth />
          </div>
          <div>
            <Label text="Select with Initial Value Tracking" />
            <Select variant="filled" color="success" label="Active configuration profile" defaultValue="opt-2" options={mockOptions} fullWidth />
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