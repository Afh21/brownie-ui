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
  addWeeks,
  subWeeks,
  startOfWeek as startOfWeekFn,
  getHours,
  setHours,
  setMinutes,
} from 'date-fns';
import { cva, cn } from 'brownie-ui-core';
import type { EventCalendarProps, CalendarEvent, EventCategory, CalendarView } from './types';

const eventCalendarVariants = cva('w-full');
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 24 }, (_, i) => i);

const defaultCategories: EventCategory[] = [
  { id: 'dance', name: 'Dance', color: '#8b5cf6' },
  { id: 'music', name: 'Music', color: '#3b82f6' },
  { id: 'sport', name: 'Sport', color: '#ec4899' },
  { id: 'water', name: 'Water', color: '#eab308' },
];

interface DragState {
  event: CalendarEvent | null;
  sourceDate: Date | null;
}

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
    const [internalDate, setInternalDate] = React.useState(() => startOfDay(defaultValue || new Date()));
    const [currentMonth, setCurrentMonth] = React.useState(() => startOfMonth(defaultValue || new Date()));
    const [internalView, setInternalView] = React.useState<CalendarView>('month');
    const [dragState, setDragState] = React.useState<DragState>({ event: null, sourceDate: null });
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [tooltip, setTooltip] = React.useState<{ event: CalendarEvent; x: number; y: number } | null>(null);
    const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedSlot, setSelectedSlot] = React.useState<{ date: Date; hour?: number } | null>(null);
    
    // Form state for create/edit
    const [formData, setFormData] = React.useState<Partial<CalendarEvent>>({
      title: '',
      description: '',
      category: '',
      allDay: false,
    });

    const selectedDate = value !== undefined ? startOfDay(value) : internalDate;
    const view = controlledView !== undefined ? controlledView : internalView;

    const handleDateChange = (date: Date) => {
      const normalizedDate = startOfDay(date);
      if (value === undefined) setInternalDate(normalizedDate);
      onChange?.(normalizedDate);
    };

    const handleViewChange = (newView: CalendarView) => {
      if (controlledView === undefined) setInternalView(newView);
      onViewChange?.(newView);
    };

    const handlePrevious = () => {
      setIsAnimating(true);
      setTimeout(() => {
        if (view === 'month') {
          setCurrentMonth((prev) => subMonths(prev, 1));
        } else if (view === 'week') {
          setCurrentMonth((prev) => subWeeks(prev, 1));
        }
        setIsAnimating(false);
      }, 150);
    };

    const handleNext = () => {
      setIsAnimating(true);
      setTimeout(() => {
        if (view === 'month') {
          setCurrentMonth((prev) => addMonths(prev, 1));
        } else if (view === 'week') {
          setCurrentMonth((prev) => addWeeks(prev, 1));
        }
        setIsAnimating(false);
      }, 150);
    };

    const handleToday = () => {
      const today = startOfDay(new Date());
      setCurrentMonth(startOfMonth(today));
      handleDateChange(today);
    };

    const getEventsForDay = (day: Date): CalendarEvent[] => {
      return events.filter((event) => isSameDay(startOfDay(event.start), day));
    };

    const getEventsForHour = (day: Date, hour: number): CalendarEvent[] => {
      return events.filter((event) => {
        if (event.allDay) return false;
        const eventStart = new Date(event.start);
        return isSameDay(eventStart, day) && getHours(eventStart) === hour;
      });
    };

    const getCategoryColor = (categoryId?: string): string => {
      if (!categoryId) return '#6b7280';
      const category = categories.find((c) => c.id === categoryId);
      return category?.color || '#6b7280';
    };

    const handleDragStart = (event: CalendarEvent, e: React.DragEvent) => {
      if (!editable) return;
      setDragState({ event, sourceDate: event.start });
      e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, day: Date, hour?: number) => {
      e.preventDefault();
      if (!dragState.event || !onDrop) return;

      let newDate = startOfDay(day);
      if (hour !== undefined && !dragState.event.allDay) {
        newDate = setHours(setMinutes(newDate, 0), hour);
      }

      onDrop(dragState.event, newDate);
      setDragState({ event: null, sourceDate: null });
    };

    const handleCellClick = (day: Date, hour?: number) => {
      if (!editable) return;
      setSelectedSlot({ date: day, hour });
      setFormData({
        title: '',
        description: '',
        category: categories[0]?.id || '',
        allDay: hour === undefined,
      });
      setIsModalOpen(true);
    };

    const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
      e.stopPropagation();
      if (onEventClick) {
        onEventClick(event);
      } else if (editable) {
        setSelectedEvent(event);
        setFormData({
          title: event.title,
          description: event.description || '',
          category: event.category || '',
          allDay: event.allDay || false,
        });
        setIsModalOpen(true);
      }
    };

    const handleSaveEvent = () => {
      if (!formData.title || !selectedSlot) return;

      const eventData: Omit<CalendarEvent, 'id'> = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        allDay: formData.allDay,
        start: selectedSlot.date,
        end: selectedSlot.date,
      };

      if (selectedEvent && onEventUpdate) {
        onEventUpdate({ ...selectedEvent, ...eventData });
      } else if (onEventCreate) {
        onEventCreate(eventData);
      }

      setIsModalOpen(false);
      setSelectedEvent(null);
      setSelectedSlot(null);
    };

    const handleDeleteEvent = () => {
      if (selectedEvent && onEventDelete) {
        onEventDelete(selectedEvent.id);
      }
      setIsModalOpen(false);
      setSelectedEvent(null);
    };

    const showTooltip = (event: CalendarEvent, e: React.MouseEvent) => {
      setTooltip({
        event,
        x: e.clientX + 10,
        y: e.clientY - 10,
      });
    };

    const hideTooltip = () => {
      setTooltip(null);
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

    const getDaysInWeek = (): Date[] => {
      const weekStart = startOfWeekFn(currentMonth, { weekStartsOn: 1 });
      const days: Date[] = [];
      for (let i = 0; i < 7; i++) {
        days.push(addDays(weekStart, i));
      }
      return days;
    };

    const formatEventTime = (event: CalendarEvent): string => {
      if (event.allDay) return 'All day';
      return format(event.start, 'HH:mm') + ' - ' + format(event.end, 'HH:mm');
    };

    const days = view === 'month' ? getDaysInMonth() : getDaysInWeek();

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
                onClick={handlePrevious}
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Previous"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Next"
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
              {(['week', 'month', 'day'] as CalendarView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => handleViewChange(v)}
                  className={cn(
                    'px-3 py-1 text-sm font-medium rounded-md transition-colors capitalize',
                    view === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
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

        {/* Calendar grid with animation */}
        <div className={cn(
          'transition-all duration-150',
          isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        )}>
          {view === 'month' && (
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
                      'min-h-[100px] p-2 border border-gray-100 rounded-lg transition-colors',
                      isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                      isSelected && 'ring-2 ring-stone-900',
                      editable && onDrop && 'cursor-pointer hover:bg-gray-50'
                    )}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day)}
                    onClick={() => handleCellClick(day)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={cn(
                          'text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full',
                          isTodayDate ? 'bg-orange-500 text-white' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                        )}
                      >
                        {format(day, 'd')}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="text-xs text-gray-400">{dayEvents.length}</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          draggable={editable && !!onDrop}
                          onDragStart={(e) => handleDragStart(event, e)}
                          onClick={(e) => handleEventClick(event, e)}
                          onMouseEnter={(e) => showTooltip(event, e)}
                          onMouseLeave={hideTooltip}
                          className="text-xs px-2 py-1 rounded-md cursor-pointer truncate transition-all hover:scale-105 hover:shadow-md"
                          style={{
                            backgroundColor: `${getCategoryColor(event.category)}20`,
                            color: getCategoryColor(event.category),
                            borderLeft: `3px solid ${getCategoryColor(event.category)}`,
                          }}
                        >
                          <div className="flex items-center gap-1">
                            {!event.allDay && <span className="opacity-70">{format(event.start, 'HH:mm')}</span>}
                            <span className="truncate">{event.title}</span>
                          </div>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500 px-2">+{dayEvents.length - 3} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {view === 'week' && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Week header */}
              <div className="grid grid-cols-8 bg-gray-50 border-b border-gray-200">
                <div className="p-2 text-center text-sm font-medium text-gray-500">Time</div>
                {days.map((day) => (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      'p-2 text-center border-l border-gray-200',
                      isSameDay(day, selectedDate) && 'bg-orange-50'
                    )}
                  >
                    <div className="text-sm font-semibold text-gray-900">{format(day, 'EEE')}</div>
                    <div
                      className={cn(
                        'text-lg w-8 h-8 mx-auto flex items-center justify-center rounded-full',
                        isToday(day) ? 'bg-orange-500 text-white' : 'text-gray-600'
                      )}
                    >
                      {format(day, 'd')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Hour rows */}
              <div className="max-h-[600px] overflow-y-auto">
                {hours.map((hour) => (
                  <div key={hour} className="grid grid-cols-8 border-b border-gray-100 min-h-[60px]">
                    <div className="p-2 text-center text-xs text-gray-500 border-r border-gray-200 bg-gray-50">
                      {format(setHours(new Date(), hour), 'HH:mm')}
                    </div>
                    {days.map((day) => {
                      const hourEvents = getEventsForHour(day, hour);
                      return (
                        <div
                          key={`${day}-${hour}`}
                          className={cn(
                            'p-1 border-l border-gray-100 relative',
                            editable && 'cursor-pointer hover:bg-gray-50'
                          )}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, day, hour)}
                          onClick={() => handleCellClick(day, hour)}
                        >
                          {hourEvents.map((event) => (
                            <div
                              key={event.id}
                              draggable={editable && !!onDrop}
                              onDragStart={(e) => handleDragStart(event, e)}
                              onClick={(e) => handleEventClick(event, e)}
                              onMouseEnter={(e) => showTooltip(event, e)}
                              onMouseLeave={hideTooltip}
                              className="text-xs px-2 py-1 rounded cursor-pointer mb-1 transition-all hover:scale-105"
                              style={{
                                backgroundColor: getCategoryColor(event.category),
                                color: 'white',
                              }}
                            >
                              {format(event.start, 'HH:mm')} {event.title}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        {showLegend && categories.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: category.color }} />
                <span className="text-sm text-gray-600">{category.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tooltip */}
        {tooltip && (
          <div
            className="fixed z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg pointer-events-none"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            <div className="font-semibold">{tooltip.event.title}</div>
            <div className="text-gray-300 text-xs">{formatEventTime(tooltip.event)}</div>
            {tooltip.event.description && <div className="text-gray-400 text-xs mt-1">{tooltip.event.description}</div>}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedEvent ? 'Edit Event' : 'Create Event'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                    placeholder="Event title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                    rows={3}
                    placeholder="Event description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="allDay"
                    checked={formData.allDay}
                    onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
                    className="w-4 h-4 text-stone-900 border-gray-300 rounded focus:ring-stone-900"
                  />
                  <label htmlFor="allDay" className="text-sm text-gray-700">
                    All day event
                  </label>
                </div>

                <div className="text-sm text-gray-500">
                  Date: {selectedSlot ? format(selectedSlot.date, 'PPP') : ''}
                  {selectedSlot?.hour !== undefined && ` at ${format(setHours(new Date(), selectedSlot.hour), 'HH:mm')}`}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-6">
                {selectedEvent && onEventDelete && (
                  <button
                    onClick={handleDeleteEvent}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedEvent(null);
                    setSelectedSlot(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEvent}
                  disabled={!formData.title}
                  className="px-4 py-2 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedEvent ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

EventCalendar.displayName = 'EventCalendar';
