'use client';

/**
 * EventCalendar - A customizable, headless calendar component with drag & drop support.
 * 
 * ## Customization Guide
 * 
 * ### 1. Custom Colors (via Categories)
 * Define your own color palette by passing the `categories` prop. Each event references
 * a category by its `id` to apply that color.
 * 
 * ```tsx
 * const categories = [
 *   { id: 'work', name: 'Work', color: '#3b82f6' },      // Blue
 *   { id: 'personal', name: 'Personal', color: '#10b981' }, // Green
 *   { id: 'urgent', name: 'Urgent', color: '#ef4444' },   // Red
 * ];
 * 
 * const events = [
 *   { id: '1', title: 'Meeting', start: date1, end: date2, category: 'work' }
 * ];
 * 
 * <EventCalendar categories={categories} events={events} />
 * ```
 * 
 * ### 2. Custom Event Rendering (Headless Mode)
 * Use the `renderEvent` prop to completely customize how events look.
 * You receive the event data and callback handlers to implement your own UI.
 * 
 * ```tsx
 * <EventCalendar
 *   renderEvent={(event, { variant, draggable, onDragStart, onClick }) => (
 *     <div
 *       draggable={draggable}
 *       onDragStart={onDragStart}
 *       onClick={onClick}
 *       style={{ background: getMyColor(event.category) }}
 *     >
 *       {event.title}
 *     </div>
 *   )}
 * />
 * ```
 * 
 * ### 3. Drag & Drop
 * Enable `editable` prop and handle `onEventDrop` to move events:
 * - Drop on a day (Month view) → moves event to that day
 * - Drop on an hour (Week/Day views) → moves event to that time slot
 * - Drop on top half of hour → :00 minutes
 * - Drop on bottom half of hour → :30 minutes
 * 
 * A success toast will confirm the move operation.
 * 
 * ### 4. Event Resizing
 * With `editable` and `onEventResize`, users can drag the bottom border
 * of events to extend/shorten duration in 30-minute increments.
 */

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
  isPast,
  addWeeks,
  subWeeks,
  getHours,
  setHours,
  startOfWeek as startOfWeekFn,
} from 'date-fns';
import { cva, cn } from 'brownie-ui-core';
import type { EventCalendarProps, CalendarEvent, EventCategory, CalendarView, HourFormat, CalendarSize } from './types';
import { getTranslations, type Locale } from './i18n';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

const eventCalendarVariants = cva('w-full');

const defaultCategories: EventCategory[] = [
  { id: 'dance', name: 'Dance', color: '#8b5cf6' },
  { id: 'music', name: 'Music', color: '#f97316' },
  { id: 'sport', name: 'Sport', color: '#ec4899' },
  { id: 'water', name: 'Water', color: '#eab308' },
];

// Memoized Week/Day Event component to prevent re-mounting
interface WeekDayEventProps {
  event: CalendarEvent;
  dayIndex: number;
  rowHeight: number;
  editable: boolean;
  getCategoryColor: (id?: string) => string;
  setDraggedEvent: (e: CalendarEvent | null) => void;
  onEventClick?: (e: CalendarEvent) => void;
  onEventResize?: (e: CalendarEvent, d: Date) => void;
  isDragging?: boolean;
  renderEvent?: EventCalendarProps['renderEvent'];
  t?: ReturnType<typeof getTranslations>;
  hourFormat?: HourFormat;
  startHour?: number;
  slot?: number;
  totalSlots?: number;
  columnWidthMultiplier?: number;
}

