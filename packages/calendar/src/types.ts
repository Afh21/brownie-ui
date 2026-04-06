import * as React from 'react';

export type CalendarView = 'month' | 'week' | 'day';

/**
 * Category definition for event coloring.
 * 
 * @example
 * // Define custom categories with your brand colors
 * const myCategories = [
 *   { id: 'meeting', name: 'Meeting', color: '#3b82f6' },    // Blue
 *   { id: 'deadline', name: 'Deadline', color: '#ef4444' },  // Red  
 *   { id: 'personal', name: 'Personal', color: '#10b981' },  // Green
 *   { id: 'reminder', name: 'Reminder', color: '#f59e0b' },  // Amber
 * ];
 * 
 * // Use in your event data by referencing the category id
 * const events = [
 *   { id: '1', title: 'Team Standup', start: new Date(), end: new Date(), category: 'meeting' }
 * ];
 */
export interface EventCategory {
  /** Unique identifier for the category - reference this in CalendarEvent.category */
  id: string;
  /** Display name shown in the legend */
  name: string;
  /** Hex color code (e.g., '#3b82f6', 'rgb(59, 130, 246)') */
  color: string;
  /** Optional icon to display next to the category name */
  icon?: React.ReactNode;
}

/**
 * Event data structure.
 * Assign a category id to apply custom colors (defined in categories prop).
 */
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  /** Reference to EventCategory.id - determines event color */
  category?: string;
  description?: string;
  allDay?: boolean;
}

export type HourFormat = '12h' | '24h';
export type Locale = 'en' | 'es';

/**
 * Calendar size variant.
 * - `small`: Compact view showing only dots for events (no drag & drop)
 * - `medium`: Default size with full event display
 * - `big`: Larger size with full event display
 */
export type CalendarSize = 'small' | 'medium' | 'big';

export interface EventCalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Current selected date (controlled) */
  value?: Date;
  /** Default selected date (uncontrolled) */
  defaultDate?: Date;
  /** Hour format: 12h (02:00 PM) or 24h (14:00) */
  hourFormat?: HourFormat;
  /** Called when selected date changes */
  onChange?: (date: Date) => void;
  
  /** Array of events to display */
  events?: CalendarEvent[];
  /** 
   * Category definitions for event coloring.
   * Each event with a matching category id will use that color.
   * 
   * @example
   * // Custom brand colors
   * categories={[
   *   { id: 'primary', name: 'Primary', color: '#0ea5e9' },
   *   { id: 'secondary', name: 'Secondary', color: '#8b5cf6' },
   *   { id: 'success', name: 'Success', color: '#22c55e' },
   *   { id: 'warning', name: 'Warning', color: '#f97316' },
   * ]}
   */
  categories?: EventCategory[];
  
  /** Current view (controlled) */
  view?: CalendarView;
  /** Called when view changes */
  onViewChange?: (view: CalendarView) => void;
  
  /** Called when user clicks on an event */
  onEventClick?: (event: CalendarEvent) => void;
  /** Called when user clicks on a slot (date/hour) - use this to create events */
  onSlotClick?: (date: Date, hour?: number) => void;
  /** Called when user drops an event via drag & drop - use this to update event date */
  onEventDrop?: (event: CalendarEvent, newDate: Date) => void;
  /** Called when user resizes an event (drag bottom border) - use this to update event duration */
  onEventResize?: (event: CalendarEvent, newEndDate: Date) => void;
  
  /** Enable drag & drop functionality */
  editable?: boolean;
  /** Show category legend at bottom */
  showLegend?: boolean;
  /** Locale for translations: 'en' | 'es' (default: 'es') */
  locale?: Locale;
  /** 
   * Calendar size variant (default: 'medium')
   * - 'small': Shows dots instead of events (no drag & drop)
   * - 'medium' | 'big': Full event display
   */
  size?: CalendarSize;
  /** 
   * Custom render function for events - makes the calendar headless.
   * 
   * @example
   * // Render events with your own components
   * renderEvent={(event, { variant, draggable, onDragStart, onClick }) => (
   *   <MyCustomCard
   *     title={event.title}
   *     time={format(event.start, 'HH:mm')}
   *     color={getCategoryColor(event.category)}
   *     draggable={draggable}
   *     onDragStart={onDragStart}
   *     onClick={onClick}
   *   />
   * )}
   */
  renderEvent?: (event: CalendarEvent, props: { 
    variant: 'month' | 'week' | 'day';
    isPastDay?: boolean;
    draggable?: boolean;
    onDragStart?: () => void;
    onClick?: () => void;
  }) => React.ReactNode;
  
  /**
   * Start hour for Week/Day views (default: 0 - midnight)
   * @example startHour={6} // Start at 6:00 AM
   */
  startHour?: number;
  
  /**
   * End hour for Week/Day views (default: 24 - midnight)
   * @example endHour={18} // End at 6:00 PM
   */
  endHour?: number;
}
