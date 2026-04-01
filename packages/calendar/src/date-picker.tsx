'use client';

import * as React from 'react';
import { format, parse, isValid } from 'date-fns';
import { cva, cn } from 'brownie-ui-core';
import { Calendar } from './calendar';
import type { DatePickerProps } from './types';

const datePickerVariants = cva('relative inline-block');

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      placeholder = 'Pick a date',
      minDate,
      maxDate,
      disabled = false,
      className,
      format: formatString = 'PP',
    },
    ref
  ) => {
    const [internalDate, setInternalDate] = React.useState<Date | undefined>(defaultValue);
    const [isOpen, setIsOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');
    const containerRef = React.useRef<HTMLDivElement>(null);

    const selectedDate = value !== undefined ? value : internalDate;

    React.useEffect(() => {
      if (selectedDate) {
        setInputValue(format(selectedDate, formatString));
      } else {
        setInputValue('');
      }
    }, [selectedDate, formatString]);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDateChange = (date: Date) => {
      if (value === undefined) {
        setInternalDate(date);
      }
      onChange?.(date);
      setIsOpen(false);
    };

    const handleClear = () => {
      if (value === undefined) {
        setInternalDate(undefined);
      }
      onChange?.(undefined);
      setInputValue('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      // Try to parse the date
      try {
        const parsedDate = parse(newValue, formatString, new Date());
        if (isValid(parsedDate)) {
          if (value === undefined) {
            setInternalDate(parsedDate);
          }
          onChange?.(parsedDate);
        }
      } catch {
        // Invalid date, just update the input value
      }
    };

    return (
      <div ref={containerRef} className={cn(datePickerVariants(), className)}>
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'w-full px-4 py-2 pr-20 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg',
              'focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent',
              'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
              'placeholder:text-gray-400'
            )}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {selectedDate && !disabled && (
              <button
                onClick={handleClear}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear date"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              onClick={() => !disabled && setIsOpen(!isOpen)}
              disabled={disabled}
              className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Open calendar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
        </div>

        {isOpen && !disabled && (
          <div className="absolute z-50 mt-2 p-4 bg-white rounded-xl shadow-lg border border-gray-200 min-w-[320px]">
            <Calendar
              value={selectedDate}
              onChange={handleDateChange}
              minDate={minDate}
              maxDate={maxDate}
            />
          </div>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';