// Tooltip content component
const EventTooltipContent = ({ event, t }: { event: CalendarEvent; t?: ReturnType<typeof getTranslations> }) => (
  <div>
    <div className="font-semibold">{event.title}</div>
    <div className="text-gray-300 text-xs">
      {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
    </div>
    {event.description && (
      <div className="text-gray-400 text-xs mt-1 border-t border-gray-700 pt-1 max-w-[200px] truncate">
        {event.description}
      </div>
    )}
  </div>
);

const WeekDayEvent = React.memo(function WeekDayEvent({ 
  event, 
  dayIndex,
  rowHeight,
  editable,
  getCategoryColor,
  setDraggedEvent,
  onEventClick,
  onEventResize,
  isDragging = false,
  renderEvent,
  t,
  hourFormat = '24h',
  startHour = 0,
  slot = 0,
  totalSlots = 1,
  columnWidthMultiplier = 1,
}: WeekDayEventProps) {
  const itemRef = React.useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = React.useState(false);
  
  const durationHours = (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60);
  // Calculate top position: (hours from start of day * rowHeight) + (minutes proportion * rowHeight)
  const eventHour = event.start.getHours();
  const eventMinute = event.start.getMinutes();
  const top = ((eventHour - startHour) + (eventMinute / 60)) * rowHeight;
  const height = Math.max(durationHours * rowHeight - 2, 24); // Min height 24px

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!editable || !onEventResize) return;
    
    const startY = e.clientY;
    const startHeight = itemRef.current?.offsetHeight || height;
    
    setIsResizing(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!itemRef.current) return;
      const deltaY = moveEvent.clientY - startY;
      const snapHeight = rowHeight / 2;
      const rawHeight = startHeight + deltaY;
      const snappedHeight = Math.max(snapHeight, Math.round(rawHeight / snapHeight) * snapHeight);
      itemRef.current.style.height = `${snappedHeight}px`;
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      const deltaY = upEvent.clientY - startY;
      const halfHourBlocks = Math.round(deltaY / (rowHeight / 2));
      const deltaMinutes = halfHourBlocks * 30;
      
      if (deltaMinutes !== 0 && onEventResize) {
        const newEnd = new Date(event.end);
        newEnd.setMinutes(newEnd.getMinutes() + deltaMinutes);
        
        if (newEnd.getTime() - event.start.getTime() >= 30 * 60 * 1000) {
          onEventResize(event, newEnd);
        }
      }
      
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // If custom renderEvent is provided, use it
  if (renderEvent) {
    return (
      <div
        className={cn(
          'absolute z-20',
          isDragging && 'opacity-50 scale-95'
        )}
        style={{
          top: `${top}px`,
          left: `calc(${12.5 + (dayIndex * 12.5 * columnWidthMultiplier)}% + 2px + (${slot} * (12.5% * ${columnWidthMultiplier} - 4px) / ${totalSlots}))`,
          width: `calc((12.5% * ${columnWidthMultiplier} - 4px) / ${totalSlots} - 2px)`,
        }}
      >
        {renderEvent(event, {
          variant: 'week',
          isPastDay: false,
          draggable: editable && !isResizing,
          onDragStart: () => setDraggedEvent(event),
          onClick: () => onEventClick?.(event),
        })}
      </div>
    );
  }
  
  const eventContent = (
    <div
      ref={itemRef}
      className={cn(
        'absolute z-20 rounded px-1 py-px text-[9px] text-white font-medium overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-200',
        isDragging && 'opacity-50 scale-95 ring-2 ring-white shadow-lg'
      )}
      style={{
        backgroundColor: getCategoryColor(event.category),
        top: `${top}px`,
        height: `${height}px`,
        left: `calc(${12.5 + (dayIndex * 12.5 * columnWidthMultiplier)}% + 2px + (${slot} * (12.5% * ${columnWidthMultiplier} - 4px) / ${totalSlots}))`,
        width: `calc((12.5% * ${columnWidthMultiplier} - 4px) / ${totalSlots} - 2px)`,
        minHeight: '24px',
      }}
      draggable={editable && !isResizing}
      onDragStart={() => setDraggedEvent(event)}
      onClick={(e) => {
        e.stopPropagation();
        onEventClick?.(event);
      }}
    >
      <div className="truncate text-[9px] leading-none">{event.title}</div>
      
      {editable && onEventResize && (
        <div
          onMouseDown={handleMouseDown}
          className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-white/30 hover:bg-white/50 transition-colors flex items-end justify-center"
        >
          <div className="w-4 h-0.5 bg-white/70 rounded-full mb-0.5" />
        </div>
      )}
    </div>
  );

  // Wrap with Tooltip
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {eventContent}
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={4}>
        <EventTooltipContent event={event} t={t} />
      </TooltipContent>
    </Tooltip>
  );
});

// Memoized EventItem for month view
interface EventItemProps {
  event: CalendarEvent;
  variant?: 'month' | 'week' | 'day';
  showTime?: boolean;
  editable: boolean;
  getCategoryColor: (id?: string) => string;
  handleDragStart: (e: CalendarEvent) => void;
  onEventClick?: (e: CalendarEvent) => void;
  isPastDay?: boolean;
  renderEvent?: EventCalendarProps['renderEvent'];
  t?: ReturnType<typeof getTranslations>;
  hourFormat?: HourFormat;
}

