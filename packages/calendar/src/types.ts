import * as React from 'react';

export type CalendarView = 'month' | 'week' | 'day';

export interface EventCategory {
  id: string;
  name: string;
  color: string;
  icon?: React.ReactNode;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  category?: string;
  description?: string;
  allDay?: boolean;
}

export interface CalendarProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  className?: string;
  view?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
}

export interface DatePickerProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
  format?: string;
}

export interface DateRangePickerProps {
  value?: { start: Date; end: Date };
  defaultValue?: { start: Date; end: Date };
  onChange?: (range: { start: Date; end: Date } | undefined) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
}

export interface EventCalendarProps extends CalendarProps {
  events: CalendarEvent[];
  categories?: EventCategory[];
  onEventClick?: (event: CalendarEvent) => void;
  onEventCreate?: (event: Omit<CalendarEvent, 'id'>) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  onDrop?: (event: CalendarEvent, newDate: Date) => void;
  editable?: boolean;
  showLegend?: boolean;
}
