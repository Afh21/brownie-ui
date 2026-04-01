'use client';

import * as React from 'react';
import { format, isBefore, isAfter, isSameDay } from 'date-fns';
import { cva, cn } from 'brownie-ui-core';
import { Calendar } from './calendar';
import type { DateRangePickerProps } from './types';

const dateRangePickerVariants = cva('relative inline-block');

export const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      placeholder = 'Pick a date range',
      minDate,
      maxDate,
      disabled = false,
      className,
    },
    ref
  ) => {
    const [internalRange, setInternalRange] = React.useState<{ start: Date; end: Date } | undefined>(
      defaultValue
    );
    const [isOpen, setIsOpen] = React.useState(false);
    const [selecting, setSelecting] = React.useState<'start' | 'end'>('start');
    const containerRef = React.useRef<HTMLDivElement>(null);

    const selectedRange = value !== undefined ? value : internalRange;

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDateClick = (date: Date) => {
      if (selecting === 'start') {
        const newRange = { start: date, end: date };
        if (value === undefined) {
          setInternalRange(newRange);
        }
        onChange?.(newRange);
        setSelecting('end');
      } else {
        if (selectedRange) {
          let newRange: { start: Date; end: Date };
          if (isBefore(date, selectedRange.start)) {
            newRange = { start: date, end: selectedRange.start };
          } else {
            newRange = { start: selectedRange.start, end: date };
          }
          if (value === undefined) {
            setInternalRange(newRange);
          }
          onChange?.(newRange);
          setSelecting('start');
          setIsOpen(false);
        }
      }
    };

    const handleClear = () => {
      if (value === undefined) {
        setInternalRange(undefined);
      }
      onChange?.(undefined);
      setSelecting('start');
    };

    const formatRange = () => {
      if (!selectedRange) return '';
      const { start, end } = selectedRange;
      if (isSameDay(start, end)) {
        return format(start, 'PP');
      }
      return `${format(start, 'PP')} - ${format(end, 'PP')}`;
    };

    const isDateInRange = (date: Date): boolean => {
      if (!selectedRange) return false;
      const { start, end } = selectedRange;
      return (
        (isAfter(date, start) || isSameDay(date, start)) &&
        (isBefore(date, end) || isSameDay(date, end))
      );
    };

    return (
      <div ref={containerRef} className={cn(dateRangePickerVariants(), className)}>
        <div className="relative">
          <input
            type="text"
            value={formatRange()}
            readOnly
            onClick={() => !disabled && setIsOpen(!isOpen)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'w-full px-4 py-2 pr-20 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg',
              'focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent',
              'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
              'placeholder:text-gray-400 cursor-pointer'
            )}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {selectedRange && !disabled && (
              <button
                onClick={handleClear}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear range"
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
            <div className="mb-3 text-sm text-gray-600">
              {selecting === 'start' ? 'Select start date' : 'Select end date'}
            </div>
            <Calendar
              value={selectedRange?.start}
              onChange={handleDateClick}
              minDate={minDate}
              maxDate={maxDate}
            />
          </div>
        )}
      </div>
    );
  }
);

DateRangePicker.displayName = 'DateRangePicker';