const EventItem = React.memo(function EventItem({ 
  event, 
  variant = 'month',
  showTime = true,
  editable,
  getCategoryColor,
  handleDragStart,
  onEventClick,
  isPastDay = false,
  renderEvent,
  t,
  hourFormat = '24h',
}: EventItemProps) {
  // If custom renderEvent is provided, use it
  if (renderEvent) {
    return (
      <div className={cn(isPastDay && 'opacity-60')}>
        {renderEvent(event, {
          variant,
          isPastDay,
          draggable: editable && !isPastDay,
          onDragStart: () => handleDragStart(event),
          onClick: () => !isPastDay && onEventClick?.(event),
        })}
      </div>
    );
  }
  
  // Gray colors for past days
  const eventColor = isPastDay ? '#9ca3af' : getCategoryColor(event.category);
  
  const eventContent = (
    <div
      draggable={editable && !isPastDay}
      onDragStart={() => handleDragStart(event)}
      onClick={(e) => {
        if (isPastDay) return;
        e.stopPropagation();
        onEventClick?.(event);
      }}
      className={cn(
        'transition-all select-none relative group',
        isPastDay ? 'cursor-not-allowed opacity-60' : 'cursor-grab active:cursor-grabbing hover:scale-[1.02]',
        variant === 'month' && 'text-xs px-2 py-1 rounded truncate pr-5',
        !isPastDay && variant === 'month' && 'hover:shadow-sm',
        variant === 'week' && 'text-xs px-2 py-1 rounded mb-1 text-white font-medium',
        variant === 'day' && 'text-sm px-3 py-2 rounded-lg text-white font-medium shadow-sm'
      )}
      style={{
        backgroundColor: variant === 'month' ? `${eventColor}30` : eventColor,
        color: variant === 'month' ? eventColor : 'white',
        borderLeft: variant === 'month' ? `3px solid ${eventColor}` : undefined,
      }}
    >
      <div className="flex items-center gap-1">
        {!event.allDay && showTime && (
          <span className={cn('opacity-70', variant === 'month' ? 'text-[10px]' : 'text-xs')}>
            {format(event.start, 'HH:mm')}
          </span>
        )}
        <span className="truncate">{event.title}</span>
      </div>
      
      {/* Drag icon for month view - hidden for past days */}
      {variant === 'month' && editable && !isPastDay && (
        <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="2" cy="2" r="1.5" fill="currentColor" opacity="0.6"/>
            <circle cx="6" cy="2" r="1.5" fill="currentColor" opacity="0.6"/>
            <circle cx="10" cy="2" r="1.5" fill="currentColor" opacity="0.6"/>
            <circle cx="2" cy="6" r="1.5" fill="currentColor" opacity="0.6"/>
            <circle cx="6" cy="6" r="1.5" fill="currentColor" opacity="0.6"/>
            <circle cx="10" cy="6" r="1.5" fill="currentColor" opacity="0.6"/>
            <circle cx="2" cy="10" r="1.5" fill="currentColor" opacity="0.6"/>
            <circle cx="6" cy="10" r="1.5" fill="currentColor" opacity="0.6"/>
            <circle cx="10" cy="10" r="1.5" fill="currentColor" opacity="0.6"/>
          </svg>
        </div>
      )}
    </div>
  );

  // Only show tooltip for week/day views
  if (variant !== 'month') {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {eventContent}
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={4}>
          <EventTooltipContent event={event} t={t} />
        </TooltipContent>
      </Tooltip>
    );
  }

  return eventContent;
});

