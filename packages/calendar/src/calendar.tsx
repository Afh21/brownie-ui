'use client';

import * as React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfDay,
  isToday,
} from 'date-fns';
import { cva, cn } from 'brownie-ui-core';
import type { CalendarProps, CalendarView } from './types';

const calendarVariants = cva('w-full');

const dayButtonVariants = cva(
  'h-9 w-9 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1',
  {
    variants: {
      variant: {
        default: 'hover:bg-gray-100',
        selected: 'bg-stone-900 text-white hover:bg-stone-800',
        today: 'bg-orange-500 text-white hover:bg-orange-600',
        outside: 'text-gray-300',
        disabled: 'text-gray-300 cursor-not-allowed',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      minDate,
      maxDate,
      disabledDates = [],
      className,
      view: controlledView,
      onViewChange,
    },
    ref
  ) => {
    const [internalDate, setInternalDate] = React.useState(() =>
      startOfDay(defaultValue || new Date())
    );
    const [currentMonth, setCurrentMonth] = React.useState(() =>
      startOfMonth(defaultValue || new Date())
    );
    const [internalView, setInternalView] = React.useState<CalendarView>('month');

    const selectedDate = value !== undefined ? startOfDay(value) : internalDate;
    const view = controlledView !== undefined ? controlledView : internalView;

    const handleDateChange = (date: Date) => {
      const normalizedDate = startOfDay(date);
      if (value === undefined) {
        setInternalDate(normalizedDate);
      }
      onChange?.(normalizedDate);
    };

    const handleViewChange = (newView: CalendarView) => {
      if (controlledView === undefined) {
        setInternalView(newView);
      }
      onViewChange?.(newView);
    };

    const handlePreviousMonth = () => {
      setCurrentMonth((prev) => subMonths(prev, 1));
    };

    const handleNextMonth = () => {
      setCurrentMonth((prev) => addMonths(prev, 1));
    };

    const handleToday = () => {
      const today = startOfDay(new Date());
      setCurrentMonth(startOfMonth(today));
      handleDateChange(today);
    };

    const isDateDisabled = (date: Date): boolean => {
      if (minDate && date < startOfDay(minDate)) return true;
      if (maxDate && date > startOfDay(maxDate)) return true;
      return disabledDates.some((disabled) => isSameDay(date, disabled));
    };

    const getDaysInMonth = (): Date[] => {
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(monthStart);
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
      const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

      const days: Date[] = [];
      let day = calendarStart;

      while (day <= calendarEnd) {
        days.push(day);
        day = addDays(day, 1);
      }

      return days;
    };

    const days = getDaysInMonth();
    const weekRows = Math.ceil(days.length / 7);

    return (
      <div ref={ref} className={cn(calendarVariants(), className)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePreviousMonth}
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Previous month"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Next month"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToday}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Today
            </button>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {(['week', 'month'] as CalendarView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => handleViewChange(v)}
                  className={cn(
                    'px-3 py-1 text-sm font-medium rounded-md transition-colors capitalize',
                    view === v
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Week days header */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isTodayDate = isToday(day);
            const isDisabled = isDateDisabled(day);

            let variant: 'default' | 'selected' | 'today' | 'outside' | 'disabled' =
              'default';

            if (isDisabled) variant = 'disabled';
            else if (isSelected) variant = 'selected';
            else if (isTodayDate) variant = 'today';
            else if (!isCurrentMonth) variant = 'outside';

            return (
              <div
                key={index}
                className="flex items-center justify-center p-1"
              >
                <button
                  onClick={() => !isDisabled && handleDateChange(day)}
                  disabled={isDisabled}
                  className={cn(dayButtonVariants({ variant }))}
                >
                  {format(day, 'd')}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

Calendar.displayName = 'Calendar';
