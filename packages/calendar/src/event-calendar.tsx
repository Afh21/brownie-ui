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
  parseISO,
} from 'date-fns';
import { cva, cn } from 'brownie-ui-core';
import type { EventCalendarProps, CalendarEvent, EventCategory, CalendarView } from './types';

const eventCalendarVariants = cva('w-full');

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const defaultCategories: EventCategory[] = [
  { id: 'dance', name: 'Dance', color: '#8b5cf6' },
  { id: 'music', name: 'Music', color: '#3b82f6' },
  { id: 'sport', name: 'Sport', color: '#ec4899' },
  { id: 'water', name: 'Water', color: '#eab308' },
];

export const EventCalendar = React.forwardRef<HTMLDivElement, EventCalendarProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      events,
      categories = defaultCategories,
      onEventClick,
      onEventCreate,
      onEventUpdate,
      onEventDelete,
      onDrop,
      editable = false,
      showLegend = true,
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
    const [draggedEvent, setDraggedEvent] = React.useState<CalendarEvent | null>(null);

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

    const getEventsForDay = (day: Date): CalendarEvent[] => {
      return events.filter((event) => isSameDay(startOfDay(event.start), day));
    };

    const getCategoryColor = (categoryId?: string): string => {
      if (!categoryId) return '#6b7280';
      const category = categories.find((c) => c.id === categoryId);
      return category?.color || '#6b7280';
    };

    const handleDragStart = (event: CalendarEvent) => {
      if (editable && onDrop) {
        setDraggedEvent(event);
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, day: Date) => {
      e.preventDefault();
      if (draggedEvent && onDrop) {
        onDrop(draggedEvent, day);
        setDraggedEvent(null);
      }
    };

    const getDaysInMonth = (): Date[] => {
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(monthStart);
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
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

    return (
      <div ref={ref} className={cn(eventCalendarVariants(), className)}>
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
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
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
            const dayEvents = getEventsForDay(day);

            return (
              <div
                key={index}
                className={cn(
                  'min-h-[80px] p-2 border border-gray-100 rounded-lg transition-colors',
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                  isSelected && 'ring-2 ring-stone-900',
                  editable && onDrop && 'cursor-pointer hover:bg-gray-50'
                )}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, day)}
                onClick={() => handleDateChange(day)}
              >
                {/* Day number */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      'text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full',
                      isTodayDate
                        ? 'bg-orange-500 text-white'
                        : isCurrentMonth
                        ? 'text-gray-900'
                        : 'text-gray-400'
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                </div>

                {/* Events */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      draggable={editable && !!onDrop}
                      onDragStart={() => handleDragStart(event)}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                      className="text-xs px-2 py-1 rounded-md cursor-pointer truncate transition-opacity hover:opacity-80"
                      style={{
                        backgroundColor: `${getCategoryColor(event.category)}20`,
                        color: getCategoryColor(event.category),
                        borderLeft: `3px solid ${getCategoryColor(event.category)}`,
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 px-2">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        {showLegend && categories.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-gray-600">{category.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

EventCalendar.displayName = 'EventCalendar';
