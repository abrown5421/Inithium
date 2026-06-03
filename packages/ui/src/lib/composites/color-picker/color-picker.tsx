import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { ColorPickerProps } from './color-picker.types';
import { Input } from '../../components';

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value = '',
  onChange,
  onColorChange,
  fullWidth = false,
  ...restProps
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const isOutside = containerRef.current && !containerRef.current.contains(event.target as Node);
      if (isOutside) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
    if (onColorChange) {
      onColorChange(e.target.value);
    }
  };

  const handlePickerChange = (newHex: string) => {
    if (onColorChange) {
      onColorChange(newHex);
    }
    if (onChange) {
      const simulatedEvent = {
        target: { value: newHex },
        currentTarget: { value: newHex }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(simulatedEvent);
    }
  };

  const togglePicker = () => setIsOpen((prev) => !prev);

  const isValidHex = (hexStr: string): boolean => 
    /^#([A-Fa-f0-9]{3}){1,2}$|^#([A-Fa-f0-9]{4}){1,2}$/.test(hexStr);

  const activeColor = isValidHex(value) ? value : '#ffffff';

  return (
    <div 
      ref={containerRef} 
      className={`relative inline-block ${fullWidth ? 'w-full' : 'w-72'}`}
    >
      <div className="relative w-full">
        <Input
          {...restProps}
          value={value}
          onChange={handleTextChange}
          fullWidth={fullWidth}
          onClick={togglePicker}
          className="pr-12"
        />
        <div 
          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-sm border border-slate-300 pointer-events-none z-20"
          style={{ backgroundColor: activeColor }}
        />
      </div>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-50 shadow-xl bg-white p-2 rounded-md border border-slate-200">
          <HexColorPicker color={activeColor} onChange={handlePickerChange} />
        </div>
      )}
    </div>
  );
};