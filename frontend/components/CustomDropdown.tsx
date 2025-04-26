import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CustomDropdownProps {
  options: string[];
  onChange: (option: string) => void;
  placeholder?: string;
  className?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
  options, 
  onChange, 
  placeholder = 'Select a question',
  className = ''
}) => {
  const [selected, setSelected] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>('');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev => Math.min(prev + 1, options.length - 1));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          event.preventDefault();
          if (focusedIndex >= 0) {
            handleSelectOption(options[focusedIndex]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          break;
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, focusedIndex, options]);

  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.children;
      if (items[focusedIndex]) {
        items[focusedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  const isCustomSelected = selected === 'Custom Question';

  const handleSelectOption = (option: string) => {
    setSelected(option);
    if (option !== 'Custom Question') {
      onChange(option);
    }
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInput(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={`
          border border-gray-300 dark:border-gray-600 
          py-2 rounded-lg px-4 min-h-10 
          w-full sm:w-[400px] md:w-[500px] lg:w-[600px]
          text-left flex items-center justify-between
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          hover:border-gray-400 dark:hover:border-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-colors duration-200
          ${selected === '' ? 'text-gray-500 dark:text-gray-400' : ''}
        `}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">
          {selected === ''
            ? placeholder
            : isCustomSelected && customInput
            ? customInput
            : selected}
        </span>
        {isOpen? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          className={`
            absolute mt-1 border border-gray-300 dark:border-gray-600 
            rounded-md bg-white dark:bg-gray-800
            max-h-60 overflow-y-auto z-10
            w-full sm:w-[400px] md:w-[500px] lg:w-[600px]
            shadow-lg
          `}
          role="listbox"
        >
          {options.map((option, index) => (
            <li
              key={option}
              className={`
                p-2 cursor-pointer
                hover:bg-gray-100 dark:hover:bg-gray-700
                ${focusedIndex === index ? 'bg-gray-100 dark:bg-gray-700' : ''}
                transition-colors duration-200
              `}
              onClick={() => handleSelectOption(option)}
              onMouseEnter={() => setFocusedIndex(index)}
              role="option"
              aria-selected={selected === option}
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
          className={`
            border border-gray-300 dark:border-gray-600
            rounded-md px-4 mt-2 h-10
            w-full sm:w-[400px] md:w-[500px] lg:w-[600px]
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500
            transition-colors duration-200
          `}
        />
      )}
    </div>
  );
};

export default CustomDropdown;
