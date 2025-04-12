import React, { useState, useRef, useEffect } from 'react';

interface CustomDropdownProps {
  options: string[];
  onChange: (option: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, onChange }) => {
  const [selected, setSelected] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>('');
  
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isCustomSelected = selected === 'Custom Question';

  const handleSelectOption = (option: string) => {
    setSelected(option);
    if (option !== 'Custom Question') {
      onChange(option);
    }
    setIsOpen(false);
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInput(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={`border border-black rounded-md px-4 min-h-10 w-[600px] text-left flex items-center ${
          selected === '' ? 'text-gray-500' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected === ''
          ? 'Select a question'
          : isCustomSelected && customInput
          ? customInput
          : selected}
      </button>

      {isOpen && (
        <ul className="absolute mt-1 border border-black rounded-md bg-white max-h-40 overflow-y-auto z-10 w-[600px]">
          {options.map((option) => (
            <li
              key={option}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectOption(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}

      {isCustomSelected && (
        <input
          type="text"
          placeholder="Type your question here..."
          value={customInput}
          onChange={handleCustomInputChange}
          className="border border-black rounded-md px-4 mt-2 h-10 w-[600px]"
        />
      )}
    </div>
  );
};

export default CustomDropdown;