export const EventCalendar = React.forwardRef<HTMLDivElement, EventCalendarProps>(
  (
    {
      value,
      defaultDate,
      onChange,
      events = [],
      categories = defaultCategories,
      onEventClick,
      onSlotClick,
      onEventDrop,
      onEventResize,
      editable = false,
      showLegend = true,
      hourFormat = '24h',
      locale = 'es',
      renderEvent,
      className,
      view: controlledView,
      onViewChange,
      size = 'medium',
      startHour = 0,
      endHour = 24,
    },
    ref
  ) => {
    // Translations
    const t = getTranslations(locale as Locale);
    const weekDays = [t.mon, t.tue, t.wed, t.thu, t.fri, t.sat, t.sun];
    
    // Internal state
    const [internalDate, setInternalDate] = React.useState(() => startOfDay(defaultDate || new Date()));
    const [currentDate, setCurrentDate] = React.useState(() => startOfDay(defaultDate || new Date()));
    const [internalView, setInternalView] = React.useState<CalendarView>('month');
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [draggedEvent, setDraggedEvent] = React.useState<CalendarEvent | null>(null);
    const [dropTarget, setDropTarget] = React.useState<{ day: Date; hour?: number; isHalfHour?: boolean } | null>(null);
    
    // Controlled/uncontrolled handling
    const selectedDate = value !== undefined ? startOfDay(value) : internalDate;
    const view = controlledView !== undefined ? controlledView : internalView;
    
    // Generate hours array based on startHour and endHour
    const hours = React.useMemo(() => {
      const start = Math.max(0, Math.min(23, startHour));
      const end = Math.max(0, Math.min(24, endHour));
      
      if (end <= start) {
        // Crosses midnight (e.g., 19:00 to 03:00)
        const firstPart = Array.from({ length: 24 - start }, (_, i) => start + i);
        const secondPart = Array.from({ length: end }, (_, i) => i);
        return [...firstPart, ...secondPart];
      }
      
      return Array.from({ length: end - start }, (_, i) => start + i);
    }, [startHour, endHour]);

    const handleDateChange = (date: Date) => {
      const normalizedDate = startOfDay(date);
      if (value === undefined) setInternalDate(normalizedDate);
      onChange?.(normalizedDate);
    };

    const handleViewChange = (newView: CalendarView) => {
      if (controlledView === undefined) setInternalView(newView);
      onViewChange?.(newView);
    };

    // Navigation
    const handlePrevious = () => {
      setIsAnimating(true);
      setTimeout(() => {
        if (view === 'month') setCurrentDate((prev) => subMonths(prev, 1));
        else if (view === 'week') setCurrentDate((prev) => subWeeks(prev, 1));
        else if (view === 'day') setCurrentDate((prev) => addDays(prev, -1));
        setIsAnimating(false);
      }, 150);
    };

    const handleNext = () => {
      setIsAnimating(true);
      setTimeout(() => {
        if (view === 'month') setCurrentDate((prev) => addMonths(prev, 1));
        else if (view === 'week') setCurrentDate((prev) => addWeeks(prev, 1));
        else if (view === 'day') setCurrentDate((prev) => addDays(prev, 1));
        setIsAnimating(false);
      }, 150);
    };

    const handleToday = () => {
      const today = startOfDay(new Date());
      setCurrentDate(today);
      handleDateChange(today);
    };

    // Helpers
    const getEventsForDay = (day: Date): CalendarEvent[] => 
      events.filter((event) => isSameDay(startOfDay(event.start), day));

    const getEventsForHour = (day: Date, hour: number): CalendarEvent[] =>
      events.filter((event) => {
        if (event.allDay) return false;
        const eventStart = new Date(event.start);
        return isSameDay(eventStart, day) && getHours(eventStart) === hour;
      });

    const getCategoryColor = (categoryId?: string): string => {
      if (!categoryId) return '#6b7280';
      return categories.find((c) => c.id === categoryId)?.color || '#6b7280';
    };

    const formatEventTime = (event: CalendarEvent): string => {
      if (event.allDay) return t.allDay;
      const timeFormat = hourFormat === '12h' ? 'hh:mm a' : 'HH:mm';
      return `${format(event.start, timeFormat)} - ${format(event.end, timeFormat)}`;
    };

    const getEventDurationHours = (event: CalendarEvent): number => {
      if (event.allDay) return 1;
      const diffMs = event.end.getTime() - event.start.getTime();
      return diffMs / (1000 * 60 * 60); // Convert to hours
    };

    const getEventStartMinutes = (event: CalendarEvent): number => {
      return event.start.getHours() * 60 + event.start.getMinutes();
    };

    const formatHour = (hour: number): string => {
      const date = setHours(startOfDay(new Date()), hour);
      return hourFormat === '12h' ? format(date, 'h:mm a') : format(date, 'HH:mm');
    };

    // Drag & drop handlers
    const handleDragStart = (event: CalendarEvent) => {
      if (!editable) return;
      setDraggedEvent(event);
    };

    const handleDragOver = (e: React.DragEvent, day: Date, hour?: number, rowHeight?: number) => {
      e.preventDefault();
      if (draggedEvent && hour !== undefined) {
        // Calculate if hovering over upper half (:00) or lower half (:30)
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const cellHeight = rect.height || rowHeight || 60;
        const relativeY = e.clientY - rect.top;
        const isHalfHour = relativeY > cellHeight / 2;
        
        setDropTarget({ day, hour, isHalfHour });
      } else if (draggedEvent) {
        setDropTarget({ day });
      }
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setDropTarget(null);
    };

    const handleDrop = (e: React.DragEvent, day: Date, hour?: number, rowHeight?: number) => {
      e.preventDefault();
      setDropTarget(null);
      if (!draggedEvent || !onEventDrop) return;
      
      let newDate = startOfDay(day);
      let timeLabel = '';
      
      if (hour !== undefined && !draggedEvent.allDay) {
        // Week/Day view: drop on specific hour slot
        // Calculate if drop is on the upper half (:00) or lower half (:30) of the hour cell
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const cellHeight = rect.height || rowHeight || 60;
        const relativeY = e.clientY - rect.top;
        const isHalfHour = relativeY > cellHeight / 2;
        
        newDate = setHours(newDate, hour);
        if (isHalfHour) {
          newDate.setMinutes(30);
          timeLabel = `${hour}:30`;
        } else {
          newDate.setMinutes(0);
          timeLabel = `${hour}:00`;
        }
      } else if (!draggedEvent.allDay) {
        // Month view: preserve original event time
        newDate.setHours(draggedEvent.start.getHours());
        newDate.setMinutes(draggedEvent.start.getMinutes());
        timeLabel = format(draggedEvent.start, 'HH:mm');
      } else {
        timeLabel = t.allDay;
      }
      
      onEventDrop(draggedEvent, newDate);
      setDraggedEvent(null);
    };

    // Resizable event item for week/day views
    const ResizableEventItem = ({ 
      event, 
      variant = 'week',
      rowHeight = 60
    }: { 
      event: CalendarEvent; 
      variant?: 'week' | 'day';
      rowHeight?: number;
    }) => {
      const itemRef = React.useRef<HTMLDivElement>(null);
      const [isResizing, setIsResizing] = React.useState(false);
      const [resizeState, setResizeState] = React.useState<{ startY: number; startHeight: number } | null>(null);

      const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!editable || !onEventResize) return;
        
        const startY = e.clientY;
        const startHeight = itemRef.current?.offsetHeight || rowHeight;
        
        setIsResizing(true);
        setResizeState({ startY, startHeight });

        const handleMouseMove = (moveEvent: MouseEvent) => {
          if (!itemRef.current) return;
          const deltaY = moveEvent.clientY - startY;
          const newHeight = Math.max(rowHeight, startHeight + deltaY);
          itemRef.current.style.height = `${newHeight}px`;
        };

        const handleMouseUp = (upEvent: MouseEvent) => {
          const deltaY = upEvent.clientY - startY;
          // Use floor for positive (extend down) and ceil for negative (shrink up)
          const deltaHours = deltaY > 0 ? Math.floor(deltaY / rowHeight) : Math.ceil(deltaY / rowHeight);
          
          if (deltaHours !== 0 && onEventResize) {
            const newEnd = new Date(event.end);
            newEnd.setHours(newEnd.getHours() + deltaHours);
            
            // Ensure at least 30 minutes duration
            const minDuration = 30 * 60 * 1000; // 30 minutes in ms
            if (newEnd.getTime() - event.start.getTime() >= minDuration) {
              onEventResize(event, newEnd);
            }
          }
          
          setIsResizing(false);
          setResizeState(null);
          
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      };

      const handleDragStart = (e: React.DragEvent) => {
        if (isResizing) {
          e.preventDefault();
          return;
        }
        if (!editable) return;
        setDraggedEvent(event);
      };
      
      const durationHours = getEventDurationHours(event);
      const height = Math.max(rowHeight, durationHours * rowHeight - 4); // -4 for gap
      
      const eventContent = (
        <div
          ref={itemRef}
          className={cn(
            'relative cursor-pointer text-white font-medium z-10',
            variant === 'week' && 'text-xs px-2 py-1 rounded',
            variant === 'day' && 'text-sm px-3 py-2 rounded-lg shadow-sm'
          )}
          style={{
            backgroundColor: getCategoryColor(event.category),
            height: `${height}px`,
            marginBottom: '4px',
          }}
        >
          <div 
            draggable={editable && !isResizing}
            onDragStart={handleDragStart}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick?.(event);
            }}
            className="select-none pointer-events-auto"
          >
            <div className="font-semibold">{format(event.start, 'HH:mm')}</div>
            <div className="truncate">{event.title}</div>
          </div>
          
          {/* Resize handle - always visible when editable */}
          {editable && onEventResize && (
            <div
              onMouseDown={handleMouseDown}
              className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize bg-white/20 hover:bg-white/40 transition-colors flex items-center justify-center"
              title="Drag to resize"
            >
              <div className="w-6 h-0.5 bg-white/70 rounded-full" />
            </div>
          )}
        </div>
      );

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {eventContent}
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={4}>
            <EventTooltipContent event={event} />
          </TooltipContent>
        </Tooltip>
      );
    };

    // Get days for views
    const getMonthDays = (): Date[] => {
      const monthStart = startOfMonth(currentDate);
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

    const getWeekDays = (): Date[] => {
      const weekStart = startOfWeekFn(currentDate, { weekStartsOn: 1 });
      return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    };

    const days = view === 'month' ? getMonthDays() : view === 'week' ? getWeekDays() : [currentDate];
    const headerTitle = view === 'day' ? format(currentDate, 'EEEE, MMMM d, yyyy') : format(currentDate, 'MMMM yyyy');

    return (
      <TooltipProvider delayDuration={0}>
        <div ref={ref} className={cn(eventCalendarVariants(), className)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">{headerTitle}</h2>
            <div className="flex items-center gap-1">
              <button onClick={handlePrevious} className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={handleNext} className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleToday} className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              {t.today}
            </button>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {(['month', 'week', 'day'] as CalendarView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => handleViewChange(v)}
                  className={cn(
                    'px-3 py-1 text-sm font-medium rounded-md transition-colors capitalize',
                    view === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  {v === 'month' ? t.month : v === 'week' ? t.week : t.day}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Views */}
        <div className={cn('transition-all duration-150', isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100')}>
          
          {/* MONTH VIEW */}
          {view === 'month' && (
            <>
              <div className="grid grid-cols-7 mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => {
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isTodayDate = isToday(day);
                  const isPastDay = isPast(day) && !isTodayDate;
                  const dayEvents = getEventsForDay(day);

                  return (
                    <div
                      key={index}
                      className={cn(
                        'bg-white rounded-lg transition-colors relative overflow-hidden',
                        size === 'small' ? 'min-h-[60px]' : 'min-h-[100px]',
                        !isCurrentMonth && 'bg-gray-50',
                        isSelected && 'ring-2 ring-inset ring-stone-900',
                        isPastDay ? 'bg-gray-50/80 p-4' : size === 'small' ? 'p-1.5' : 'p-2',
                        onSlotClick && !isPastDay && 'cursor-pointer hover:bg-gray-50'
                      )}
                      onDragOver={(e) => handleDragOver(e, day)}
                      onDrop={(e) => handleDrop(e, day)}
                      onClick={() => !isPastDay && onSlotClick?.(day)}
                    >
                      {/* Diagonal stripes for past days */}
                      {isPastDay && (
                        <div 
                          className="absolute inset-0 pointer-events-none opacity-50"
                          style={{
                            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(0,0,0,0.06) 6px, rgba(0,0,0,0.06) 8px)'
                          }}
                        />
                      )}
                      
                      <div className="flex items-center justify-between mb-1 relative z-10">
                        <span
                          className={cn(
                            'text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full',
                            isTodayDate ? 'bg-orange-500 text-white' : 
                            isPastDay ? 'bg-gray-400 text-white' :
                            isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                          )}
                        >
                          {format(day, 'd')}
                        </span>
                        
                        {/* More events indicator - top right (hidden in small size) */}
                        {size !== 'small' && dayEvents.length > 2 && (
                          <span className={cn(
                            'text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100',
                            isPastDay ? 'text-gray-400' : 'text-gray-600'
                          )}>
                            +{dayEvents.length - 2} {t.events}
                          </span>
                        )}
                      </div>
                      {/* Small size: show dots only */}
                      {size === 'small' ? (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {dayEvents.slice(0, 4).map((event, i) => (
                            <div
                              key={i}
                              className={cn(
                                'w-2 h-2 rounded-full',
                                isPastDay ? 'bg-gray-400' : ''
                              )}
                              style={{ backgroundColor: isPastDay ? undefined : getCategoryColor(event.category) }}
                            />
                          ))}
                          {dayEvents.length > 4 && (
                            <span className="text-[10px] text-gray-500 leading-none">+</span>
                          )}
                        </div>
                      ) : (
                        <>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map((event) => (
                              <EventItem 
                                key={event.id} 
                                event={event} 
                                variant="month"
                                editable={editable}
                                getCategoryColor={getCategoryColor}
                                handleDragStart={handleDragStart}
                                onEventClick={onEventClick}
                                isPastDay={isPastDay}
                                renderEvent={renderEvent}
                                t={t}
                                hourFormat={hourFormat}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* WEEK VIEW */}
          {view === 'week' && (
            <div className="border border-gray-200 rounded-lg overflow-hidden max-h-[600px] overflow-y-auto">
              {/* Header - sticky so it stays visible when scrolling */}
              {/* Calculate max overlapping events per day for column width */}
              {(() => {
                const minHour = hours[0];
                const maxHour = hours[hours.length - 1];
                const dayMaxSlots = days.map(day => {
                  const dayEvents = getEventsForDay(day).filter(e => {
                    if (e.allDay) return false;
                    const eventHour = e.start.getHours();
                    return eventHour >= minHour && eventHour <= maxHour;
                  });
                  
                  let maxSlots = 1;
                  const sortedEvents = [...dayEvents].sort((a, b) => a.start.getTime() - b.start.getTime());
                  const activeEvents: CalendarEvent[] = [];
                  
                  sortedEvents.forEach(event => {
                    // Remove events that have ended
                    const stillActive = activeEvents.filter(e => e.end.getTime() > event.start.getTime());
                    activeEvents.length = 0;
                    activeEvents.push(...stillActive);
                    activeEvents.push(event);
                    maxSlots = Math.max(maxSlots, activeEvents.length);
                  });
                  
                  return maxSlots;
                });
                
                const maxSlotsOverall = Math.max(1, ...dayMaxSlots);
                const columnWidthMultiplier = maxSlotsOverall > 5 ? Math.min(maxSlotsOverall / 5, 2) : 1; // Max 2x width
                
                return (
                  <>
                    {/* Header */}
                    <div className="grid sticky top-0 z-30" style={{ gridTemplateColumns: `12.5% repeat(7, ${12.5 * columnWidthMultiplier}%)` }}>
                      <div className="p-3 text-center text-sm font-medium text-gray-500 border-r border-gray-200 bg-white">{t.time}</div>
                      {days.map((day, idx) => {
                        const isPastDay = isPast(day) && !isToday(day);
                        const isTodayDate = isToday(day);
                        const thisDayMaxSlots = dayMaxSlots[idx];
                        const thisDayMultiplier = thisDayMaxSlots > 5 ? Math.min(thisDayMaxSlots / 5, 2) : 1;
                        
                        return (
                          <div
                            key={day.toISOString()}
                            className={cn(
                              'p-3 text-center border-r border-gray-200 last:border-r-0',
                              isPastDay ? 'bg-gray-200' : 'bg-white',
                              isTodayDate && 'ring-2 ring-inset ring-black'
                            )}
                            style={{ minWidth: thisDayMultiplier > 1 ? `${100 * (thisDayMultiplier - 1)}px` : undefined }}
                          >
                            <div className={cn(
                              'text-sm font-semibold',
                              isPastDay ? 'text-gray-500' : 'text-gray-900'
                            )}>
                              {format(day, 'EEE')}
                            </div>
                            <div className={cn(
                              'text-lg w-8 h-8 mx-auto flex items-center justify-center mt-1',
                              isPastDay ? 'text-gray-500' : 'text-gray-900'
                            )}>
                              {format(day, 'd')}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Grid rows with dynamic column widths */}
                    <div className="relative">
                      {hours.map((hour) => (
                        <div key={hour} className="grid border-b border-gray-100 h-[60px] relative" style={{ gridTemplateColumns: `12.5% repeat(7, ${12.5 * columnWidthMultiplier}%)` }}>
                          {/* 30-min dashed line */}
                          <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-gray-300 pointer-events-none z-0" />
                          <div className="p-2 text-center text-xs text-gray-500 border-r border-gray-200 bg-gray-50 flex items-center justify-center relative z-10">
                            {formatHour(hour)}
                          </div>
                          {days.map((day, dayIndex) => {
                            const isDropTarget = dropTarget?.hour === hour && isSameDay(dropTarget.day, day);
                            const isHalfHourTarget = isDropTarget && dropTarget?.isHalfHour;
                            const isPastDay = isPast(day) && !isToday(day);
                            return (
                              <div
                                key={`${day}-${hour}`}
                                className={cn(
                                  'border-r border-gray-100 last:border-r-0 relative transition-all duration-200',
                                  onSlotClick && !isPastDay && 'cursor-pointer'
                                )}
                                onDragOver={(e) => handleDragOver(e, day, hour, 60)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, day, hour, 60)}
                                onClick={() => !isPastDay && onSlotClick?.(day, hour)}
                              >
                                {/* Drop target highlight - positioned at top half (:00) or bottom half (:30) */}
                                {isDropTarget && (
                                  <div 
                                    className={cn(
                                      'absolute left-0 right-0 bg-blue-100 ring-1 ring-inset ring-blue-400 transition-all duration-150 pointer-events-none',
                                      isHalfHourTarget ? 'top-1/2 bottom-0' : 'top-0 bottom-1/2'
                                    )}
                                  >
                                    <div className={cn(
                                      'absolute left-0 right-0 h-0.5 bg-blue-500 animate-pulse',
                                      isHalfHourTarget ? 'top-0' : 'bottom-0'
                                    )} />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                      
                      {/* Events overlay - calculate slots per day */}
                      {days.map((day, dayIndex) => {
                        const minHour = hours[0];
                        const maxHour = hours[hours.length - 1];
                        const dayEvents = getEventsForDay(day).filter(e => {
                          if (e.allDay) return false;
                          const eventHour = e.start.getHours();
                          return eventHour >= minHour && eventHour <= maxHour;
                        });
                        
                        // Group overlapping events
                        const sortedEvents = [...dayEvents].sort((a, b) => a.start.getTime() - b.start.getTime());
                        const eventGroups: { event: CalendarEvent; slot: number; totalSlots: number }[] = [];
                        
                        sortedEvents.forEach((event) => {
                          const overlapping = eventGroups.filter(eg => {
                            const egEnd = eg.event.end.getTime();
                            const eventEnd = event.end.getTime();
                            const egStart = eg.event.start.getTime();
                            const eventStart = event.start.getTime();
                            return (egStart < eventEnd && egEnd > eventStart);
                          });
                          
                          const usedSlots = new Set(overlapping.map(eg => eg.slot));
                          let slot = 0;
                          while (usedSlots.has(slot)) slot++;
                          
                          const totalSlots = Math.max(slot + 1, overlapping.length + 1);
                          
                          overlapping.forEach(eg => {
                            eg.totalSlots = Math.max(eg.totalSlots, totalSlots);
                          });
                          
                          eventGroups.push({ event, slot, totalSlots });
                        });
                        
                        return eventGroups.map(({ event, slot, totalSlots }) => (
                          <WeekDayEvent 
                            key={event.id} 
                            event={event} 
                            dayIndex={dayIndex}
                            rowHeight={60}
                            editable={editable}
                            getCategoryColor={getCategoryColor}
                            setDraggedEvent={setDraggedEvent}
                            onEventClick={onEventClick}
                            onEventResize={onEventResize}
                            isDragging={draggedEvent?.id === event.id}
                            renderEvent={renderEvent}
                            t={t}
                            hourFormat={hourFormat}
                            startHour={hours[0]}
                            slot={slot}
                            totalSlots={totalSlots}
                            columnWidthMultiplier={columnWidthMultiplier}
                          />
                        ));
                      })}
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* DAY VIEW */}
          {view === 'day' && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className={cn(
                'p-4 bg-gray-50 border-b border-gray-200 text-center',
                isToday(currentDate) && 'ring-2 ring-inset ring-black'
              )}>
                <div className="text-sm font-medium text-gray-500">{format(currentDate, 'EEEE')}</div>
                <div className={cn(
                  'text-3xl font-bold mt-1 w-12 h-12 mx-auto flex items-center justify-center rounded-full',
                  isToday(currentDate) ? 'bg-orange-500 text-white' : 'text-gray-900'
                )}>
                  {format(currentDate, 'd')}
                </div>
              </div>
              <div className="max-h-[600px] overflow-y-auto relative">
                <div className="relative">
                  {/* Hour grid lines */}
                  {hours.map((hour) => {
                    const isDropTarget = dropTarget?.hour === hour && isSameDay(dropTarget.day, currentDate);
                    const isHalfHourTarget = isDropTarget && dropTarget?.isHalfHour;
                    const isPastDay = isPast(currentDate) && !isToday(currentDate);
                    return (
                      <div key={hour} className="flex border-b border-gray-100 h-[70px] relative">
                        {/* 30-min dashed line */}
                        <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-gray-300 pointer-events-none z-0" />
                        <div className="w-20 p-3 text-center text-sm text-gray-500 border-r border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 relative z-10">
                          {formatHour(hour)}
                        </div>
                        <div
                          className={cn(
                            'flex-1 relative transition-all duration-200',
                            onSlotClick && !isPastDay && 'cursor-pointer'
                          )}
                          onDragOver={(e) => handleDragOver(e, currentDate, hour, 70)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, currentDate, hour, 70)}
                          onClick={() => !isPastDay && onSlotClick?.(currentDate, hour)}
                        >
                          {/* Drop target highlight - positioned at top half (:00) or bottom half (:30) */}
                          {isDropTarget && (
                            <div 
                              className={cn(
                                'absolute left-0 right-0 bg-blue-100 ring-1 ring-inset ring-blue-400 transition-all duration-150 pointer-events-none',
                                isHalfHourTarget ? 'top-1/2 bottom-0' : 'top-0 bottom-1/2'
                              )}
                            >
                              <div className={cn(
                                'absolute left-0 right-0 h-0.5 bg-blue-500 animate-pulse',
                                isHalfHourTarget ? 'top-0' : 'bottom-0'
                              )} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {/* Events overlay - only show events within the configured hour range */}
                  {(() => {
                    const minHour = hours[0];
                    const maxHour = hours[hours.length - 1];
                    return getEventsForDay(currentDate)
                      .filter(e => {
                        if (e.allDay) return false;
                        const eventHour = e.start.getHours();
                        return eventHour >= minHour && eventHour <= maxHour;
                      });
                  })()
                    .map((event) => {
                      const startHourValue = hours[0];
                      const startMinutes = getEventStartMinutes(event);
                      const durationHours = getEventDurationHours(event);
                      // Adjust top position based on startHour
                      const adjustedStartMinutes = startMinutes - (startHourValue * 60);
                      const top = (adjustedStartMinutes / 60) * 70;
                      const height = durationHours * 70;
                      
                      const isDragging = draggedEvent?.id === event.id;

                      // If custom renderEvent is provided, use it
                      if (renderEvent) {
                        return (
                          <div
                            key={event.id}
                            className={cn(
                              'absolute left-24 z-20 w-fit',
                              isDragging && 'opacity-50 scale-95'
                            )}
                            style={{
                              top: `${top}px`,
                              height: `${height}px`,
                            }}
                          >
                            {renderEvent(event, {
                              variant: 'day',
                              isPastDay: false,
                              draggable: editable,
                              onDragStart: () => setDraggedEvent(event),
                              onClick: () => onEventClick?.(event),
                            })}
                          </div>
                        );
                      }
                      
                      const dayEventContent = (
                        <div
                          key={event.id}
                          className={cn(
                            'absolute left-24 z-20 rounded-lg px-3 py-2 text-sm text-white font-medium cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap',
                            isDragging && 'opacity-50 scale-95 ring-2 ring-white shadow-lg'
                          )}
                          style={{
                            backgroundColor: getCategoryColor(event.category),
                            top: `${top}px`,
                            height: `${height}px`,
                          }}
                          draggable={editable}
                          onDragStart={() => setDraggedEvent(event)}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick?.(event);
                          }}
                        >
                          <div className="font-semibold">{format(event.start, 'HH:mm')}</div>
                          <div className="truncate">{event.title}</div>
                          
                          {/* Resize handle */}
                          {editable && onEventResize && (
                            <div
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!editable || !onEventResize) return;
                                
                                const startY = e.clientY;
                                const item = e.currentTarget.parentElement as HTMLElement;
                                const startHeight = item.offsetHeight;
                                
                                const handleMouseMove = (moveEvent: MouseEvent) => {
                                  const deltaY = moveEvent.clientY - startY;
                                  // Snap to 30-min increments (70px / 2 = 35px)
                                  const snapHeight = 35;
                                  const rawHeight = startHeight + deltaY;
                                  const snappedHeight = Math.max(snapHeight, Math.round(rawHeight / snapHeight) * snapHeight);
                                  item.style.height = `${snappedHeight}px`;
                                };

                                const handleMouseUp = (upEvent: MouseEvent) => {
                                  const deltaY = upEvent.clientY - startY;
                                  // Calculate 30-min blocks (70px row = 60 min, so 35px = 30 min)
                                  const halfHourBlocks = Math.round(deltaY / 35);
                                  const deltaMinutes = halfHourBlocks * 30;
                                  
                                  if (deltaMinutes !== 0 && onEventResize) {
                                    const newEnd = new Date(event.end);
                                    newEnd.setMinutes(newEnd.getMinutes() + deltaMinutes);
                                    
                                    // Ensure minimum duration of 30 minutes
                                    if (newEnd.getTime() - event.start.getTime() >= 30 * 60 * 1000) {
                                      onEventResize(event, newEnd);
                                    }
                                  }
                                  
                                  document.removeEventListener('mousemove', handleMouseMove);
                                  document.removeEventListener('mouseup', handleMouseUp);
                                };

                                document.addEventListener('mousemove', handleMouseMove);
                                document.addEventListener('mouseup', handleMouseUp);
                              }}
                              className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-white/30 hover:bg-white/50 transition-colors flex items-end justify-center"
                            >
                              <div className="w-4 h-0.5 bg-white/70 rounded-full mb-0.5" />
                            </div>
                          )}
                        </div>
                      );

                      // Wrap with Tooltip
                      return (
                        <Tooltip key={event.id}>
                          <TooltipTrigger asChild>
                            {dayEventContent}
                          </TooltipTrigger>
                          <TooltipContent side="bottom" sideOffset={4}>
                            <EventTooltipContent event={event} />
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
    );
  }
);

EventCalendar.displayName = 'EventCalendar';
