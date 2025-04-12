import React, { useState, useRef, useEffect } from 'react';

interface CustomDropdownProps {
  options: string[];
  onChange: (option: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, onChange }) => {
  // Start with no option selected.
  const [selected, setSelected] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // For when "Custom Question" is selected.
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

  // Check if the "Custom Question" option is selected.
  const isCustomSelected = selected === 'Custom Question';

  // When a regular option is selected.
  const handleSelectOption = (option: string) => {
    setSelected(option);
    // If a non-custom option is picked, notify the parent immediately.
    if (option !== 'Custom Question') {
      onChange(option);
    }
    setIsOpen(false);
  };

  // Update the custom input and notify the parent.
  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInput(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        // Fixed width so that "Select a question" has the same size as longer text
        className={`border border-black rounded-md px-4 min-h-10 w-[600px] text-left flex items-center ${
          selected === '' ? 'text-gray-500' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* 
          Display "Select a question" if nothing’s selected, 
          otherwise show either the custom text or the selected option 
        */}
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

      {/* Show the custom input below the dropdown if "Custom Question" is selected */}
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
